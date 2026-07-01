import { useEffect, useState } from 'react'
import { Check, MousePointer2 } from 'lucide-react'
import { Container, SectionHeader } from '../components/primitives.jsx'
import { prefersReducedMotion } from '../lib/motion.js'
import { FEATURES, FIGHTS } from '../lib/content.js'

/* ---------- 3a. Odds shuffler ---------- */
function OddsShuffler() {
  const cards = [FIGHTS[3], FIGHTS[1], FIGHTS[4]]
  const [cur, setCur] = useState(0)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = setInterval(() => setCur((c) => (c + 1) % cards.length), 3000)
    return () => clearInterval(id)
  }, [])
  const styleFor = (i) => {
    const pos = (i - cur + cards.length) % cards.length
    if (pos === 0) return { transform: 'translateY(0) scale(1)', opacity: 1, filter: 'none', zIndex: 30 }
    if (pos === 1) return { transform: 'translateY(14px) scale(0.95)', opacity: 0.55, filter: 'blur(1px)', zIndex: 20 }
    return { transform: 'translateY(28px) scale(0.9)', opacity: 0.3, filter: 'blur(2px)', zIndex: 10 }
  }
  return (
    <div className="relative h-44">
      {cards.map((f, i) => (
        <div key={i} className="absolute inset-x-0 top-2 mx-auto w-[92%] rounded-2xl border border-strong bg-deep p-4 transition-all duration-700 ease-out" style={styleFor(i)}>
          <div className="mb-3 flex items-center justify-between font-mono text-[11px] text-subtle"><span>{f.tag}</span><span className="text-accent">live</span></div>
          <div className="mb-2 flex justify-between font-display text-sm font-semibold text-on-deep"><span>{f.a.name}</span><span>{f.b.name}</span></div>
          <div className="flex h-2 overflow-hidden rounded-full bg-black/40">
            <div className="bg-[linear-gradient(90deg,#e23b4a,#ff7480)]" style={{ width: `${f.probA}%` }} />
            <div className="ml-auto bg-[linear-gradient(90deg,#3d78e0,#8fbcff)]" style={{ width: `${100 - f.probA}%` }} />
          </div>
          <div className="mt-2 flex justify-between font-mono text-[11px]"><span className="text-[#ff9aa2]">{f.probA}%</span><span className="text-[#a9c7ff]">{100 - f.probA}%</span></div>
        </div>
      ))}
    </div>
  )
}

/* ---------- 3b. Signature — Market Pulse (reskin of falling particles) ---------- */
const PARTICLES = [
  { left: 14, delay: 0, dur: 2.1, size: 10 }, { left: 28, delay: 0.6, dur: 2.5, size: 8 },
  { left: 42, delay: 1.1, dur: 2.2, size: 12 }, { left: 56, delay: 0.3, dur: 2.7, size: 9 },
  { left: 68, delay: 1.5, dur: 2.3, size: 11 }, { left: 80, delay: 0.9, dur: 2.6, size: 8 },
  { left: 50, delay: 1.9, dur: 2.4, size: 10 },
]
const STATUS = ['Market open', 'Money flowing in', 'Odds moving', 'Settled']

