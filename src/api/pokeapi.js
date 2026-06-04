import { getGenerationFromId } from '../constants/regions'
import { isLegendary, isMythical, isPseudoLegendary } from '../constants/classifications'

const BASE = 'https://pokeapi.co/api/v2'
const CACHE_KEY = 'pokedex_cache_v1'
const LIST_LIMIT = 1025

const memoryCache = new Map()

async function fetchJSON(url) {
  if (memoryCache.has(url)) return memoryCache.get(url)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`PokéAPI error: ${res.status} ${url}`)
  const data = await res.json()
  memoryCache.set(url, data)
  return data
}

export async function fetchPokemonList() {
  const cached = localStorage.getItem(CACHE_KEY)
  if (cached) {
    try {
      return JSON.parse(cached)
    } catch {
      localStorage.removeItem(CACHE_KEY)
    }
  }

  const { results } = await fetchJSON(`${BASE}/pokemon?limit=${LIST_LIMIT}`)
  const batchSize = 80
  const summaries = []

  for (let i = 0; i < results.length; i += batchSize) {
    const batch = results.slice(i, i + batchSize)
    const details = await Promise.all(
      batch.map(async ({ url }) => {
        const id = parseInt(url.split('/').filter(Boolean).pop(), 10)
        try {
          const p = await fetchJSON(url)
          return {
            id: p.id,
            name: p.name,
            displayName: p.name.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            types: p.types.map((t) => t.type.name),
            sprite:
              p.sprites.other?.['official-artwork']?.front_default ||
              p.sprites.front_default,
            generation: null,
            region: null,
            height: p.height / 10,
            weight: p.weight / 10,
            bst: p.stats.reduce((s, st) => s + st.base_stat, 0),
            abilities: p.abilities.map((a) => ({
              name: a.ability.name,
              hidden: a.is_hidden,
            })),
          }
        } catch {
          return { id, name: batch.find((b) => b.url === url)?.url?.split('/').pop(), types: [], sprite: null }
        }
      })
    )
    summaries.push(...details)
  }

  const enriched = summaries.map((p) => {
    const gen = getGenerationFromId(p.id)
    return {
      ...p,
      generation: gen?.id,
      region: gen?.region,
      legendary: isLegendary(p.name),
      mythical: isMythical(p.name),
      pseudo: isPseudoLegendary(p.name),
      regional: /-alola|-galar|-hisui|-paldea/.test(p.name),
    }
  })

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(enriched))
  } catch {
    /* quota */
  }
  return enriched
}

export async function fetchPokemon(nameOrId) {
  const id = typeof nameOrId === 'number' ? nameOrId : nameOrId
  return fetchJSON(`${BASE}/pokemon/${id}`)
}

export async function fetchPokemonSpecies(nameOrId) {
  return fetchJSON(`${BASE}/pokemon-species/${nameOrId}`)
}

export async function fetchEvolutionChain(url) {
  return fetchJSON(url)
}

export async function fetchPokemonFull(nameOrId) {
  const [pokemon, species] = await Promise.all([
    fetchPokemon(nameOrId),
    fetchPokemonSpecies(nameOrId).catch(() => null),
  ])
  let evolutionChain = null
  if (species?.evolution_chain?.url) {
    try {
      evolutionChain = await fetchEvolutionChain(species.evolution_chain.url)
    } catch {
      evolutionChain = null
    }
  }
  return { pokemon, species, evolutionChain }
}

export function clearCache() {
  memoryCache.clear()
  localStorage.removeItem(CACHE_KEY)
}
