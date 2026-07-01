import { Container, SectionHeader, Icon } from '../components/primitives.jsx'
import { WHY } from '../lib/content.js'

export default function WhyGrid() {
  return (
    <section id="why" className="scroll-mt-24 bg-deep py-24 sm:py-32">
      <Container>
        <SectionHeader eyebrow="Why Bet It Up" title="Built to feel fair, fast, and yours" sub="Everything a modern prediction platform should be, and nothing that gets in your way." />
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w) => (
            <div key={w.title} className="group bg-deep p-7 transition-colors hover:bg-white/[0.03] sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand/25 bg-brand/10 text-brand transition-transform duration-300 group-hover:scale-110">
                <Icon name={w.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-on-deep">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-on-deep/60">{w.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
