import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Logo, Button } from '../components/primitives.jsx'
import { NAV } from '../lib/content.js'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <>
      <header className={`fixed left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 transition-[top] duration-300 ${scrolled ? 'top-4' : 'top-4 sm:top-[3rem]'}`}>
        <div className={`flex items-center gap-4 rounded-full px-4 py-2.5 transition-all duration-300 sm:px-6 ${scrolled ? 'glass shadow-300' : 'border border-transparent'}`}>
          <a href="#top" aria-label="Bet It Up home"><Logo /></a>

          <nav className="ml-3 hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV.map((l) => (
              <a key={l.href} href={l.href} className="lift-on-hover rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-default hover:bg-white/5">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <button onClick={() => navigate('/login')} className="lift-on-hover rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              Log in
            </button>
            <Button size="sm" icon onClick={() => navigate('/app')}>Enter the app</Button>
          </div>

          <button onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="ml-auto flex h-11 w-11 items-center justify-center rounded-xl border border-strong bg-surface text-default lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <Menu className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div className={`fixed inset-0 z-[70] lg:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute right-0 top-0 flex h-full w-[min(84vw,340px)] flex-col gap-1.5 border-l border-default bg-page p-5 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="mb-4 flex items-center justify-between">
            <Logo />
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="flex h-10 w-10 items-center justify-center rounded-xl border border-strong bg-surface text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
          {NAV.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-xl border border-transparent px-3 py-3.5 text-base font-medium text-default transition hover:border-default hover:bg-surface">
              {l.label}
            </a>
          ))}
          <div className="mt-auto flex flex-col gap-2.5">
            <Button variant="ghost" className="w-full" onClick={() => { setOpen(false); navigate('/login') }}>Log in</Button>
            <Button className="w-full" onClick={() => { setOpen(false); navigate('/app') }}>Enter the app</Button>
          </div>
        </div>
      </div>
    </>
  )
}
