// Pari-mutuel market engine.
// Each market has two sides (a/b). Stakes flow into pool:<marketId>.
// Settlement takes the rake off the total pool and splits the rest
// pro-rata across winning stakes. Idempotent; if nobody backed the
// winner, every stake is refunded and no rake is taken.

import { post, balanceOf } from './ledger.js'
import { uid } from './crypto.js'

export const marketById = (state, id) => state.markets.find((m) => m.id === id)

export function poolTotals(state, marketId) {
  let a = 0, b = 0
  for (const bet of state.bets) {
    if (bet.marketId !== marketId || bet.status === 'refunded') continue
    if (bet.side === 'a') a += bet.amountCents
    else b += bet.amountCents
  }
  return { a, b, total: a + b }
}

/** Crowd probability for side A, as an integer percent (never 0 or 100 while both pools live). */
export function impliedPct(state, marketId) {
  const { a, b, total } = poolTotals(state, marketId)
  if (total === 0) return 50
  return Math.min(97, Math.max(3, Math.round((a / total) * 100)))
}

/** Estimated payout if `stakeCents` is added to `side` right now (pari-mutuel projection). */
export function estimatePayout(state, marketId, side, stakeCents, rakePct) {
  const { a, b } = poolTotals(state, marketId)
  const winPool = (side === 'a' ? a : b) + stakeCents
  const total = a + b + stakeCents
  if (winPool <= 0) return stakeCents
  const distributable = total - Math.floor(total * rakePct)
  return Math.floor((stakeCents / winPool) * distributable)
}

function assertCanBet(state, user, market, amountCents) {
  const s = state.settings
  if (!market) throw new Error('Market not found')
  if (market.status !== 'open') throw new Error('This market is not taking bets right now')
  if (!user) throw new Error('Sign in to place a bet')
  if (user.selfExcludedUntil && user.selfExcludedUntil > Date.now()) {
    throw new Error('Your account is in a self-exclusion period')
  }
  if (!Number.isInteger(amountCents) || amountCents <= 0) throw new Error('Enter a valid stake')
  if (amountCents < s.minStakeCents) throw new Error(`Minimum stake is $${s.minStakeCents / 100}`)
  if (amountCents > s.maxStakeCents) throw new Error(`Maximum stake is $${s.maxStakeCents / 100}`)
}

export function placeBet(state, { userId, marketId, side, amountCents, key }) {
  const user = state.users.find((u) => u.id === userId)
  const market = marketById(state, marketId)
  assertCanBet(state, user, market, amountCents)
  if (side !== 'a' && side !== 'b') throw new Error('Pick a side')

  const atPct = side === 'a' ? impliedPct(state, marketId) : 100 - impliedPct(state, marketId)
  const txKey = key || uid()
  const { duplicate } = post(state, {
    key: txKey,
    memo: `Bet on ${side === 'a' ? market.a.name : market.b.name} · ${market.a.name} vs ${market.b.name}`,
    entries: [
      { account: `user:${userId}:cash`, delta: -amountCents },
      { account: `pool:${marketId}`, delta: amountCents },
    ],
  })
  // Replayed key: the money already moved once; return the existing bet
  // instead of creating a second, unfunded record.
  if (duplicate) return state.bets.find((b) => b.key === txKey) || null
  const bet = {
    id: uid(), key: txKey, userId, marketId, side, amountCents,
    atPct, ts: Date.now(), status: 'open', payoutCents: 0,
  }
  state.bets.push(bet)
  return bet
}

export function setMarketStatus(state, marketId, status) {
  const market = marketById(state, marketId)
  if (!market) throw new Error('Market not found')
  if (market.status === 'settled') throw new Error('Market already settled')
  if (!['open', 'suspended'].includes(status)) throw new Error('Bad status')
  market.status = status
}

export function settle(state, { marketId, winner, key, byUserId }) {
  const market = marketById(state, marketId)
  if (!market) throw new Error('Market not found')
  if (market.status === 'settled') throw new Error('Market already settled')
  if (winner !== 'a' && winner !== 'b') throw new Error('Pick the winner')

  const open = state.bets.filter((b) => b.marketId === marketId && b.status === 'open')
  const { total } = poolTotals(state, marketId)
  const winners = open.filter((b) => b.side === winner)
  const winPool = winners.reduce((s, b) => s + b.amountCents, 0)
  const txKey = key || `settle:${marketId}`

  if (total === 0) {
    // Nothing staked; just close it.
  } else if (winPool === 0) {
    // Nobody backed the winner: refund every stake, no rake.
    const entries = [{ account: `pool:${marketId}`, delta: -total }]
    for (const b of open) entries.push({ account: `user:${b.userId}:cash`, delta: b.amountCents })
    post(state, { key: txKey, memo: `Refund · ${market.a.name} vs ${market.b.name}`, entries })
    for (const b of open) { b.status = 'refunded'; b.payoutCents = b.amountCents }
  } else {
    const rake = Math.floor(total * state.settings.rakePct)
    const distributable = total - rake
    let paid = 0
    const entries = [{ account: `pool:${marketId}`, delta: -total }]
    for (const b of winners) {
      const payout = Math.floor((b.amountCents / winPool) * distributable)
      b.payoutCents = payout
      paid += payout
      entries.push({ account: `user:${b.userId}:cash`, delta: payout })
    }
    // Rake plus rounding dust goes to the house so the transaction balances exactly.
    entries.push({ account: 'house:rake', delta: total - paid })
    post(state, { key: txKey, memo: `Settled · ${market.a.name} vs ${market.b.name}`, entries })
    for (const b of open) b.status = b.side === winner ? 'won' : 'lost'
  }

  market.status = 'settled'
  market.winner = winner
  market.settledAt = Date.now()
  market.settledBy = byUserId || null
  return market
}

// ---- Wallet operations (play-money) ----

const dayKey = () => new Date().toISOString().slice(0, 10)

export function deposit(state, { userId, amountCents, method, key }) {
  const user = state.users.find((u) => u.id === userId)
  if (!user) throw new Error('Sign in first')
  if (!Number.isInteger(amountCents) || amountCents <= 0) throw new Error('Enter a valid amount')
  if (user.selfExcludedUntil && user.selfExcludedUntil > Date.now()) {
    throw new Error('Your account is in a self-exclusion period')
  }
  const today = dayKey()
  if (user.lastDepositDay !== today) { user.lastDepositDay = today; user.depositedTodayCents = 0 }
  const cap = user.dailyDepositCapCents ?? state.settings.dailyDepositCapCents
  if (user.depositedTodayCents + amountCents > cap) {
    throw new Error(`Daily deposit cap is $${cap / 100}`)
  }
  const { duplicate } = post(state, {
    key: key || uid(),
    memo: `Deposit · ${method}`,
    entries: [
      { account: 'house:treasury', delta: -amountCents },
      { account: `user:${userId}:cash`, delta: amountCents },
    ],
  })
  if (!duplicate) user.depositedTodayCents += amountCents
  return true
}

export function withdraw(state, { userId, amountCents, method, key }) {
  if (!Number.isInteger(amountCents) || amountCents <= 0) throw new Error('Enter a valid amount')
  if (balanceOf(state, `user:${userId}:cash`) < amountCents) throw new Error('Insufficient balance')
  post(state, {
    key: key || uid(),
    memo: `Withdrawal · ${method}`,
    entries: [
      { account: `user:${userId}:cash`, delta: -amountCents },
      { account: 'house:treasury', delta: amountCents },
    ],
  })
  return true
}
