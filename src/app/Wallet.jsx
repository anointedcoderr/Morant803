import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ArrowDownToLine, ArrowUpFromLine, CreditCard, Landmark } from 'lucide-react'
import AppShell from './AppShell.jsx'
import { Button } from '../components/primitives.jsx'
import { useEngine, fmtUSD } from '../engine/index.jsx'

const METHODS = [
  { id: 'Apple Pay', Icon: CreditCard },
  { id: 'Card', Icon: CreditCard },
  { id: 'Zelle', Icon: Landmark },
]
const AMOUNTS = [2500, 5000, 10000, 25000] // cents

function MoneyForm({ kind, onSubmit }) {
  const [method, setMethod] = useState('Apple Pay')
  const [amount, setAmount] = useState('50')
  const [msg, setMsg] = useState(null)

  const submit = () => {
    setMsg(null)
    const cents = Math.round((parseFloat(amount) || 0) * 100)
    const res = onSubmit({ amountCents: cents, method })
    setMsg(res.ok
      ? { tone: 'ok', text: kind === 'deposit' ? `${fmtUSD(cents)} added via ${method}.` : `${fmtUSD(cents)} sent back via ${method}.` }
      : { tone: 'err', text: res.error })
  }

  return (
    <div className="rounded-2xl border border-default bg-surface p-6">
      <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-default">
        {kind === 'deposit' ? <ArrowDownToLine className="h-5 w-5 text-brand" strokeWidth={2.2} /> : <ArrowUpFromLine className="h-5 w-5 text-accent" strokeWidth={2.2} />}
        {kind === 'deposit' ? 'Add funds' : 'Withdraw'}
      </h2>
      <div className="mt-4 flex gap-2" role="group" aria-label="Payment method">
        {METHODS.map(({ id }) => (
          <button key={id} onClick={() => setMethod(id)} aria-pressed={method === id}
            className={`min-h-[44px] flex-1 rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${method === id ? 'border-brand bg-brand/10 text-brand' : 'border-default bg-deep text-muted hover:text-default'}`}>
            {id}
          </button>
        ))}
      </div>
      <label className="mt-4 block">
        <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.1em] text-muted">Amount (USD)</span>
        <input type="number" inputMode="decimal" min="1" step="1" value={amount} onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-xl border border-default bg-deep px-4 py-3.5 text-lg font-semibold text-default transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-[color:rgb(var(--pw-brand-500)/0.15)]" />
      </label>
      <div className="mt-2.5 flex gap-2">
        {AMOUNTS.map((c) => (
          <button key={c} onClick={() => setAmount(String(c / 100))}
            className="min-h-[44px] flex-1 rounded-lg border border-default bg-deep py-2.5 font-mono text-[12.5px] text-muted transition hover:border-brand/50 hover:text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            ${c / 100}
          </button>
        ))}
      </div>
      {msg && (
        <p role={msg.tone === 'ok' ? 'status' : 'alert'} className={`mt-3 rounded-lg border px-3 py-2 text-sm ${msg.tone === 'ok' ? 'border-accent/40 bg-accent/10 text-accent' : 'border-danger/40 bg-danger/10 text-danger'}`}>
          {msg.text}
        </p>
      )}
      <Button className="mt-4 w-full" variant={kind === 'deposit' ? 'primary' : 'ghost'} onClick={submit}>
        {kind === 'deposit' ? 'Add play-money' : 'Withdraw play-money'}
      </Button>
      <p className="mt-2.5 text-[11.5px] leading-snug text-muted">
        {kind === 'deposit'
          ? 'Play-money preview: deposits are instant and free. Real Apple Pay, card and Zelle rails plug in here once licensing clears.'
          : 'Play-money preview: withdrawals settle instantly to your selected method.'}
      </p>
    </div>
  )
}

export default function Wallet() {
  const engine = useEngine()
  if (!engine.user) return <Navigate to="/login?next=/wallet" replace />
  const { balance, history, actions } = engine

  return (
    <AppShell title="Wallet">
      <div className="mb-8 rounded-3xl border border-brand/25 bg-[linear-gradient(135deg,rgb(var(--pw-brand-500)/0.12),rgb(var(--pw-accent-500)/0.06))] p-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">Available balance</p>
        <p className="tnum mt-2 font-display text-5xl font-bold tracking-tight text-default">{fmtUSD(balance)}</p>
        <p className="mt-2 text-[13px] text-muted">Play-money bankroll. Every dollar here is tracked on a double-entry ledger, exactly like the production build.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <MoneyForm kind="deposit" onSubmit={actions.deposit} />
        <MoneyForm kind="withdraw" onSubmit={actions.withdraw} />
      </div>

      <section className="mt-10" aria-label="Transaction history">
        <h2 className="mb-4 font-display text-xl font-bold text-default">History</h2>
        {history.length === 0 ? (
          <div className="rounded-2xl border border-default bg-surface p-8 text-center text-sm text-muted">No transactions yet.</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-default">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-default bg-surface font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                  <th scope="col" className="px-4 py-3 font-medium">When</th>
                  <th scope="col" className="px-4 py-3 font-medium">Detail</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 40).map((row, i) => (
                  <tr key={`${row.id}-${i}`} className="border-b border-default/60 last:border-0">
                    <td className="tnum whitespace-nowrap px-4 py-3 font-mono text-[12.5px] text-muted">{new Date(row.ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</td>
                    <td className="px-4 py-3 text-default">{row.memo}</td>
                    <td className={`tnum px-4 py-3 text-right font-mono ${row.delta >= 0 ? 'text-accent' : 'text-default'}`}>{fmtUSD(row.delta, { sign: true })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  )
}
