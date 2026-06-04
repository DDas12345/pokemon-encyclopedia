import { getGenerationFromId, getRegionFromId } from '../constants/regions'
import { isLegendary, isMythical, isPseudoLegendary } from '../constants/classifications'
import { REGIONAL_SUFFIXES } from '../constants/megaGmaxForms'

export function formatName(name) {
  if (!name) return ''
  return name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function getSpriteUrl(pokemon, shiny = false) {
  const sprites = pokemon?.sprites || pokemon
  if (!sprites) return '/favicon.svg'
  if (shiny && sprites.front_shiny) return sprites.front_shiny
  return (
    sprites.other?.['official-artwork']?.front_default ||
    sprites.other?.home?.front_default ||
    sprites.front_default ||
    '/favicon.svg'
  )
}

export function getCryUrl(pokemon) {
  const cries = pokemon?.cries || pokemon
  return cries?.latest || cries?.legacy?.[0] || null
}

export function getBaseStatTotal(stats) {
  if (!stats?.length) return 0
  return stats.reduce((sum, s) => sum + (s.base_stat || 0), 0)
}

export function getGenderRatio(species) {
  const rate = species?.gender_rate
  if (rate === -1) return 'Genderless'
  if (rate === 8) return '100% Female'
  if (rate === 0) return '100% Male'
  const female = ((rate / 8) * 100).toFixed(1)
  const male = (100 - parseFloat(female)).toFixed(1)
  return `${male}% Male / ${female}% Female`
}

export function getFlavorText(species, lang = 'en') {
  const entries = species?.flavor_text_entries || []
  const en = entries.filter((e) => e.language?.name === lang)
  const latest = en[en.length - 1]
  return latest?.flavor_text?.replace(/\f|\n/g, ' ') || 'No Pokédex entry available.'
}

export function getEvYield(stats) {
  return (stats || [])
    .filter((s) => s.effort > 0)
    .map((s) => `${formatName(s.stat?.name || s.stat)} +${s.effort}`)
    .join(', ') || 'None'
}

export function normalizePokemonSummary(pokemon, species = null) {
  const id = pokemon.id
  const gen = getGenerationFromId(id)
  const name = pokemon.name
  return {
    id,
    name,
    displayName: formatName(name),
    types: pokemon.types?.map((t) => t.type.name) || [],
    sprite: getSpriteUrl(pokemon),
    generation: gen?.id || null,
    region: gen?.region || getRegionFromId(id),
    height: pokemon.height / 10,
    weight: pokemon.weight / 10,
    bst: getBaseStatTotal(pokemon.stats),
    legendary: isLegendary(name),
    mythical: isMythical(name),
    pseudo: isPseudoLegendary(name),
    abilities: pokemon.abilities?.map((a) => ({
      name: a.ability.name,
      hidden: a.is_hidden,
    })) || [],
    regional: REGIONAL_SUFFIXES.some((s) => name.includes(s)),
    species,
    raw: pokemon,
  }
}

export const NATURE_STATS = {
  hardy: null, lonely: { up: 'attack', down: 'defense' },
  brave: { up: 'attack', down: 'speed' }, adamant: { up: 'attack', down: 'special-attack' },
  naughty: { up: 'attack', down: 'special-defense' }, bold: { up: 'defense', down: 'attack' },
  docile: null, relaxed: { up: 'defense', down: 'speed' },
  impish: { up: 'defense', down: 'special-attack' }, lax: { up: 'defense', down: 'special-defense' },
  timid: { up: 'speed', down: 'attack' }, hasty: { up: 'speed', down: 'defense' },
  serious: null, jolly: { up: 'speed', down: 'special-attack' },
  naive: { up: 'speed', down: 'special-defense' }, modest: { up: 'special-attack', down: 'attack' },
  mild: { up: 'special-attack', down: 'defense' }, quiet: { up: 'special-attack', down: 'speed' },
  bashful: null, rash: { up: 'special-attack', down: 'special-defense' },
  calm: { up: 'special-defense', down: 'attack' }, gentle: { up: 'special-defense', down: 'defense' },
  sassy: { up: 'special-defense', down: 'speed' }, careful: { up: 'special-defense', down: 'special-attack' },
  quirky: null,
}

export function recommendNatures(pokemon) {
  if (!pokemon?.stats) return ['Any']
  const sorted = [...pokemon.stats].sort((a, b) => b.base_stat - a.base_stat)
  const top = sorted[0]?.stat?.name
  const natures = Object.entries(NATURE_STATS)
    .filter(([, v]) => v?.up === top)
    .map(([n]) => formatName(n))
  return natures.length ? natures.slice(0, 4) : ['Adamant', 'Modest', 'Jolly', 'Timid']
}

export function getCompetitiveTier(bst, legendary) {
  if (legendary) return 'Uber'
  if (bst >= 600) return 'OU'
  if (bst >= 500) return 'UU'
  if (bst >= 450) return 'RU'
  return 'NU'
}
