import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Container, SectionHeader, FighterAvatar, Button } from '../components/primitives.jsx'
import { prefersReducedMotion } from '../lib/motion.js'
import { SITE, FIGHTS } from '../lib/content.js'

const FILTERS = ['All fights', 'Main card', "Men's", "Women's"]

function poolFor(probA, vol) {
  const base = parseFloat(vol) * 1000 * (probA / 50)
  return '$' + (Math.round(base / 100) * 100).toLocaleString('en-US')
}

export default function Markets() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All fights')
  const [probs, setProbs] = useState(FIGHTS.map((f) => f.probA))

  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = setInterval(() => {
      setProbs((prev) => {
        const next = [...prev]
        const i = Math.floor(Math.random() * next.length)
        next[i] = Math.max(28, Math.min(75, next[i] + (Math.random() < 0.5 ? -1 : 1)))
        return next
      })
    }, 2600)
    return () => clearInterval(id)
  }, [])

  const visibleIdx = FIGHTS.map((_, i) => i).filter((i) => {
    if (filter === 'Main card') return ['Main event', 'Co-main', 'Featured'].includes(FIGHTS[i].tier)
    if (filter === "Men's") return FIGHTS[i].tag === "Men's bout"
    if (filter === "Women's") return FIGHTS[i].tag === "Women's bout"
    return true
  })

  return (
    <section id="markets" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow={`${SITE.event.title} · ${SITE.event.dateLabel}`}
            title="The full card, one live market each"
            sub="Six bouts, six markets. Prices shift in real time as the crowd calls each fight."
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
          {visibleIdx.map((i, pos) => {
            const f = FIGHTS[i]
            const pa = probs[i]
            const pb = 100 - pa
            return (
              <article key={i} className="rise-in group relative overflow-hidden rounded-2xl border border-default bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-strong hover:shadow-300" style={{ animationDelay: `${Math.min(pos, 6) * 60}ms` }}>
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-subtle">{f.tag}</span>
                  {(f.tier === 'Main event' || f.tier === 'Co-main')
                    ? <span className="rounded-full border border-warning/35 bg-warning/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-warning">{f.tier}</span>
                    : <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-subtle">{f.tier}</span>}
                </div>

                <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <FighterAvatar corner="red" initials={f.a.initials} size="sm" />
                    <div className="font-display text-base font-semibold leading-tight text-default">{f.a.name}</div>
                  </div>
                  <span className="font-mono text-[11px] text-subtle">VS</span>
                  <div className="flex flex-row-reverse items-center gap-2.5 text-right">
                    <FighterAvatar corner="blue" initials={f.b.initials} size="sm" />
                    <div className="font-display text-base font-semibold leading-tight text-default">{f.b.name}</div>
                  </div>
                </div>

                <div className="mb-2 flex justify-between font-mono text-[13px]"><span className="text-[#ff9aa2]">{pa}%</span><span className="text-[#a9c7ff]">{pb}%</span></div>
                <div className="flex h-2 overflow-hidden rounded-full bg-deep">
                  <div className="transition-[width] duration-500 bg-[linear-gradient(90deg,#e23b4a,#ff7480)]" style={{ width: `${pa}%` }} />
                  <div className="ml-auto transition-[width] duration-500 bg-[linear-gradient(90deg,#3d78e0,#8fbcff)]" style={{ width: `${pb}%` }} />
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-default pt-4">
                  <span className="tnum font-mono text-[12px] text-subtle">Pool <b className="text-muted">{poolFor(f.probA, f.vol)}</b> · Vol <b className="text-muted">${f.vol}</b></span>
                  <button onClick={() => navigate('/app')} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-default bg-surface px-3.5 py-2.5 text-sm font-semibold text-default transition hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                    Trade <ArrowUpRight className="h-4 w-4" strokeWidth={2.4} />
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <Button variant="ghost" icon onClick={() => navigate('/app')}>Open the full market book</Button>
        </div>
      </Container>
    </section>
  )
}
