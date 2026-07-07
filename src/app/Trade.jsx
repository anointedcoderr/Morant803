import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ModalOverlay, Modal, Dialog, Heading } from 'react-aria-components'
import { X, Check, TrendingUp } from 'lucide-react'
import AppShell from './AppShell.jsx'
import { FighterAvatar, Button, Pill } from '../components/primitives.jsx'
import { useEngine, fmtUSD } from '../engine/index.jsx'

const CHIPS = [1000, 2500, 5000, 10000] // cents

function BetSlip({ slip, onClose }) {
  const engine = useEngine()
  const navigate = useNavigate()
  const [stake, setStake] = useState('25')
  const [side, setSide] = useState(slip.side)
  const [error, setError] = useState('')
  const [placed, setPlaced] = useState(null)

  const market = engine.markets.find((m) => m.id === slip.marketId)
  // Market can vanish if the demo is reset while the slip is open.
  useEffect(() => { if (!market) onClose() }, [market, onClose])
  if (!market) return null
  const stakeCents = Math.round((parseFloat(stake) || 0) * 100)
  const pctA = engine.pctA(market.id)
  const myPct = side === 'a' ? pctA : 100 - pctA
  const est = stakeCents > 0 ? engine.estimate(market.id, side, stakeCents) : 0
  const profit = est - stakeCents
  const fighter = side === 'a' ? market.a : market.b

  const place = () => {
    setError('')
    if (!engine.user) { navigate(`/login?next=/app`); return }
    const res = engine.actions.placeBet({ marketId: market.id, side, amountCents: stakeCents })
    if (!res.ok) { setError(res.error); return }
    setPlaced({ fighter: fighter.name, stakeCents, est })
  }

  return (
    <ModalOverlay isOpen onOpenChange={(o) => { if (!o) onClose() }} isDismissable
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center">
      <Modal className="w-full max-w-md outline-none">
        <Dialog className="relative rounded-t-3xl border border-strong bg-surface-raised p-6 shadow-600 outline-none sm:rounded-3xl sm:p-8" aria-label="Bet slip">
          {({ close }) => (
            <>
              <button onClick={close} aria-label="Close bet slip"
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg border border-default bg-surface text-muted transition hover:text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <X className="h-5 w-5" strokeWidth={2} />
              </button>

              {placed ? (
                <div className="py-6 text-center">
                  <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/40 bg-accent/10 text-accent"><Check className="h-7 w-7" strokeWidth={2.5} /></span>
                  <Heading slot="title" className="font-display text-xl font-bold text-default">Position locked</Heading>
                  <p className="mt-2 text-sm text-muted">{fmtUSD(placed.stakeCents)} play-money on <b className="text-default">{placed.fighter}</b>. Estimated return {fmtUSD(placed.est)} if it lands. No real money moves in this preview.</p>
                  <div className="mt-6 flex justify-center gap-2.5">
                    <Button variant="ghost" size="sm" onClick={close}>Back to the card</Button>
                    <Button size="sm" onClick={() => { setPlaced(null); setError('') }}>Bet again</Button>
                  </div>
                </div>
              ) : (
                <>
                  <Heading slot="title" className="font-display text-lg font-bold text-default">
                    {market.a.name} vs {market.b.name}
                  </Heading>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">{market.tier} · crowd has {market.a.name} at {pctA}%</p>

                  <div className="mt-5 grid grid-cols-2 gap-2.5" role="group" aria-label="Pick a side">
                    {['a', 'b'].map((sd) => {
                      const f = sd === 'a' ? market.a : market.b
                      const active = side === sd
                      return (
                        <button key={sd} onClick={() => setSide(sd)} aria-pressed={active}
                          className={`flex min-h-[56px] items-center justify-center gap-2.5 rounded-xl border px-3 font-display text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${active ? 'border-brand bg-brand/10 text-brand' : 'border-strong bg-surface text-default hover:border-brand/40'}`}>
                          <FighterAvatar corner={sd === 'a' ? 'red' : 'blue'} initials={f.initials} size="sm" />
                          {f.name}
                        </button>
                      )
                    })}
                  </div>

                  <label className="mt-5 block">
                    <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.1em] text-muted">Stake (USD)</span>
                    <input
                      type="number" inputMode="decimal" min="5" step="1" value={stake}
                      onChange={(e) => setStake(e.target.value)}
                      className="w-full rounded-xl border border-default bg-deep px-4 py-3.5 text-lg font-semibold text-default transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-[color:rgb(var(--pw-brand-500)/0.15)]"
                    />
                  </label>
                  <div className="mt-2.5 flex gap-2">
                    {CHIPS.map((c) => (
                      <button key={c} onClick={() => setStake(String(c / 100))}
                        className="min-h-[44px] flex-1 rounded-lg border border-default bg-surface py-2.5 font-mono text-[12.5px] text-muted transition hover:border-brand/50 hover:text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                        ${c / 100}
                      </button>
                    ))}
                  </div>

                  <dl className="mt-5 space-y-2 rounded-xl border border-default bg-deep p-4 font-mono text-[13px]">
                    <div className="flex justify-between"><dt className="text-muted">Crowd on {fighter.name}</dt><dd className="tnum text-default">{myPct}%</dd></div>
                    <div className="flex justify-between"><dt className="text-muted">Estimated return</dt><dd className="tnum text-brand">{fmtUSD(est)}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted">Estimated profit</dt><dd className={`tnum ${profit >= 0 ? 'text-accent' : 'text-danger'}`}>{fmtUSD(profit, { sign: true })}</dd></div>
                  </dl>
                  <p className="mt-2 text-[11.5px] leading-snug text-muted">Play-money pari-mutuel market: returns are estimates and move with the pool until it closes. 5% rake funds the platform. No real money moves in this preview.</p>

                  {error && <p role="alert" className="mt-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}

                  <Button className="mt-5 w-full" size="lg" onClick={place}>
                    {engine.user ? `Place ${fmtUSD(stakeCents)} on ${fighter.name}` : 'Sign in to place this bet'}
                  </Button>
                </>
              )}
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}

function MarketCard({ market, onBack }) {
  const engine = useEngine()
  const pctA = engine.pctA(market.id)
  const pctB = 100 - pctA
  const pool = engine.pool(market.id)
  const settled = market.status === 'settled'
  const suspended = market.status === 'suspended'

  return (
    <article className="rise-in relative overflow-hidden rounded-2xl border border-default bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-strong hover:shadow-300">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-subtle">{market.tag}</span>
        {settled ? <Pill className="border-accent/40 text-accent">Settled</Pill>
          : suspended ? <Pill className="border-warning/40 text-warning">Suspended</Pill>
          : <span className="rounded-full border border-warning/35 bg-warning/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-warning">{market.tier}</span>}
      </div>

      <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2.5">
        <div className="flex items-center gap-2.5">
          <FighterAvatar corner="red" initials={market.a.initials} size="sm" />
          <div className="font-display text-base font-semibold leading-tight text-default">{market.a.name}{settled && market.winner === 'a' && <span className="ml-1.5 font-mono text-[10px] uppercase text-accent">win</span>}</div>
        </div>
        <span className="font-mono text-[11px] text-subtle">VS</span>
        <div className="flex flex-row-reverse items-center gap-2.5 text-right">
          <FighterAvatar corner="blue" initials={market.b.initials} size="sm" />
          <div className="font-display text-base font-semibold leading-tight text-default">{market.b.name}{settled && market.winner === 'b' && <span className="ml-1.5 font-mono text-[10px] uppercase text-accent">win</span>}</div>
        </div>
      </div>

      <div className="mb-2 flex justify-between font-mono text-[13px]"><span className="text-[#ff9aa2]">{pctA}%</span><span className="text-[#a9c7ff]">{pctB}%</span></div>
      <div className="flex h-2 overflow-hidden rounded-full bg-deep">
        <div className="transition-[width] duration-500 bg-[linear-gradient(90deg,#e23b4a,#ff7480)]" style={{ width: `${pctA}%` }} />
        <div className="ml-auto transition-[width] duration-500 bg-[linear-gradient(90deg,#3d78e0,#8fbcff)]" style={{ width: `${pctB}%` }} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-default pt-4">
        <span className="tnum font-mono text-[12px] text-subtle">Pool <b className="text-muted">{fmtUSD(pool.total)}</b></span>
        {market.status === 'open' ? (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onBack(market.id, 'a')}>Back {market.a.name}</Button>
            <Button size="sm" variant="ghost" onClick={() => onBack(market.id, 'b')}>Back {market.b.name}</Button>
          </div>
        ) : (
          <span className="font-mono text-[12px] text-muted">{settled ? `${market.winner === 'a' ? market.a.name : market.b.name} took it` : 'Betting paused'}</span>
        )}
      </div>
    </article>
  )
}

const STATUS_TONE = { open: 'text-warning', won: 'text-accent', lost: 'text-danger', refunded: 'text-muted' }

export default function Trade() {
  const engine = useEngine()
  const [slip, setSlip] = useState(null)
  const { settings, markets, myBets, user } = engine

  const totals = useMemo(() => {
    const staked = myBets.reduce((s, b) => s + b.amountCents, 0)
    const returned = myBets.reduce((s, b) => s + (b.payoutCents || 0), 0)
    return { staked, returned }
  }, [myBets])

  return (
    <AppShell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">{settings.event.title} · {settings.event.dateLabel} · {settings.event.venue}</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-default sm:text-4xl">Who ya got?</h1>
        </div>
        <Pill dot>Live markets</Pill>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {markets.map((m) => <MarketCard key={m.id} market={m} onBack={(marketId, side) => setSlip({ marketId, side })} />)}
      </div>

      <section className="mt-12" aria-label="My positions">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-default">My positions</h2>
          {user && myBets.length > 0 && (
            <span className="tnum font-mono text-[12.5px] text-muted">Staked {fmtUSD(totals.staked)} · Returned {fmtUSD(totals.returned)}</span>
          )}
        </div>
        {!user ? (
          <div className="rounded-2xl border border-default bg-surface p-8 text-center">
            <TrendingUp className="mx-auto mb-3 h-8 w-8 text-brand" strokeWidth={1.8} aria-hidden="true" />
            <p className="text-sm text-muted">Create an account to start calling fights. Every new member gets a $1,000 play-money bankroll.</p>
          </div>
        ) : myBets.length === 0 ? (
          <div className="rounded-2xl border border-default bg-surface p-8 text-center text-sm text-muted">No positions yet. Back a fighter above to get on the board.</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-default">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-default bg-surface font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                  <th scope="col" className="px-4 py-3 font-medium">Fight</th>
                  <th scope="col" className="px-4 py-3 font-medium">Pick</th>
                  <th scope="col" className="px-4 py-3 font-medium">Stake</th>
                  <th scope="col" className="px-4 py-3 font-medium">Crowd at bet</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Return</th>
                </tr>
              </thead>
              <tbody>
                {myBets.map((b) => {
                  const m = markets.find((x) => x.id === b.marketId)
                  if (!m) return null
                  const pick = b.side === 'a' ? m.a.name : m.b.name
                  return (
                    <tr key={b.id} className="border-b border-default/60 last:border-0">
                      <td className="px-4 py-3 text-default">{m.a.name} vs {m.b.name}</td>
                      <td className="px-4 py-3 font-semibold text-default">{pick}</td>
                      <td className="tnum px-4 py-3 font-mono">{fmtUSD(b.amountCents)}</td>
                      <td className="tnum px-4 py-3 font-mono text-muted">{b.atPct}%</td>
                      <td className={`px-4 py-3 font-mono text-[12.5px] uppercase ${STATUS_TONE[b.status]}`}>{b.status}</td>
                      <td className="tnum px-4 py-3 text-right font-mono">{b.status === 'open' ? 'open' : fmtUSD(b.payoutCents)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {slip && <BetSlip slip={slip} onClose={() => setSlip(null)} />}
    </AppShell>
  )
}
