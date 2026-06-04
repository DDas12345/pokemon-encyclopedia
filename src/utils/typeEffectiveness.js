import { TYPE_CHART } from '../constants/types'

export function getEffectiveness(attackingType, defendingTypes) {
  if (!attackingType || !defendingTypes?.length) {
    return { multiplier: 1, label: 'neutral' }
  }
  let multiplier = 1
  for (const defType of defendingTypes) {
    const chart = TYPE_CHART[attackingType]
    if (!chart) continue
    const factor = chart[defType] ?? 1
    multiplier *= factor
  }
  let label = 'neutral'
  if (multiplier === 0) label = 'immune'
  else if (multiplier >= 2) label = 'super'
  else if (multiplier <= 0.5) label = 'weak'
  return { multiplier, label }
}

export function getDefensiveMatchups(defendingTypes) {
  const results = { superEffective: [], notVeryEffective: [], immune: [] }
  for (const atk of Object.keys(TYPE_CHART)) {
    const { multiplier, label } = getEffectiveness(atk, defendingTypes)
    if (label === 'immune' || multiplier === 0) results.immune.push(atk)
    else if (multiplier >= 2) results.superEffective.push(atk)
    else if (multiplier <= 0.5) results.notVeryEffective.push(atk)
  }
  return results
}

export function getOffensiveCoverage(attackingType) {
  const superEffective = []
  const notVeryEffective = []
  const immune = []
  const chart = TYPE_CHART[attackingType] || {}
  for (const [def, mult] of Object.entries(chart)) {
    if (mult === 0) immune.push(def)
    else if (mult >= 2) superEffective.push(def)
    else if (mult <= 0.5) notVeryEffective.push(def)
  }
  return { superEffective, notVeryEffective, immune }
}
