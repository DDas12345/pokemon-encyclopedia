import { formatName } from '../../utils/pokemonHelpers'

const STAT_COLORS = {
  hp: '#ef4444',
  attack: '#f97316',
  defense: '#eab308',
  'special-attack': '#3b82f6',
  'special-defense': '#22c55e',
  speed: '#ec4899',
}

export default function StatChart({ stats, compareStats }) {
  const max = 255
  return (
    <div className="space-y-3">
      {stats.map((stat) => {
        const name = stat.stat?.name || stat.stat
        const value = stat.base_stat
        const compareVal = compareStats?.find(
          (s) => (s.stat?.name || s.stat) === name
        )?.base_stat
        const pct = (value / max) * 100
        const comparePct = compareVal ? (compareVal / max) * 100 : 0
        return (
          <div key={name} className="stat-row">
            <span className="stat-label w-28 shrink-0 text-sm font-medium">
              {formatName(name)}
            </span>
            <div className="stat-bar-track flex-1">
              {compareVal != null && (
                <div
                  className="stat-bar-compare"
                  style={{ width: `${comparePct}%`, backgroundColor: '#94a3b8' }}
                />
              )}
              <div
                className="stat-bar-fill transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  backgroundColor: STAT_COLORS[name] || '#6366f1',
                }}
              />
            </div>
            <span className="stat-value w-10 text-right font-mono text-sm font-bold">
              {value}
            </span>
          </div>
        )
      })}
    </div>
  )
}
