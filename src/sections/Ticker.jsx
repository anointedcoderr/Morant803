import { FIGHTS } from '../lib/content.js'

const moves = ['+1.2', '+0.6', '-0.9', '+2.1', '+0.4', '-0.3', '+1.7', '+0.8']

export default function Ticker() {
  const items = FIGHTS.map((f, i) => ({
    name: f.a.last,
    prob: f.probA,
    move: moves[i % moves.length],
  }))
  const doubled = [...items, ...items]

  return (
    <div className="group relative overflow-hidden border-y border-default bg-deep">
      <div className="flex w-max animate-ticker gap-10 py-3 group-hover:[animation-play-state:paused]">
        {doubled.map((it, i) => {
          const up = it.move.startsWith('+')
          return (
            <span key={i} className="inline-flex items-center gap-2 font-mono text-[13px] text-muted" aria-hidden="true">
              <span className="text-on-deep">{it.name}</span>
              <span className="text-brand">{it.prob}%</span>
              <span className={up ? 'text-accent' : 'text-danger'}>{up ? '▲' : '▼'} {it.move.replace('+', '').replace('-', '')}</span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
