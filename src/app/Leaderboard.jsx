import { useMemo } from 'react'
import { Trophy } from 'lucide-react'
import AppShell from './AppShell.jsx'
import { useEngine, fmtUSD } from '../engine/index.jsx'
import { balanceOf } from '../engine/ledger.js'

const MEDALS = ['text-warning', 'text-muted', 'text-[#c9822e]']

export default function Leaderboard() {
  const engine = useEngine()
  const { state, user } = engine

  const rows = useMemo(() => {
    return state.users
      .map((u) => {
        const cash = balanceOf(state, `user:${u.id}:cash`)
        // Net contributions = grants + deposits - withdrawals, so P/L reflects
        // betting performance only (moving money out is not a "loss").
        const contributed = state.ledger.reduce((s, tx) => {
          if (!(tx.memo.startsWith('Deposit') || tx.memo.startsWith('Play-money') || tx.memo.startsWith('Withdrawal'))) return s
          for (const e of tx.entries) if (e.account === `user:${u.id}:cash`) s += e.delta
          return s
        }, 0)
        const atRisk = state.bets.filter((b) => b.userId === u.id && b.status === 'open').reduce((s, b) => s + b.amountCents, 0)
        const bets = state.bets.filter((b) => b.userId === u.id).length
        return { id: u.id, name: u.name, isBot: u.isBot, isMe: u.id === user?.id, bets, pnl: cash + atRisk - contributed }
      })
      .filter((r) => r.bets > 0 || r.isMe)
      .sort((a, b) => b.pnl - a.pnl)
      .slice(0, 25)
  }, [state, user])

  return (
    <AppShell title="Leaderboard">
      <p className="mb-6 max-w-xl text-sm text-muted">Net profit and loss across the Aug 1 card, live. Open stakes count at cost until their market settles. Simulated crowd players are marked <span className="rounded-full border border-default bg-white/5 px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted">sim</span>.</p>
      <div className="overflow-x-auto rounded-2xl border border-default">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-default bg-surface font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              <th scope="col" className="px-4 py-3 font-medium">Rank</th>
              <th scope="col" className="px-4 py-3 font-medium">Player</th>
              <th scope="col" className="px-4 py-3 font-medium">Bets</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Net P/L</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className={`border-b border-default/60 last:border-0 ${r.isMe ? 'bg-brand/5' : ''}`}>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 font-mono ${i < 3 ? MEDALS[i] : 'text-muted'}`}>
                    {i < 3 && <Trophy className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />}#{i + 1}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-default">
                  {r.name}
                  {r.isMe && <span className="ml-2 rounded-full border border-brand/40 bg-brand/10 px-2 py-0.5 font-mono text-[10px] uppercase text-brand">you</span>}
                  {r.isBot && <span className="ml-2 rounded-full border border-default bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase text-muted">sim</span>}
                </td>
                <td className="tnum px-4 py-3 font-mono text-muted">{r.bets}</td>
                <td className={`tnum px-4 py-3 text-right font-mono font-semibold ${r.pnl >= 0 ? 'text-accent' : 'text-danger'}`}>{fmtUSD(r.pnl, { sign: true })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}
