import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Logo, Button } from '../components/primitives.jsx'
import { useEngine } from '../engine/index.jsx'

function Shell({ title, sub, children, alt }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-page px-4 py-10">
      <Link to="/" aria-label="Bet It Up home"><Logo /></Link>
      <div className="rise-in mt-8 w-full max-w-md rounded-3xl border border-strong bg-surface-raised p-7 shadow-500 sm:p-9">
        <h1 className="font-display text-2xl font-bold tracking-tight text-default">{title}</h1>
        <p className="mt-1.5 text-sm text-muted">{sub}</p>
        {children}
      </div>
      <p className="mt-5 text-sm text-muted">{alt}</p>
      <p className="mt-6 max-w-sm text-center text-[11.5px] leading-snug text-muted">Play-money preview built by Anointed Coder. Accounts live in this browser only; nothing here accepts real money.</p>
    </div>
  )
}

function Field({ label, ...rest }) {
  return (
    <label className="mt-4 block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.1em] text-muted">{label}</span>
      <input {...rest}
        className="w-full rounded-xl border border-default bg-deep px-4 py-3 text-[15px] text-default transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-[color:rgb(var(--pw-brand-500)/0.15)]" />
    </label>
  )
}

// Only allow internal paths as post-auth destinations.
const safeNext = (raw) => (raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/app')

export function Login() {
  const engine = useEngine()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setBusy(true)
    const res = await engine.actions.login(form)
    setBusy(false)
    if (!res.ok) { setError(res.error); return }
    navigate(next, { replace: true })
  }

  return (
    <Shell title="Welcome back" sub="Sign in to your Bet It Up account."
      alt={<>New here? <Link className="font-semibold text-brand" to={`/signup?next=${encodeURIComponent(next)}`}>Create an account</Link></>}>
      <form onSubmit={submit} noValidate>
        <Field label="Email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Field label="Password" type="password" autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p role="alert" className="mt-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
        <Button type="submit" className="mt-5 w-full" size="lg" disabled={busy} aria-busy={busy}>
          {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : 'Sign in'}
        </Button>
      </form>
      <div className="mt-5 rounded-xl border border-default bg-deep p-3.5 font-mono text-[12px] leading-relaxed text-muted">
        <p className="mb-1 uppercase tracking-[0.1em] text-brand">Demo access</p>
        <p>Member: demo@betitup.demo · demo1234</p>
        <p>Admin: admin@betitup.demo · betitup803</p>
      </div>
    </Shell>
  )
}

export function Signup() {
  const engine = useEngine()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const [form, setForm] = useState({ name: '', email: '', password: '', ageConfirmed: false })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setBusy(true)
    const res = await engine.actions.signup(form)
    setBusy(false)
    if (!res.ok) { setError(res.error); return }
    navigate(next, { replace: true })
  }

  return (
    <Shell title="Create your account" sub="Sign up and get a $1,000 play-money bankroll for the Aug 1 card."
      alt={<>Already a member? <Link className="font-semibold text-brand" to={`/login?next=${encodeURIComponent(next)}`}>Sign in</Link></>}>
      <form onSubmit={submit} noValidate>
        <Field label="Name" type="text" autoComplete="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Field label="Email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Field label="Password (8+ characters)" type="password" autoComplete="new-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-muted">
          <input type="checkbox" checked={form.ageConfirmed} onChange={(e) => setForm({ ...form, ageConfirmed: e.target.checked })}
            className="mt-0.5 h-5 w-5 flex-none accent-[#C6FF3D]" />
          I confirm I am 18 or older and accept the <Link to="/terms" className="text-brand underline underline-offset-2">terms</Link> and <Link to="/privacy" className="text-brand underline underline-offset-2">privacy policy</Link>.
        </label>
        {error && <p role="alert" className="mt-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
        <Button type="submit" className="mt-5 w-full" size="lg" disabled={busy} aria-busy={busy}>
          {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</> : 'Create account'}
        </Button>
      </form>
    </Shell>
  )
}
