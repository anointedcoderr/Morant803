import { gsap } from 'gsap'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Run a GSAP build function only when motion is allowed.
 * When reduced, immediately place targets in their FINAL state so the
 * page is fully visible and static (never stuck mid-animation).
 */
export function withMotion(build, reveal, scope) {
  if (prefersReducedMotion()) {
    ;(reveal || []).forEach((sel) =>
      gsap.set(sel, { clearProps: 'all', opacity: 1, x: 0, y: 0, scale: 1, filter: 'none' })
    )
    return () => {}
  }
  const ctx = gsap.context(build, scope)
  return () => ctx.revert()
}