function MarketPulse() {
  const [status, setStatus] = useState(0)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = setInterval(() => setStatus((s) => (s + 1) % STATUS.length), 2300)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="relative h-44 overflow-hidden rounded-2xl border border-strong bg-[linear-gradient(180deg,#0d1712,#0a0b0d)]">
      <style>{`
        @keyframes mp-fall { 0%{transform:translate(-50%,-10px);opacity:0} 12%{opacity:1} 82%{opacity:1} 100%{transform:translate(-50%,120px);opacity:0} }
        @keyframes mp-ripple { 0%{transform:translateX(-50%) scale(0.4);opacity:0.85} 80%{transform:translateX(-50%) scale(3.4);opacity:0} 100%{opacity:0} }
        @keyframes mp-fadein { from{opacity:0;transform:translateY(2px)} to{opacity:1;transform:none} }
      `}</style>
      {/* glow blobs */}
      <span className="absolute -left-6 top-2 h-20 w-20 rounded-full bg-brand/20 blur-2xl" />
      <span className="absolute right-2 top-6 h-16 w-16 rounded-full bg-accent/20 blur-2xl" />
      {/* header strip: source = odds axis */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand">Live pool</span>
        <span className="tnum font-mono text-[11px] text-on-deep/70">$128,400</span>
      </div>
      <div className="absolute inset-x-4 top-9 h-px bg-[linear-gradient(90deg,transparent,rgb(var(--pw-brand-500)/0.6),transparent)]" />
      {/* falling spark coins */}
      {PARTICLES.map((p, i) => (
        <span key={i} className="absolute" style={{ left: `${p.left}%`, top: '38px', animation: `mp-fall ${p.dur}s ${p.delay}s ease-in infinite` }}>
          <svg width={p.size} height={p.size} viewBox="0 0 12 12" aria-hidden="true"><path d="M6 0l6 6-6 6-6-6z" fill={i % 2 ? '#16E0A3' : '#C6FF3D'} /></svg>
        </span>
      ))}
      {/* surface line + ripples */}
      <svg className="absolute inset-x-0 bottom-9 w-full" height="16" viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 10 Q 25 4 50 10 T 100 10 T 150 10 T 200 10" fill="none" stroke="rgba(198,255,61,0.35)" strokeWidth="1.4" />
      </svg>
      {[30, 60, 82].map((l, i) => (
        <span key={i} className="absolute bottom-[42px] h-3 w-3 rounded-full border border-brand/50" style={{ left: `${l}%`, animation: `mp-ripple ${2.4 + i * 0.3}s ${i * 0.5}s ease-out infinite` }} />
      ))}
      {/* footer status strip */}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 border-t border-white/10 px-4 py-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span key={status} className="font-mono text-[11px] text-on-deep/75" style={{ animation: 'mp-fadein 0.4s ease-out' }}>{STATUS[status]}</span>
      </div>
    </div>
  )
}

/* ---------- 3c. Predict cursor ---------- */
function PredictCursor() {
  const [step, setStep] = useState(0) // 0 idle,1 move,2 press,3 confirm,4 hold
  useEffect(() => {
    if (prefersReducedMotion()) { setStep(3); return }
    const id = setInterval(() => setStep((s) => (s + 1) % 5), 1400)
    return () => clearInterval(id)
  }, [])
  const pressed = step === 2
  const confirmed = step >= 3
  return (
    <div className="relative h-44 overflow-hidden rounded-2xl border border-strong bg-deep p-4">
      <div className="mb-3 flex items-center justify-between font-mono text-[11px] text-subtle"><span>Cashy vs Dee</span><span className="text-accent">54% / 46%</span></div>
      <div className="grid grid-cols-2 gap-2.5">
        <div className={`rounded-xl border px-3 py-2.5 text-center font-display text-sm font-semibold transition ${pressed || confirmed ? 'border-brand bg-brand/10 text-brand' : 'border-strong text-on-deep'}`}>Back Cashy</div>
        <div className="rounded-xl border border-strong px-3 py-2.5 text-center font-display text-sm font-semibold text-on-deep/60">Back Dee</div>
      </div>
      <div className={`mt-3 rounded-xl border px-3 py-2.5 text-center font-mono text-[12px] transition-all duration-300 ${confirmed ? 'border-accent/40 bg-accent/10 text-accent opacity-100' : 'border-transparent opacity-0'}`}>
        <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5" strokeWidth={3} /> Position locked · $25 on Cashy</span>
      </div>
      {/* cursor */}
      <span className="pointer-events-none absolute transition-all duration-500 ease-out" style={{ left: step >= 1 ? '26%' : '62%', top: step >= 1 ? '86px' : '120px', transform: pressed ? 'scale(0.85)' : 'scale(1)' }}>
        <MousePointer2 className="h-6 w-6 fill-white text-deep drop-shadow" strokeWidth={1.5} aria-hidden="true" />
      </span>
    </div>
  )
}

const DEMOS = { shuffler: OddsShuffler, signature: MarketPulse, cursor: PredictCursor }

export default function Features() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeader
          eyebrow="Why it feels different"
          title="A market you can read at a glance"
          sub="Three things make Bet It Up click: prices that move, results you can trust, and a bet you can place in one tap."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {FEATURES.map((f, idx) => {
            const Demo = DEMOS[f.demo]
            return (
              <div key={f.title} className="rise-in rounded-3xl border border-default bg-surface p-6 sm:p-7" style={{ animationDelay: `${idx * 90}ms` }}>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">{f.eyebrow}</p>
                <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-default">{f.title}</h3>
                <div className="mt-5" aria-hidden="true"><Demo /></div>
                <p className="mt-5 text-sm leading-relaxed text-muted">{f.body}</p>
                <ul className="mt-4 space-y-2">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-muted"><Check className="h-4 w-4 flex-none text-accent" strokeWidth={2.5} />{b}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
