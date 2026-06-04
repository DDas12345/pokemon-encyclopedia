import { useState, useMemo } from 'react'
import { TYPES, TYPE_CHART, TYPE_COLORS } from '../constants/types'
import { usePokemonList } from '../hooks/usePokemonList'
import { getEffectiveness, getOffensiveCoverage } from '../utils/typeEffectiveness'
import TypeBadge from '../components/ui/TypeBadge'
import { formatName } from '../utils/pokemonHelpers'

export default function TypeCalculator() {
  const [attackType, setAttackType] = useState('fire')
  const [defender, setDefender] = useState(null)
  const { pokemon } = usePokemonList()

  const defendingTypes = defender?.types || []

  const result = useMemo(
    () => getEffectiveness(attackType, defendingTypes),
    [attackType, defendingTypes]
  )

  const coverage = useMemo(() => getOffensiveCoverage(attackType), [attackType])

  const multiplierLabel = {
    immune: 'No effect (0×)',
    super: 'Super effective (2×+)',
    weak: 'Not very effective (≤0.5×)',
    neutral: 'Neutral damage (1×)',
  }

  return (
    <div className="type-calc-page">
      <header className="page-header">
        <h1>Type Effectiveness</h1>
        <p>Calculate matchups and explore the type chart</p>
      </header>

      <div className="type-calc-layout">
        <section className="panel">
          <h2>Calculator</h2>
          <label>
            Attacking type
            <select value={attackType} onChange={(e) => setAttackType(e.target.value)} className="filter-input">
              {TYPES.map((t) => (
                <option key={t} value={t}>{formatName(t)}</option>
              ))}
            </select>
          </label>
          <label className="mt-4 block">
            Defending Pokémon
            <select
              value={defender?.id || ''}
              onChange={(e) => {
                const p = pokemon.find((x) => x.id === +e.target.value)
                setDefender(p || null)
              }}
              className="filter-input"
            >
              <option value="">Select...</option>
              {pokemon.slice(0, 1025).map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.id} {p.displayName}
                </option>
              ))}
            </select>
          </label>

          {defender && (
            <div className={`result-box result-${result.label} mt-6`}>
              <p className="text-lg font-bold">{multiplierLabel[result.label]}</p>
              <p>Multiplier: {result.multiplier}×</p>
              <div className="mt-2 flex gap-1">
                {defendingTypes.map((t) => (
                  <TypeBadge key={t} type={t} />
                ))}
              </div>
            </div>
          )}

          <h3 className="mt-6">Offensive chart — {formatName(attackType)}</h3>
          <div className="matchup-lists">
            <div>
              <strong>Super effective</strong>
              <div className="type-row">{coverage.superEffective.map((t) => <TypeBadge key={t} type={t} size="sm" />)}</div>
            </div>
            <div>
              <strong>Not very effective</strong>
              <div className="type-row">{coverage.notVeryEffective.map((t) => <TypeBadge key={t} type={t} size="sm" />)}</div>
            </div>
            <div>
              <strong>Immune</strong>
              <div className="type-row">{coverage.immune.map((t) => <TypeBadge key={t} type={t} size="sm" />)}</div>
            </div>
          </div>
        </section>

        <section className="panel type-chart-panel">
          <h2>Type Chart</h2>
          <div className="chart-scroll">
            <table className="type-chart-table">
              <thead>
                <tr>
                  <th>Atk ↓ / Def →</th>
                  {TYPES.map((t) => (
                    <th key={t} style={{ color: TYPE_COLORS[t] }}>{t.slice(0, 3)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TYPES.map((atk) => (
                  <tr key={atk}>
                    <th style={{ color: TYPE_COLORS[atk] }}>{formatName(atk)}</th>
                    {TYPES.map((def) => {
                      const mult = TYPE_CHART[atk]?.[def] ?? 1
                      const cls = mult === 0 ? 'immune' : mult >= 2 ? 'super' : mult <= 0.5 ? 'weak' : ''
                      return (
                        <td key={def} className={cls}>
                          {mult === 0 ? '0' : mult === 2 ? '2' : mult === 0.5 ? '½' : '1'}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
