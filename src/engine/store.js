// State persistence + seed for the play-money preview.
// The state shape mirrors the production database schema (users, markets,
// bets, ledger) so the whole engine lifts into the backend unchanged.

import { hashPassword } from './crypto.js'
import { post } from './ledger.js'
import { placeBet } from './markets.js'

const STATE_KEY = 'betitup_state_v1'
const SESSION_KEY = 'betitup_session_v1'

const listeners = new Set()
export const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn) }
const notify = () => listeners.forEach((fn) => fn())

if (typeof window !== 'undefined') {
  // e.key === null means the whole storage was cleared.
  window.addEventListener('storage', (e) => {
    if (e.key === STATE_KEY || e.key === SESSION_KEY || e.key === null) notify()
  })
}

export function loadState() {
  try { return JSON.parse(localStorage.getItem(STATE_KEY)) } catch { return null }
}
export function saveState(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state))
  notify()
}

export function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) } catch { return null }
}
export function saveSession(session) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(SESSION_KEY)
  notify()
}

/** Run a mutation against the persisted state atomically-enough for a demo. */
export function mutate(fn) {
  const state = loadState()
  if (!state) throw new Error('State not ready')
  const result = fn(state)
  saveState(state)
  return result
}

// ---- Seed ----

const FIGHT_SEED = [
  { tier: 'Main event', tag: "Men's bout", a: { name: 'Cashy', initials: 'CA' }, b: { name: 'Dee', initials: 'DE' }, lean: 0.54, depth: 8800 },
  { tier: 'Co-main', tag: "Men's bout", a: { name: 'Moses', initials: 'MO' }, b: { name: 'Tristate', initials: 'TR' }, lean: 0.61, depth: 5700 },
  { tier: 'Featured', tag: "Women's bout", a: { name: 'Queen D', initials: 'QD' }, b: { name: 'Legacy', initials: 'LG' }, lean: 0.47, depth: 4400 },
  { tier: 'Featured', tag: "Men's bout", a: { name: 'Ali', initials: 'AL' }, b: { name: 'Levi', initials: 'LV' }, lean: 0.58, depth: 3300 },
  { tier: 'Undercard', tag: "Women's bout", a: { name: 'Judy', initials: 'JU' }, b: { name: 'Becca', initials: 'BE' }, lean: 0.65, depth: 2100 },
  { tier: 'Undercard', tag: "Women's bout", a: { name: 'Day Day', initials: 'DD' }, b: { name: 'Fiji', initials: 'FJ' }, lean: 0.52, depth: 1800 },
]

const BOT_NAMES = [
  'TopRope Tony', 'RingsideRia', 'KO Kelvin', 'FightNightFran', 'SouthpawSasha', 'JabStepJay',
  'CornerCoach', 'UppercutUna', 'BellToBell', 'CanvasCarter', 'HaymakerHolly', 'ClinchKing',
]

let seedInFlight = null

export function ensureSeed() {
  if (loadState()) return Promise.resolve()
  if (!seedInFlight) {
    seedInFlight = buildSeed().finally(() => { seedInFlight = null })
  }
  return seedInFlight
}

async function buildSeed() {
  const now = Date.now()
  const state = {
    version: 1,
    createdAt: now,
    settings: {
      rakePct: 0.05,
      minStakeCents: 500,
      maxStakeCents: 250_000,
      dailyDepositCapCents: 1_000_000,
      signupGrantCents: 100_000, // every new account starts with $1,000 play-money
      event: { title: 'The Aug 1 Card', dateLabel: 'August 1, 2026', venue: 'Streaming on NowThatsTV' },
    },
    users: [],
    markets: [],
    bets: [],
    ledger: [],
  }

  // Accounts: demo admin + demo member + crowd bots.
  const adminHash = await hashPassword('betitup803')
  const demoHash = await hashPassword('demo1234')
  const admin = {
    id: 'u-admin', name: 'Bet It Up Admin', email: 'admin@betitup.demo', hash: adminHash,
    isAdmin: true, isBot: false, createdAt: now, selfExcludedUntil: null,
    depositedTodayCents: 0, lastDepositDay: '', dailyDepositCapCents: null,
  }
  const demo = {
    id: 'u-demo', name: 'Demo Member', email: 'demo@betitup.demo', hash: demoHash,
    isAdmin: false, isBot: false, createdAt: now, selfExcludedUntil: null,
    depositedTodayCents: 0, lastDepositDay: '', dailyDepositCapCents: null,
  }
  state.users.push(admin, demo)
  const bots = BOT_NAMES.map((name, i) => ({
    id: `bot-${i}`, name, email: `bot${i}@betitup.demo`, hash: '',
    isAdmin: false, isBot: true, createdAt: now, selfExcludedUntil: null,
    depositedTodayCents: 0, lastDepositDay: '', dailyDepositCapCents: null,
  }))
  state.users.push(...bots)

  // Fund accounts from the treasury (the play-money mint).
  const grants = [
    { account: `user:${admin.id}:cash`, amount: 500_000 },
    { account: `user:${demo.id}:cash`, amount: 100_000 },
    ...bots.map((b) => ({ account: `user:${b.id}:cash`, amount: 2_000_000 })),
  ]
  for (const g of grants) {
    post(state, {
      key: `grant:${g.account}`, memo: 'Play-money starting balance',
      entries: [
        { account: 'house:treasury', delta: -g.amount },
        { account: g.account, delta: g.amount },
      ],
    })
  }

  // Markets.
  state.markets = FIGHT_SEED.map((f, i) => ({
    id: `m-${i}`, order: i, tier: f.tier, tag: f.tag, a: f.a, b: f.b,
    status: 'open', winner: null, createdAt: now, settledAt: null, settledBy: null,
  }))

  // Seed the pools with genuine bot bets so odds and pools are alive from first load.
  FIGHT_SEED.forEach((f, i) => {
    const marketId = `m-${i}`
    const betsCount = 10 + Math.floor(Math.random() * 6)
    for (let k = 0; k < betsCount; k++) {
      const bot = bots[Math.floor(Math.random() * bots.length)]
      const side = Math.random() < f.lean ? 'a' : 'b'
      const dollars = 20 + Math.floor(Math.random() * (f.depth / betsCount))
      try {
        placeBet(state, { userId: bot.id, marketId, side, amountCents: dollars * 100, key: `seed:${marketId}:${k}` })
      } catch { /* a bot ran dry; skip */ }
    }
  })

  // A concurrent caller may have seeded while we were hashing; keep theirs.
  if (!loadState()) saveState(state)
}

export function resetDemo() {
  localStorage.removeItem(STATE_KEY)
  localStorage.removeItem(SESSION_KEY)
}
