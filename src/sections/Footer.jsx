import { Link } from 'react-router-dom'
import { Globe, Mail, MessageCircle, Send, CalendarDays } from 'lucide-react'
import { Logo } from '../components/primitives.jsx'
import { useLock } from '../components/lock.jsx'
import { FOOTER_COLUMNS, CREDIT, SITE } from '../lib/content.js'

function FootLink({ link, openLock }) {
  if (link.route) {
    return <Link to={link.route} className="block py-1.5 text-sm text-muted transition-colors hover:text-brand">{link.label}</Link>
  }
  if (link.href) {
    return <a href={link.href} className="block py-1.5 text-sm text-muted transition-colors hover:text-brand">{link.label}</a>
  }
  return (
    <button onClick={() => openLock(link.lock)} className="block py-1.5 text-left text-sm text-muted transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
      {link.label}
    </button>
  )
}

const CREDIT_LINKS = [
  { key: 'website', label: 'Website', href: CREDIT.links.website, Icon: Globe, ext: true },
  { key: 'email', label: 'Email', href: CREDIT.links.email, Icon: Mail, ext: false },
  { key: 'whatsapp', label: 'WhatsApp', href: CREDIT.links.whatsapp, Icon: MessageCircle, ext: true },
  { key: 'telegram', label: 'Telegram', href: CREDIT.links.telegram, Icon: Send, ext: true },
  { key: 'call', label: 'Book a call', href: CREDIT.links.call, Icon: CalendarDays, ext: true },
]

export default function Footer() {
  const openLock = useLock()
  return (
    <footer className="border-t border-white/10 bg-deep">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:px-16">
        <div>
          <Logo size="lg" />
          <p className="mt-4 max-w-xs font-serif text-xl italic leading-snug text-on-deep/70">
            Don't Just Watch. Bet It Up.
          </p>
          <div className="mt-5 inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-on-deep/60">{SITE.event.title} · {SITE.event.dateLabel}</span>
          </div>
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 font-mono text-xs uppercase tracking-[0.1em] text-on-deep/50">{col.title}</h4>
            {col.links.map((l) => <FootLink key={l.label} link={l} openLock={openLock} />)}
          </div>
        ))}
      </div>

      {/* Anointed Coder credit band */}
      <div id="credit" className="border-t border-white/10 bg-[linear-gradient(90deg,rgb(139_92_246/0.12),rgb(var(--pw-brand-500)/0.06))]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-8 sm:px-10 lg:px-16">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-[rgb(139_92_246/0.45)] bg-[linear-gradient(150deg,rgb(139_92_246/0.28),rgb(var(--pw-brand-500)/0.16))] font-display text-[15px] font-bold text-white">AC</div>
            <div>
              <p className="font-display text-[15px] font-semibold text-on-deep">{CREDIT.title}</p>
              <p className="mt-0.5 text-[13px] text-on-deep/60">{CREDIT.blurb}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {CREDIT_LINKS.map(({ key, label, href, Icon, ext }) => (
              <a
                key={key}
                href={href}
                {...(ext ? { target: '_blank', rel: 'noopener' } : {})}
                className="inline-flex items-center gap-2 rounded-xl border border-white/[.12] bg-white/[0.04] px-3.5 py-2.5 text-[13px] font-medium text-on-deep/80 transition hover:-translate-y-0.5 hover:border-brand hover:text-on-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div id="contact-ac" className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-[12.5px] text-on-deep/60 sm:px-10 lg:px-16">
          <span className="max-w-2xl">{CREDIT.disclaimer}</span>
          <span>© 2026 Concept preview · <a href="#credit" className="text-on-deep/70 underline underline-offset-2">Request changes</a></span>
        </div>
      </div>
    </footer>
  )
}
