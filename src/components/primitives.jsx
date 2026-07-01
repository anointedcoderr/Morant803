import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight, TrendingUp, ShieldCheck, Zap, Smartphone, Lock, LifeBuoy,
  Activity, Wallet, Trophy, BadgeCheck,
} from 'lucide-react'
import { prefersReducedMotion } from '../lib/motion.js'

/* Icon registry so data files can reference icons by string name */
const ICONS = { TrendingUp, ShieldCheck, Zap, Smartphone, Lock, LifeBuoy, Activity, Wallet, Trophy, BadgeCheck }
export function Icon({ name, className, strokeWidth = 2.2 }) {
  const Cmp = ICONS[name] || Activity
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />
}

export function Container({ className = '', children }) {
  return <div className={`mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16 ${className}`}>{children}</div>
}

export function Eyebrow({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] text-brand ${className}`}>
      <span className="h-px w-5 bg-brand/70" aria-hidden="true" />
      {children}
    </span>
  )
}

export function SectionHeader({ eyebrow, title, sub, center = false, className = '' }) {
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      {eyebrow && <Eyebrow className={center ? 'justify-center' : ''}>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-default sm:text-5xl lg:text-[3.4rem] lg:leading-[1.03]">{title}</h2>
      {sub && <p className={`mt-4 text-base leading-relaxed text-muted sm:text-lg ${center ? 'mx-auto' : ''} max-w-xl`}>{sub}</p>}
    </div>
  )
}

/* Buttons — full interaction-state matrix */
export function Button({ as = 'button', href, variant = 'primary', size = 'md', icon = false, className = '', children, ...rest }) {
  const base =
    'magnetic-btn inline-flex items-center justify-center gap-2 font-display font-semibold rounded-full whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-deep disabled:cursor-not-allowed disabled:opacity-50'
  const sizes = { md: 'px-6 py-3.5 text-[15px]', sm: 'px-4 py-2.5 text-sm', lg: 'px-7 py-4 text-base' }
  const variants = {
    primary: 'bg-brand text-on-brand shadow-cta hover:bg-brand-hover',
    secondary: 'glass text-default hover:border-brand',
    ghost: 'bg-surface border border-default text-default hover:border-strong',
    dark: 'bg-deep text-on-deep border border-white/10 hover:border-white/25',
  }
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`
  const content = (
    <>
      {children}
      {icon && <ArrowUpRight className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />}
    </>
  )
  if (as === 'a') return <a href={href} className={cls} {...rest}>{content}</a>
  return <button className={cls} {...rest}>{content}</button>
}

export function Pill({ children, className = '', dot = false }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted ${className}`}>
      {dot && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-accent" /></span>}
      {children}
    </span>
  )
}

/* Fighter avatar — red / blue corner convention */
export function FighterAvatar({ corner = 'red', initials, size = 'md' }) {
  const sizes = { sm: 'h-11 w-11 text-[13px] rounded-xl', md: 'h-14 w-14 text-lg rounded-2xl', lg: 'h-16 w-16 text-xl rounded-2xl' }
  const tone = corner === 'red'
    ? 'text-white bg-[linear-gradient(150deg,#ff8088,#e23b4a)] shadow-[0_10px_28px_-12px_rgba(226,59,74,0.75)]'
    : 'text-white bg-[linear-gradient(150deg,#8fbcff,#3d78e0)] shadow-[0_10px_28px_-12px_rgba(61,120,224,0.75)]'
  return <div className={`flex flex-none items-center justify-center font-display font-bold ${sizes[size]} ${tone}`} aria-hidden="true">{initials}</div>
}

/* CountUp — IntersectionObserver + RAF, reduced-motion aware, formatted */
export function CountUp({ end, prefix = '', suffix = '', decimals = 0, duration = 1900 }) {
  const [value, setValue] = useState(prefersReducedMotion() ? end : 0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    if (prefersReducedMotion()) { setValue(end); return }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const startTs = performance.now()
        const tick = (now) => {
          const t = Math.min(1, (now - startTs) / duration)
          const eased = 1 - Math.pow(1 - t, 3)
          setValue(end * eased)
          if (t < 1) requestAnimationFrame(tick)
          else setValue(end)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, duration])

  const formatted = decimals > 0
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString('en-US')

  return <span ref={ref} className="tnum">{prefix}{formatted}{suffix}</span>
}

/* Logo lockup */
export function Logo({ className = '', wordmark = true, size = 'md' }) {
  const badge = size === 'lg' ? 'h-10 w-10' : 'h-9 w-9'
  const text = size === 'lg' ? 'text-2xl' : 'text-lg sm:text-xl'
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className={`relative flex ${badge} flex-none items-center justify-center rounded-xl bg-brand`}>
        <Zap className="h-5 w-5 text-on-brand" strokeWidth={2.6} aria-hidden="true" />
        <span className="absolute inset-0 rounded-xl ring-1 ring-brand/40" aria-hidden="true" />
      </span>
      {wordmark && (
        <span className={`font-display font-bold tracking-tight ${text} text-default`}>
          MORANT<span className="text-brand">803</span>
        </span>
      )}
    </span>
  )
}
