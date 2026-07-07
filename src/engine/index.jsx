// Engine context: one hook (useEngine) gives every page the live state,
// the signed-in user, and safe actions that all return { ok, error }.

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { ensureSeed, loadState, loadSession, saveSession, mutate, subscribe, resetDemo } from './store.js'
import { balanceOf, entriesFor, fmtUSD } from './ledger.js'
import {
  poolTotals, impliedPct, estimatePayout, placeBet, settle, setMarketStatus, deposit, withdraw,
} from './markets.js'
import { prepareSignup, createUser, verifyLogin, setSelfExclusion, setDepositCap } from './auth.js'
import { startCrowdSim } from './sim.js'
import { uid } from './crypto.js'

const EngineCtx = createContext(null)
export const useEngine = () => useContext(EngineCtx)
export { fmtUSD }

const wrap = (fn) => {
  try { return { ok: true, value: fn() } } catch (e) { return { ok: false, error: e.message } }
}

export function EngineProvider({ children }) {
  const [ready, setReady] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    let stopSim = () => {}
    let unsub = () => {}
    ensureSeed().then(() => {
      if (cancelled) return
      setReady(true)
      unsub = subscribe(() => setTick((t) => t + 1))
      stopSim = startCrowdSim()
    })
    return () => { cancelled = true; unsub(); stopSim() }
  }, [])

  const value = useMemo(() => {
    if (!ready) return null
    const state = loadState()
    // State can vanish mid-session (demo reset in another tab, cleared site
    // data). Render the loading fallback and reseed instead of crashing.
    if (!state) return null
    const session = loadSession()
    const user = session ? state.users.find((u) => u.id === session.userId) || null : null

    return {
      state,
      user,
      settings: state.settings,
      markets: [...state.markets].sort((a, b) => a.order - b.order),
      balance: user ? balanceOf(state, `user:${user.id}:cash`) : 0,
      history: user ? entriesFor(state, `user:${user.id}:cash`) : [],
      myBets: user ? state.bets.filter((b) => b.userId === user.id).sort((a, b) => b.ts - a.ts) : [],
      pool: (marketId) => poolTotals(state, marketId),
      pctA: (marketId) => impliedPct(state, marketId),
      estimate: (marketId, side, stakeCents) => estimatePayout(state, marketId, side, stakeCents, state.settings.rakePct),

      actions: {
        signup: async ({ name, email, password, ageConfirmed }) => {
          try {
            const prepared = await prepareSignup({ name, email, password, ageConfirmed })
            const created = mutate((s) => createUser(s, prepared))
            saveSession({ userId: created.id, token: uid(), ts: Date.now() })
            return { ok: true }
          } catch (e) { return { ok: false, error: e.message } }
        },
        login: async ({ email, password }) => {
          try {
            const s = loadState()
            const session = await verifyLogin(s, { email, password })
            saveSession(session)
            return { ok: true }
          } catch (e) { return { ok: false, error: e.message } }
        },
        logout: () => { saveSession(null); return { ok: true } },
        placeBet: ({ marketId, side, amountCents }) =>
          wrap(() => mutate((s) => placeBet(s, { userId: user?.id, marketId, side, amountCents, key: uid() }))),
        deposit: ({ amountCents, method }) =>
          wrap(() => mutate((s) => deposit(s, { userId: user?.id, amountCents, method, key: uid() }))),
        withdraw: ({ amountCents, method }) =>
          wrap(() => mutate((s) => withdraw(s, { userId: user?.id, amountCents, method, key: uid() }))),
        settle: ({ marketId, winner }) =>
          wrap(() => mutate((s) => settle(s, { marketId, winner, byUserId: user?.id }))),
        setMarketStatus: (marketId, status) =>
          wrap(() => mutate((s) => setMarketStatus(s, marketId, status))),
        selfExclude: (ms) => wrap(() => mutate((s) => setSelfExclusion(s, user?.id, ms))),
        setDepositCap: (capCents) => wrap(() => mutate((s) => setDepositCap(s, user?.id, capCents))),
        resetDemo: () => { resetDemo(); window.location.assign('/') },
      },
    }
  }, [ready, tick])

  // If the state disappeared underneath us, rebuild the seed and re-render.
  useEffect(() => {
    if (!ready || value) return
    let cancelled = false
    ensureSeed().then(() => { if (!cancelled) setTick((t) => t + 1) })
    return () => { cancelled = true }
  }, [ready, value])

  if (!ready || !value) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-page">
        <span className="font-mono text-sm text-muted">Loading Bet It Up...</span>
      </div>
    )
  }
  return <EngineCtx.Provider value={value}>{children}</EngineCtx.Provider>
}
