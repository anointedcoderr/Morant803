import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LayoutGrid, Wallet, Trophy, ShieldCheck, LogOut, Menu, X, Settings2 } from 'lucide-react'
import { Logo, Button } from '../components/primitives.jsx'
import { useEngine, fmtUSD } from '../engine/index.jsx'

const NAV = [
  { to: '/app', label: 'Trade', Icon: LayoutGrid },
  { to: '/wallet', label: 'Wallet', Icon: Wallet },
  { to: '/leaderboard', label: 'Leaderboard', Icon: Trophy },
  { to: '/responsible', label: 'Play in control', Icon: ShieldCheck },
]

// Respect modifier-clicks (open in new tab etc.) on anchor-styled buttons.
const clientNav = (navigate, to) => (e) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
  e.preventDefault()
  navigate(to)
}

export default function AppShell({ children, title }) {
  const engine = useEngine()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const { user, balance, actions } = engine

  const linkCls = ({ isActive }) =>
    `inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3.5 text-sm font-medium transition ${isActive ? 'bg-brand/10 text-brand' : 'text-muted hover:bg-white/5 hover:text-default'}`

  return (
    <div className="min-h-dvh bg-page">
      {/* Play-money banner */}
      <div className="border-b border-white/10 bg-[linear-gradient(90deg,rgb(var(--pw-brand-500)/0.12),rgb(var(--pw-accent-500)/0.08))] px-4 py-1.5 text-center text-[12.5px] text-default">
        Play-money preview by Anointed Coder. No real money moves here.
        <a href="/#credit" className="ml-2 font-semibold text-brand underline decoration-brand/40 underline-offset-2">Request changes</a>
      </div>

      <header className="sticky top-0 z-40 border-b border-default bg-page/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-8">
          <Link to="/" aria-label="Bet It Up home" className="flex-none"><Logo size="sm" /></Link>
          <nav className="ml-2 hidden items-center gap-1 md:flex" aria-label="App">
            {NAV.map(({ to, label, Icon }) => (
              <NavLink key={to} to={to} className={linkCls}>
                <Icon className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" /> {label}
              </NavLink>
            ))}
            {user?.isAdmin && (
              <NavLink to="/admin" className={linkCls}>
                <Settings2 className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" /> Admin
              </NavLink>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2.5">
            {user ? (
              <>
                <Link to="/wallet" className="tnum inline-flex min-h-[44px] items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 font-mono text-sm font-semibold text-brand transition hover:border-brand/60">
                  {fmtUSD(balance)}
                </Link>
                <span className="hidden max-w-[12ch] truncate text-sm text-muted lg:block">{user.name}</span>
                <button
                  onClick={() => { actions.logout(); navigate('/') }}
                  aria-label="Log out"
                  className="hidden h-11 w-11 items-center justify-center rounded-xl border border-default bg-surface text-muted transition hover:text-default md:flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  <LogOut className="h-4 w-4" strokeWidth={2.2} />
                </button>
              </>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link to="/login" className="inline-flex min-h-[44px] items-center rounded-xl px-3.5 text-sm font-medium text-muted transition hover:text-default">Log in</Link>
                <Button as="a" href="/signup" size="sm" onClick={clientNav(navigate, '/signup')}>Create account</Button>
              </div>
            )}
            <button onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-strong bg-surface text-default md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              {open ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <nav className="border-t border-default bg-page px-4 py-3 md:hidden" aria-label="App mobile">
            <div className="flex flex-col gap-1.5">
              {NAV.map(({ to, label, Icon }) => (
                <NavLink key={to} to={to} onClick={() => setOpen(false)} className={linkCls}>
                  <Icon className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" /> {label}
                </NavLink>
              ))}
              {user?.isAdmin && (
                <NavLink to="/admin" onClick={() => setOpen(false)} className={linkCls}>
                  <Settings2 className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" /> Admin
                </NavLink>
              )}
              {user ? (
                <button onClick={() => { setOpen(false); actions.logout(); navigate('/') }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3.5 text-left text-sm font-medium text-muted hover:text-default">
                  <LogOut className="h-4 w-4" strokeWidth={2.2} /> Log out
                </button>
              ) : (
                <div className="mt-1 flex gap-2">
                  <Button as="a" href="/login" variant="ghost" size="sm" className="flex-1" onClick={(e) => { setOpen(false); clientNav(navigate, '/login')(e) }}>Log in</Button>
                  <Button as="a" href="/signup" size="sm" className="flex-1" onClick={(e) => { setOpen(false); clientNav(navigate, '/signup')(e) }}>Create account</Button>
                </div>
              )}
            </div>
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
        {title && <h1 className="mb-6 font-display text-2xl font-bold tracking-tight text-default sm:text-3xl">{title}</h1>}
        {children}
      </main>

      <footer className="border-t border-default py-6">
        <p className="mx-auto max-w-7xl px-4 text-center text-[12.5px] text-muted sm:px-8">
          Bet It Up play-money preview · built by <a className="text-brand underline underline-offset-2" href="https://anointedcoder.com" target="_blank" rel="noopener">Anointed Coder</a> · fighters and figures are illustrative
        </p>
      </footer>
    </div>
  )
}
