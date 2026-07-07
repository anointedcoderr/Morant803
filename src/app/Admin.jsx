import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Gavel, PauseCircle, PlayCircle, RotateCcw, Landmark } from 'lucide-react'
import AppShell from './AppShell.jsx'
import { Button, FighterAvatar } from '../components/primitives.jsx'
import { useEngine, fmtUSD } from '../engine/index.jsx'
import { balanceOf } from '../engine/ledger.js'

export default function Admin() {
  const engine = useEngine()
  const [msg, setMsg] = useState(null)
  const [confirmFor, setConfirmFor] = useState(null) // {marketId, winner}

  if (!engine.user) return <Navigate to="/login?next=/admin" replace />
  if (!engine.user.isAdmin) {
    return (
      <AppShell title="Admin">
        <div className="rounded-2xl border border-warning/40 bg-warning/10 p-6 text-sm text-warning">
          This area is for operators. Sign in with the admin account (see the login page hints) to manage markets and settlement.
        </div>
      </AppShell>
    )
  }

  const { state, markets, actions, settings } = engine
  const rake = balanceOf(state, 'house:rake')
  const totalPooled = markets.reduce((s, m) => s + engine.pool(m.id).total, 0)
  const members = state.users.filter((u) => !u.isBot)

  const act = (res, okText) => setMsg(res.ok ? { tone: 'ok', text: okText } : { tone: 'err', text: res.error })

  const settleNow = () => {
    const { marketId, winner } = confirmFor
    const m = markets.find((x) => x.id === marketId)
    const name = winner === 'a' ? m.a.name : m.b.name
    setConfirmFor(null)
    act(engine.actions.settle({ marketId, winner }), `Settled: ${name} wins ${m.a.name} vs ${m.b.name}. Payouts are in wallets.`)
  }

  return (
    <AppShell title="Operator panel">
      {/* House stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          ['In pools right now', fmtUSD(totalPooled)],
          [`Rake collected (${Math.round(settings.rakePct * 100)}%)`, fmtUSD(rake)],
          ['Registered members', String(members.length)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-default bg-surface p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{k}</p>
            <p className="tnum mt-1.5 font-display text-3xl font-bold text-default">{v}</p>
          </div>
        ))}
      </div>

      {msg && (
        <p role={msg.tone === 'ok' ? 'status' : 'alert'} className={`mb-6 rounded-lg border px-3 py-2 text-sm ${msg.tone === 'ok' ? 'border-accent/40 bg-accent/10 text-accent' : 'border-danger/40 bg-danger/10 text-danger'}`}>
          {msg.text}
        </p>
      )}

      {/* Markets */}
      <h2 className="mb-4 font-display text-xl font-bold text-default">Markets</h2>
      <div className="space-y-4">
        {markets.map((m) => {
          const pool = engine.pool(m.id)
          const pctA = engine.pctA(m.id)
          return (
            <div key={m.id} className="rounded-2xl border border-default bg-surface p-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex min-w-[220px] items-center gap-3">
                  <FighterAvatar corner="red" initials={m.a.initials} size="sm" />
                  <div>
                    <p className="font-display text-[15px] font-semibold text-default">{m.a.name} vs {m.b.name}</p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">{m.tier} · {m.tag}</p>
                  </div>
                  <FighterAvatar corner="blue" initials={m.b.initials} size="sm" />
                </div>
                <div className="tnum font-mono text-[12.5px] text-muted">
                  Pool {fmtUSD(pool.total)} · {m.a.name} {pctA}% / {m.b.name} {100 - pctA}%
                </div>
                <div className="ml-auto flex flex-wrap items-center gap-2">
                  {m.status === 'settled' ? (
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] uppercase text-accent">
                      Settled · {m.winner === 'a' ? m.a.name : m.b.name} won
                    </span>
                  ) : (
                    <>
                      {m.status === 'open' ? (
                        <Button size="sm" variant="ghost" onClick={() => act(actions.setMarketStatus(m.id, 'suspended'), `${m.a.name} vs ${m.b.name} suspended.`)}>
                          <PauseCircle className="h-4 w-4" strokeWidth={2.2} /> Suspend
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => act(actions.setMarketStatus(m.id, 'open'), `${m.a.name} vs ${m.b.name} reopened.`)}>
                          <PlayCircle className="h-4 w-4" strokeWidth={2.2} /> Reopen
                        </Button>
                      )}
                      <Button size="sm" onClick={() => setConfirmFor({ marketId: m.id, winner: 'a' })}>
                        <Gavel className="h-4 w-4" strokeWidth={2.2} /> {m.a.name} won
                      </Button>
                      <Button size="sm" onClick={() => setConfirmFor({ marketId: m.id, winner: 'b' })}>
                        <Gavel className="h-4 w-4" strokeWidth={2.2} /> {m.b.name} won
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {confirmFor?.marketId === m.id && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3">
                  <p className="text-sm text-warning">
                    Declare <b>{confirmFor.winner === 'a' ? m.a.name : m.b.name}</b> the winner and pay out {fmtUSD(pool.total)}? This settles the market permanently.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setConfirmFor(null)}>Cancel</Button>
                    <Button size="sm" onClick={settleNow}>Confirm settlement</Button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Members */}
      <h2 className="mb-4 mt-10 font-display text-xl font-bold text-default">Members</h2>
      <div className="overflow-x-auto rounded-2xl border border-default">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-default bg-surface font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              <th scope="col" className="px-4 py-3 font-medium">Member</th>
              <th scope="col" className="px-4 py-3 font-medium">Email</th>
              <th scope="col" className="px-4 py-3 font-medium">Bets</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Balance</th>
            </tr>
          </thead>
          <tbody>
            {members.map((u) => (
              <tr key={u.id} className="border-b border-default/60 last:border-0">
                <td className="px-4 py-3 font-semibold text-default">{u.name}{u.isAdmin && <span className="ml-2 rounded-full border border-brand/40 bg-brand/10 px-2 py-0.5 font-mono text-[10px] uppercase text-brand">admin</span>}</td>
                <td className="px-4 py-3 text-muted">{u.email}</td>
                <td className="tnum px-4 py-3 font-mono text-muted">{state.bets.filter((b) => b.userId === u.id).length}</td>
                <td className="px-4 py-3 font-mono text-[12px] uppercase text-muted">{u.selfExcludedUntil && u.selfExcludedUntil > Date.now() ? 'paused' : 'active'}</td>
                <td className="tnum px-4 py-3 text-right font-mono text-default">{fmtUSD(balanceOf(state, `user:${u.id}:cash`))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Danger zone */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-default bg-surface p-6">
        <div>
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-default"><RotateCcw className="h-4 w-4 text-warning" strokeWidth={2.2} /> Reset demo data</h2>
          <p className="mt-1 text-sm text-muted">Wipes every account, bet, and pool in this browser and reseeds the card fresh.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { if (window.confirm('Reset all demo data in this browser?')) actions.resetDemo() }}>
          Reset demo
        </Button>
      </div>

      <p className="mt-8 flex items-center gap-2 text-[12.5px] text-muted">
        <Landmark className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        Production adds: result feeds, dual-approval settlement, audit log, KYC review queue, and payout operations.
      </p>
    </AppShell>
  )
}
