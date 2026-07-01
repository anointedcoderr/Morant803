import { ANNOUNCE } from '../lib/content.js'

export default function Announcement() {
  return (
    <div className="relative z-40 border-b border-white/10 bg-[linear-gradient(90deg,rgb(var(--pw-brand-500)/0.14),rgb(var(--pw-accent-500)/0.10))]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-[13px] text-default">
        <span>{ANNOUNCE.text}</span>
        <a href="#credit" className="font-semibold text-brand underline decoration-brand/40 underline-offset-4 transition hover:decoration-brand">
          {ANNOUNCE.cta}
        </a>
      </div>
    </div>
  )
}
