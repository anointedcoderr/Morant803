import { Container, CountUp } from '../components/primitives.jsx'
import { PILLARS } from '../lib/content.js'

export default function Pillars() {
  return (
    <section className="relative overflow-hidden border-y border-default">
      <style>{`@keyframes pillar-sweep{0%{transform:translateX(-100%)}50%{transform:translateX(100%)}100%{transform:translateX(100%)}}`}</style>
      <div className="grid-bg absolute inset-0 opacity-60" aria-hidden="true" />
      <span className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-brand/10 blur-3xl" aria-hidden="true" />
      <span className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
      <Container className="relative">
        <div className="grid divide-white/10 py-16 sm:py-20 lg:grid-cols-3 lg:divide-x">
          {PILLARS.map((p) => (
            <div key={p.eyebrow} className="px-2 py-6 text-center lg:px-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">{p.eyebrow}</p>
              <div className="mt-3 font-display text-5xl font-bold tracking-tight text-default sm:text-6xl">
                <span className="gradient-text">
                  <CountUp end={p.value} prefix={p.prefix} suffix={p.suffix} decimals={p.decimals} />
                </span>
              </div>
              <div className="mx-auto mt-4 h-px w-24 overflow-hidden">
                <div className="h-px w-full bg-[linear-gradient(90deg,transparent,rgb(var(--pw-brand-500)),transparent)]" style={{ animation: 'pillar-sweep 3s ease-in-out infinite' }} />
              </div>
              <p className="mx-auto mt-4 max-w-[16rem] text-sm leading-relaxed text-muted">{p.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
