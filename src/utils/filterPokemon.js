import { getGenerationFromId } from '../constants/regions'

export function filterPokemonList(list, filters) {
  let result = [...list]
  const {
    search = '',
    types = [],
    generations = [],
    abilities = [],
    regions = [],
    legendary,
    mythical,
    pseudo,
  } = filters

  if (search.trim()) {
    const q = search.trim().toLowerCase()
    const num = parseInt(q, 10)
    result = result.filter((p) => {
      if (!Number.isNaN(num) && String(p.id).includes(String(num))) return true
      return (
        p.name.includes(q) ||
        p.displayName?.toLowerCase().includes(q) ||
        String(p.id) === q
      )
    })
  }

  if (types.length) {
    result = result.filter((p) => types.every((t) => p.types.includes(t)))
  }

  if (generations.length) {
    result = result.filter((p) => generations.includes(p.generation))
  }

  if (regions.length) {
    result = result.filter((p) => regions.includes(p.region))
  }

  if (abilities.length) {
    result = result.filter((p) =>
      abilities.some((a) =>
        p.abilities?.some((ab) => ab.name.includes(a.toLowerCase()))
      )
    )
  }

  if (legendary === true) result = result.filter((p) => p.legendary)
  if (legendary === false) result = result.filter((p) => !p.legendary)
  if (mythical === true) result = result.filter((p) => p.mythical)
  if (mythical === false) result = result.filter((p) => !p.mythical)
  if (pseudo === true) result = result.filter((p) => p.pseudo)
  if (pseudo === false) result = result.filter((p) => !p.pseudo)

  return result.sort((a, b) => a.id - b.id)
}

export function getDefaultFilters() {
  return {
    search: '',
    types: [],
    generations: [],
    abilities: [],
    regions: [],
    legendary: null,
    mythical: null,
    pseudo: null,
  }
}

export function pokemonInRegion(pokemon, regionName) {
  const gen = getGenerationFromId(pokemon.id)
  return gen?.region === regionName
}
