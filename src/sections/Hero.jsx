import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { CreditCard, Landmark, Play } from 'lucide-react'
import { Button, FighterAvatar, Eyebrow } from '../components/primitives.jsx'
import { withMotion, prefersReducedMotion } from '../lib/motion.js'
import { SITE, FIGHTS, IMAGES } from '../lib/content.js'

const F = FIGHTS[0]

function AppleGlyph({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.05 12.5c0-1.9 1.55-2.8 1.62-2.85-.88-1.3-2.26-1.47-2.75-1.49-1.17-.12-2.28.69-2.87.69-.59 0-1.5-.67-2.47-.65-1.27.02-2.44.74-3.09 1.87-1.32 2.29-.34 5.68.95 7.54.63.91 1.38 1.93 2.37 1.9.95-.04 1.31-.61 2.46-.61s1.47.61 2.47.59c1.02-.02 1.67-.93 2.29-1.85.72-1.06 1.02-2.09 1.04-2.14-.02-.01-2-.77-2-3.05zM15.2 6.2c.52-.64.88-1.52.78-2.4-.75.03-1.67.5-2.21 1.13-.48.56-.9 1.46-.79 2.32.84.07 1.69-.42 2.22-1.05z" />
    </svg>
  )
}

function useCountdown(iso) {
  const [t, setT] = useState({ d: '--', h: '--', m: '--', s: '--' })
  useEffect(() => {
    const target = new Date(iso).getTime()
    const p = (n) => (n < 10 ? '0' + n : '' + n)
    const tick = () => {
      let d = target - Date.now()
      if (d < 0) d = 0
      setT({
        d: p(Math.floor(d / 864e5)), h: p(Math.floor((d % 864e5) / 36e5)),
        m: p(Math.floor((d % 36e5) / 6e4)), s: p(Math.floor((d % 6e4) / 1e3)),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [iso])
  return t
}

function Countdown() {
  const t = useCountdown(SITE.event.countdownISO)
  const cells = [['Days', t.d], ['Hrs', t.h], ['Min', t.m], ['Sec', t.s]]
  return (
    <div className="mt-4 flex gap-2" aria-label="Time to the main card">
      {cells.map(([label, v]) => (
        <div key={label} className="min-w-[3.4rem] flex-1 rounded-xl border border-default bg-deep py-2 text-center">
          <div className="tnum font-mono text-xl font-bold leading-none text-brand">{v}</div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{label}</div>
        </div>
      ))}
    </div>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const navigate = useNavigate()
  const [probA, setProbA] = useState(F.probA)
  const [pool, setPool] = useState(96400)

  useEffect(() => {
    return withMotion(() => {
      gsap.from('.hero-line-1', { y: 40, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' })
      gsap.from('.hero-line-2', { y: 60, opacity: 0, duration: 1.2, delay: 0.4, ease: 'power3.out' })
      gsap.from('.hero-rise', { y: 24, opacity: 0, duration: 0.8, delay: 0.7, stagger: 0.12, ease: 'power3.out' })
      gsap.from('.hero-card', { y: 40, opacity: 0, duration: 1, delay: 0.5, ease: 'power3.out' })
    }, ['.hero-line-1', '.hero-line-2', '.hero-rise', '.hero-card'], ref.current)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = setInterval(() => {
      setProbA((p) => Math.max(50, Math.min(59, p + Math.round((Math.random() - 0.5) * 3))))
      setPool((v) => v + Math.round(Math.random() * 900))
    }, 3200)
    return () => clearInterval(id)
  }, [])

  const probB = 100 - probA

  return (
    <section ref={ref} id="top" className="relative flex min-h-[100dvh] items-start overflow-hidden pt-28 pb-16 sm:pt-32 lg:items-center">
      {/* Background */}
      <img src={IMAGES.hero} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center opacity-40" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--pw-bg-deep)/0.82),rgb(var(--pw-bg-deep)/0.55)_45%,rgb(var(--pw-bg-deep)/0.92))]" />
      <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_82%_-8%,rgb(var(--pw-brand-500)/0.16),transparent_60%),radial-gradient(760px_520px_at_6%_18%,rgb(var(--pw-accent-500)/0.12),transparent_60%)]" />
      {/* Floating market motes */}
      <div className="pointer-events-none absolute right-[8%] top-[18%] hidden lg:block" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="absolute block h-2 w-2 rounded-full bg-brand/70 animate-float" style={{ top: `${i * 34}px`, left: `${(i % 2) * 60}px`, animationDelay: `${i * 0.7}s` }} />
        ))}
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-16">
        {/* Left */}
        <div>
          <img src="/betitup-logo.png" alt="Bet It Up" className="hero-rise h-16 w-auto sm:h-20" style={{ filter: 'drop-shadow(0 6px 22px rgba(198,255,61,0.3))' }} />
          <div className="hero-rise mt-6"><Eyebrow>{SITE.heroEyebrow} · Aug 1 on NowThatsTV</Eyebrow></div>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-tighter text-white sm:text-7xl lg:text-8xl">
            <span className="hero-line-1 block">{SITE.taglineLine1}</span>
            <span className="hero-line-2 block font-serif italic font-medium text-brand">{SITE.taglineLine2}</span>
          </h1>
          <p className="hero-rise mt-6 max-w-xl text-base leading-relaxed text-on-deep/75 sm:text-lg">
            <span className="font-semibold text-brand">{SITE.kicker}</span> {SITE.heroSub}
          </p>

          <div className="hero-rise mt-8 flex flex-wrap gap-3">
            <Button icon onClick={() => navigate('/signup')}>Create your account</Button>
            <Button as="a" href="#markets" variant="secondary">
              <Play className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" /> See the fight card
            </Button>
          </div>

          <div className="hero-rise mt-8 flex flex-wrap items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-on-deep/60">Fund with</span>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[.12] bg-white/[0.04] px-3 text-[13px] font-semibold text-on-deep/80"><AppleGlyph className="h-4 w-4" /> Apple Pay</span>
              <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[.12] bg-white/[0.04] px-3 text-[13px] font-semibold text-on-deep/80"><Landmark className="h-4 w-4" strokeWidth={2} /> Zelle</span>
              <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[.12] bg-white/[0.04] px-3 text-[13px] font-semibold text-on-deep/80"><CreditCard className="h-4 w-4" strokeWidth={2} /> Cards</span>
            </div>
          </div>
        </div>

        {/* Right — live market card */}
        <div className="hero-card">
          <div className="overflow-hidden rounded-3xl border border-strong bg-surface-raised shadow-600">
            <div className="flex items-center justify-between border-b border-default px-5 py-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-warning">Main event · Aug 1</span>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.05em] text-accent">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-accent" /></span>
                Live market
              </span>
            </div>
            <div className="p-5">
              <p className="mb-4 font-display text-[15px] font-semibold text-muted">Main event. Who ya got?</p>
              <div className="mb-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="flex flex-col items-center gap-2 text-center">
                  <FighterAvatar corner="red" initials={F.a.initials} />
                  <div className="font-display text-base font-semibold text-default">{F.a.name}</div>
                </div>
                <span className="font-display text-xs font-bold text-subtle">VS</span>
                <div className="flex flex-col items-center gap-2 text-center">
                  <FighterAvatar corner="blue" initials={F.b.initials} />
                  <div className="font-display text-base font-semibold text-default">{F.b.name}</div>
                </div>
              </div>

              <div className="relative flex h-11 overflow-hidden rounded-xl border border-strong" role="img" aria-label={`Market: ${F.a.name} ${probA} percent, ${F.b.name} ${probB} percent`}>
                <div className="flex items-center px-3 font-mono text-[15px] font-bold text-[#ffd9dd] transition-[width] duration-500 bg-[linear-gradient(90deg,rgba(226,59,74,0.34),rgba(226,59,74,0.16))]" style={{ width: `${probA}%` }}>{probA}%</div>
                <div className="ml-auto flex items-center justify-end px-3 font-mono text-[15px] font-bold text-[#d8e6ff] transition-[width] duration-500 bg-[linear-gradient(90deg,rgba(61,120,224,0.16),rgba(61,120,224,0.34))]" style={{ width: `${probB}%` }}>{probB}%</div>
                <span className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-deep" />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-default pt-4">
                {[['Pool', `$${pool.toLocaleString('en-US')}`], ['24h volume', `$${F.vol}`], ['Traders', '1,974']].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-0.5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-muted">{k}</span>
                    <span className="tnum font-mono text-[15px] text-default">{v}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <Button size="sm" className="w-full" onClick={() => navigate('/app')}>Back {F.a.name}</Button>
                <Button size="sm" variant="ghost" className="w-full" onClick={() => navigate('/app')}>Back {F.b.name}</Button>
              </div>

              <Countdown />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
