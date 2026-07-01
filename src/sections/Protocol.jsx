import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check } from 'lucide-react'
import { Container, SectionHeader } from '../components/primitives.jsx'
import { withMotion } from '../lib/motion.js'
import { PROTOCOL } from '../lib/content.js'

export default function Protocol() {
  const ref = useRef(null)
  useEffect(() => {
    return withMotion(() => {
      const cards = gsap.utils.toArray('.protocol-card')
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return
        gsap.to(card, {
          scrollTrigger: { trigger: card, start: 'top top+=120', end: '+=480', scrub: 1 },
          scale: 0.92, filter: 'blur(6px) saturate(0.7)', opacity: 0.4, ease: 'none',
        })
      })
    }, ['.protocol-card'], ref.current)
  }, [])

  return (
    <section ref={ref} id="how" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <SectionHeader eyebrow="How it works" title="From sign-up to payout in three moves" sub="No sportsbook jargon and no confusing slips. If you can pick a winner, you can play." />
      </Container>
      <div className="relative mx-auto mt-12 max-w-7xl px-6 sm:px-10 lg:px-16">
        {PROTOCOL.map((s) => (
          <div key={s.step} className="protocol-card mb-8 motion-safe:sticky motion-safe:top-24">
            <div className="grid overflow-hidden rounded-3xl border border-strong bg-surface-raised shadow-400 lg:grid-cols-5">
              <div className="flex flex-col justify-center p-8 sm:p-10 lg:col-span-3">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand/30 bg-brand/10 font-display text-lg font-bold text-brand">{s.step}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">{s.eyebrow}</span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-default sm:text-3xl">{s.title}</h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-muted">{s.body}</p>
                <ul className="mt-6 space-y-2.5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2.5 text-sm text-default"><Check className="h-4 w-4 flex-none text-accent" strokeWidth={2.5} />{b}</li>
                  ))}
                </ul>
              </div>
              <div className="relative min-h-[220px] lg:col-span-2">
                <img src={s.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-85" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(var(--pw-bg-surface-raised)),transparent_45%),linear-gradient(0deg,rgb(var(--pw-bg-deep)/0.5),transparent)]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
