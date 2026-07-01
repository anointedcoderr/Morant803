import { useState } from 'react'
import { Ticket, Star, Crown, Check, Loader2 } from 'lucide-react'
import { Container, Eyebrow, Button } from '../components/primitives.jsx'
import { SITE } from '../lib/content.js'

const PERKS = [
  { Icon: Ticket, title: 'First pick on opening prices', body: 'Get in before the crowd moves the line on launch night.' },
  { Icon: Star, title: 'Front-row seat to Fight Night 01', body: 'Early members shape the card before it goes public.' },
  { Icon: Crown, title: 'Founding-member perks', body: 'Reduced fees and priority support once we go live.' },
]

function Field({ label, id, type = 'text', textarea = false, required = false, ...rest }) {
  const cls = 'w-full rounded-xl border border-default bg-deep px-4 py-3 text-[15px] text-default placeholder:text-subtle transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-[color:rgb(var(--pw-brand-500)/0.15)]'
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.1em] text-muted">{label}{required && <span className="text-brand"> *</span>}</span>
      {textarea
        ? <textarea id={id} rows={4} className={cls} {...rest} />
        : <input id={id} type={type} className={cls} {...rest} />}
    </label>
  )
}

export default function EarlyAccess() {
  const [state, setState] = useState('idle') // idle | sending | sent
  const onSubmit = (e) => {
    e.preventDefault()
    if (state !== 'idle') return
    setState('sending')
    setTimeout(() => setState('sent'), 1200)
  }

  return (
    <section id="early" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <div className="overflow-hidden rounded-3xl border border-strong bg-surface" style={{ backgroundImage: 'linear-gradient(135deg, rgb(var(--pw-brand-500)/0.10), rgb(var(--pw-accent-500)/0.06))' }}>
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <Eyebrow>{SITE.event.title} · {SITE.event.dateLabel}</Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-default sm:text-4xl">Get in before the first bell</h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted">Join the early-access list and be ready the moment the card goes live. It takes a few seconds.</p>
              <ul className="mt-8 space-y-5">
                {PERKS.map((p) => (
                  <li key={p.title} className="flex gap-4">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand"><p.Icon className="h-5 w-5" strokeWidth={2} /></span>
                    <div><div className="font-display text-[15px] font-semibold text-default">{p.title}</div><div className="mt-0.5 text-sm text-muted">{p.body}</div></div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              {state === 'sent' ? (
                <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-accent/30 bg-surface-raised p-10 text-center">
                  <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/40 bg-accent/10 text-accent"><Check className="h-8 w-8" strokeWidth={2.5} /></span>
                  <h3 className="font-display text-2xl font-bold text-default">You are on the list</h3>
                  <p className="mt-2 max-w-xs text-sm text-muted">We will reach out with your early-access invite before Fight Night 01. Save your spot in the corner.</p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="rounded-2xl border border-default bg-surface-raised p-6 sm:p-8">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" id="ea-name" required placeholder="Jordan Rivera" autoComplete="name" />
                    <Field label="Email" id="ea-email" type="email" required placeholder="you@email.com" autoComplete="email" />
                  </div>
                  <div className="mt-4">
                    <Field label="Phone (optional)" id="ea-phone" type="tel" placeholder="(555) 000-0000" autoComplete="tel" />
                  </div>
                  <div className="mt-4">
                    <Field label="Who are you backing on the card?" id="ea-msg" textarea placeholder="Marquez by decision, and I like Kelly to stop Nkosi early." />
                  </div>
                  <Button type="submit" className="mt-6 w-full" size="lg" disabled={state === 'sending'} aria-busy={state === 'sending'}>
                    {state === 'sending' ? <><Loader2 className="h-4 w-4 animate-spin" /> Joining...</> : 'Join the early-access list'}
                  </Button>
                  <p className="mt-3 text-center text-[12px] text-subtle">Concept preview. This form does not collect real data yet.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
