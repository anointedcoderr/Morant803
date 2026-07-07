// Crowd simulation: bots drip small bets into open markets so pools
// and odds move live during the preview. Runs only while a tab is open.

import { loadState, mutate } from './store.js'
import { placeBet, impliedPct } from './markets.js'
import { uid } from './crypto.js'

export function startCrowdSim() {
  let stopped = false
  let timer = null

  const tick = () => {
    if (stopped) return
    try {
      const state = loadState()
      if (state) {
        const open = state.markets.filter((m) => m.status === 'open')
        const bots = state.users.filter((u) => u.isBot)
        if (open.length && bots.length && Math.random() < 0.8) {
          const market = open[Math.floor(Math.random() * open.length)]
          const bot = bots[Math.floor(Math.random() * bots.length)]
          // Bots mostly follow the crowd, sometimes fade it.
          const pctA = impliedPct(state, market.id)
          const side = Math.random() * 100 < (Math.random() < 0.75 ? pctA : 100 - pctA) ? 'a' : 'b'
          const dollars = [10, 15, 20, 25, 40, 60, 100][Math.floor(Math.random() * 7)]
          mutate((s) => {
            try {
              placeBet(s, { userId: bot.id, marketId: market.id, side, amountCents: dollars * 100, key: uid() })
            } catch { /* bot broke or market closed mid-tick; fine */ }
          })
        }
      }
    } catch { /* never let the sim take the app down */ }
    timer = setTimeout(tick, 2800 + Math.random() * 3200)
  }

  timer = setTimeout(tick, 1800)
  return () => { stopped = true; clearTimeout(timer) }
}
