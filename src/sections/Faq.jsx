import { Plus } from 'lucide-react'
import { Container, SectionHeader } from '../components/primitives.jsx'
import { FAQ } from '../lib/content.js'

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <SectionHeader center eyebrow="Questions" title="Good to know" className="mb-10" />
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQ.map((qa) => (
            <details key={qa.q} className="group rounded-2xl border border-default bg-surface transition-colors open:border-strong">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl p-5 font-display text-base font-semibold text-default [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                {qa.q}
                <Plus className="h-5 w-5 flex-none text-brand transition-transform duration-300 group-open:rotate-45" strokeWidth={2.2} aria-hidden="true" />
              </summary>
              <div className="max-w-[70ch] px-5 pb-5 text-[15px] leading-relaxed text-muted">{qa.a}</div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  )
}
