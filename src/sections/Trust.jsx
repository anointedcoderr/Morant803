import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Container, Icon } from '../components/primitives.jsx'
import { withMotion } from '../lib/motion.js'
import { TRUST } from '../lib/content.js'

export default function Trust() {
  const ref = useRef(null)
  useEffect(() => {
    return withMotion(() => {
      gsap.from('.trust-badge', {
        scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true },
        y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      })
    }, ['.trust-badge'], ref.current)
  }, [])

  return (
    <section ref={ref} className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3">
          {TRUST.map((t) => (
            <div key={t.title} className="trust-badge flex items-start gap-4 rounded-2xl border border-default bg-surface p-6 transition hover:-translate-y-0.5 hover:shadow-200">
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand">
                <Icon name={t.icon} className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-default">{t.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{t.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
