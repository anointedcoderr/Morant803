import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { Container, SectionHeader, FighterAvatar, Button } from '../components/primitives.jsx'
import { useLock } from '../components/lock.jsx'
import { withMotion, prefersReducedMotion } from '../lib/motion.js'
import { SITE, FIGHTS } from '../lib/content.js'

const FILTERS = ['All fights', 'Title bouts', 'Trending', 'Closing soon']

function poolFor(probA, vol) {
  const base = parseFloat(vol) * 1000 * (probA / 50)
  return '$' + (Math.round(base / 100) * 100).toLocaleString('en-US')
}

export default function Markets() {
  const ref = useRef(null)
  const openLock = useLock()
  const [filter, setFilter] = useState('All fights')
  const [probs, setProbs] = useState(FIGHTS.map((f) => f.probA))

  useEffect(() => {
    return withMotion(() => {
      gsap.from('.market-card', {
        scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true },
        y: 40, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
      })
    }, ['.market-card'], ref.current)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = setInterval(() => {
      setProbs((prev) => {
        const next = [...prev]
        const i = Math.floor(Math.random() * next.length)
        next[i] = Math.max(25, Math.min(78, next[i] + (Math.random() < 0.5 ? -1 : 1)))
        return next
      })
    }, 2600)
    return () => clearInterval(id)
  }, [])

  const visibleIdx = FIGHTS.map((_, i) => i).filter((i) => {
    if (filter === 'Title bouts') return FIGHTS[i].weight.includes('Title') || FIGHTS[i].tier === 'Main event' || FIGHTS[i].tier === 'Co-main'
    if (filter === 'Trending') return i < 4
    if (filter === 'Closing soon') return i >= 4
    return true
  })

  return (
    <section ref={ref} id="markets" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow={`${SITE.event.title} · ${SITE.event.dateLabel}`}
            title="The full card, one live market each"
            sub="Eight bouts, eight markets. Prices shift in real time as the crowd backs a corner."
          />
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter markets">
            {FILTERS.map((f) => (
              <button
                key={f}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`inline-flex min-h-[44px] items-center rounded-full border px-4 py-2.5 font-mono text-[12.5px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${filter === f ? 'border-brand bg-brand font-semibold text-on-brand' : 'border-default bg-surface text-muted hover:border-strong hover:text-default'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {visibleIdx.map((i) => {
            const f = FIGHTS[i]
            const pa = probs[i]
            const pb = 100 - pa
            return (
              <article key={i} className="market-card group relative overflow-hidden rounded-2xl border border-default bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-strong hover:shadow-300">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-subtle">{f.weight}</span>
                  {(f.tier === 'Main event' || f.tier === 'Co-main')
                    ? <span className="rounded-full border border-warning/35 bg-warning/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-warning">{f.tier}</span>
                    : <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-subtle">{f.tier}</span>}
                </div>

                <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <FighterAvatar corner="red" initials={f.a.initials} size="sm" />
                    <div><div className="font-display text-sm font-semibold leading-tight text-default">{f.a.first[0]}. {f.a.last}</div><div className="tnum font-mono text-[11px] text-subtle">{f.a.record}</div></div>
                  </div>
                  <span className="font-mono text-[11px] text-subtle">VS</span>
                  <div className="flex flex-row-reverse items-center gap-2.5 text-right">
                    <FighterAvatar corner="blue" initials={f.b.initials} size="sm" />
                    <div><div className="font-display text-sm font-semibold leading-tight text-default">{f.b.first[0]}. {f.b.last}</div><div className="tnum font-mono text-[11px] text-subtle">{f.b.record}</div></div>
                  </div>
                </div>

                <div className="mb-2 flex justify-between font-mono text-[13px]"><span className="text-[#ff9aa2]">{pa}%</span><span className="text-[#a9c7ff]">{pb}%</span></div>
                <div className="flex h-2 overflow-hidden rounded-full bg-deep">
                  <div className="transition-[width] duration-500 bg-[linear-gradient(90deg,#e23b4a,#ff7480)]" style={{ width: `${pa}%` }} />
                  <div className="ml-auto transition-[width] duration-500 bg-[linear-gradient(90deg,#3d78e0,#8fbcff)]" style={{ width: `${pb}%` }} />
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-default pt-4">
                  <span className="tnum font-mono text-[12px] text-subtle">Pool <b className="text-muted">{poolFor(f.probA, f.vol)}</b> · Vol <b className="text-muted">${f.vol}</b></span>
                  <button onClick={() => openLock(`${f.a.last} vs ${f.b.last}`)} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-default bg-surface px-3.5 py-2.5 text-sm font-semibold text-default transition hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                    Trade <ArrowUpRight className="h-4 w-4" strokeWidth={2.4} />
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <Button variant="ghost" icon onClick={() => openLock('All markets')}>Open the full market book</Button>
        </div>
      </Container>
    </section>
  )
}
