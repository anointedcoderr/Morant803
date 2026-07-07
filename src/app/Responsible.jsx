import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, TimerOff, PiggyBank } from 'lucide-react'
import AppShell from './AppShell.jsx'
import { Button } from '../components/primitives.jsx'
import { useEngine, fmtUSD } from '../engine/index.jsx'

const EXCLUSIONS = [
  { label: '24 hours', ms: 24 * 36e5 },
  { label: '7 days', ms: 7 * 24 * 36e5 },
  { label: '30 days', ms: 30 * 24 * 36e5 },
]

export default function Responsible() {
  const engine = useEngine()
  const { user, settings, actions } = engine
  const [cap, setCap] = useState('')
  const [msg, setMsg] = useState(null)

  const excluded = user?.selfExcludedUntil && user.selfExcludedUntil > Date.now()

  const saveCap = () => {
    const cents = Math.round((parseFloat(cap) || 0) * 100)
    const res = actions.setDepositCap(cents > 0 ? cents : null)
    setMsg(res.ok ? { tone: 'ok', text: cents > 0 ? `Daily deposit cap set to ${fmtUSD(cents)}.` : 'Cap reset to the platform default.' } : { tone: 'err', text: res.error })
  }

  const exclude = (ms, label) => {
    if (!window.confirm(`Pause your account for ${label}? You will not be able to bet or deposit until it lifts.`)) return
    const res = actions.selfExclude(ms)
    setMsg(res.ok ? { tone: 'ok', text: `Account paused for ${label}.` } : { tone: 'err', text: res.error })
  }

  return (
    <AppShell title="Play in control">
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted">
        Bet It Up is built so staying in control is always one tap away. Set your own deposit cap, take a break, or pause your account entirely. These controls ship in the real platform exactly as you see them here.
      </p>

      {!user ? (
        <div className="rounded-2xl border border-default bg-surface p-8 text-center">
          <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-brand" strokeWidth={1.8} aria-hidden="true" />
          <p className="text-sm text-muted"><Link to="/login?next=/responsible" className="font-semibold text-brand">Sign in</Link> to manage your personal limits.</p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-default bg-surface p-6">
            <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-default">
              <PiggyBank className="h-5 w-5 text-brand" strokeWidth={2.2} /> Daily deposit cap
            </h2>
            <p className="mt-2 text-sm text-muted">
              Platform default is {fmtUSD(settings.dailyDepositCapCents)} per day. Yours is currently{' '}
              <b className="text-default">{fmtUSD(user.dailyDepositCapCents ?? settings.dailyDepositCapCents)}</b>.
            </p>
            <label className="mt-4 block">
              <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.1em] text-muted">New daily cap (USD, blank for default)</span>
              <input type="number" inputMode="decimal" min="1" value={cap} onChange={(e) => setCap(e.target.value)}
                className="w-full rounded-xl border border-default bg-deep px-4 py-3 text-[15px] text-default transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-[color:rgb(var(--pw-brand-500)/0.15)]" />
            </label>
            <Button className="mt-4" size="sm" onClick={saveCap}>Save cap</Button>
          </div>

          <div className="rounded-2xl border border-default bg-surface p-6">
            <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-default">
              <TimerOff className="h-5 w-5 text-warning" strokeWidth={2.2} /> Take a break
            </h2>
            {excluded ? (
              <>
                <p className="mt-2 text-sm text-muted">Your account is paused until <b className="text-default">{new Date(user.selfExcludedUntil).toLocaleString('en-US')}</b>. Betting and deposits are blocked.</p>
                <Button className="mt-4" size="sm" variant="ghost" onClick={() => { const r = actions.selfExclude(null); setMsg(r.ok ? { tone: 'ok', text: 'Pause lifted.' } : { tone: 'err', text: r.error }) }}>
                  Lift pause early (demo only)
                </Button>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-muted">Pause betting and deposits on your account. In production this cannot be lifted early.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {EXCLUSIONS.map((e) => (
                    <Button key={e.label} size="sm" variant="ghost" onClick={() => exclude(e.ms, e.label)}>{e.label}</Button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {msg && (
        <p role={msg.tone === 'ok' ? 'status' : 'alert'} className={`mt-5 max-w-xl rounded-lg border px-3 py-2 text-sm ${msg.tone === 'ok' ? 'border-accent/40 bg-accent/10 text-accent' : 'border-danger/40 bg-danger/10 text-danger'}`}>
          {msg.text}
        </p>
      )}

      <div className="mt-10 rounded-2xl border border-default bg-surface p-6 text-sm leading-relaxed text-muted">
        <h2 className="mb-2 font-display text-base font-bold text-default">If it stops being fun</h2>
        <p>Help is free and confidential. In the US, call or text the National Problem Gambling Helpline at 1-800-GAMBLER, any hour, any day.</p>
      </div>
    </AppShell>
  )
}
