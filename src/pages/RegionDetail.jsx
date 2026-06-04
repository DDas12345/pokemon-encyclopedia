import { useParams, Link } from 'react-router-dom'
import { useMemo } from 'react'
import { REGIONS } from '../constants/regions'
import { usePokemonList } from '../hooks/usePokemonList'
import PokemonCard from '../components/pokemon/PokemonCard'
import { formatName } from '../utils/pokemonHelpers'
import { GridSkeleton } from '../components/ui/LoadingSkeleton'

export default function RegionDetail() {
  const { regionId } = useParams()
  const region = REGIONS.find((r) => r.id === regionId)
  const { pokemon, loading } = usePokemonList()

  const regionalDex = useMemo(() => {
    if (!region) return []
    const [min, max] = region.range
    return pokemon.filter((p) => p.id >= min && p.id <= max && !p.regional)
  }, [pokemon, region])

  const regionalForms = useMemo(() => {
    if (!region) return []
    const suffix = {
      alola: '-alola',
      galar: '-galar',
      hisui: '-hisui',
      paldea: '-paldea',
    }[regionId]
    if (!suffix) return []
    return pokemon.filter((p) => p.name?.includes(suffix))
  }, [pokemon, region, regionId])

  if (!region) return <div className="error-banner">Region not found</div>

  return (
    <div className="region-detail-page">
      <Link to="/regions" className="back-link">← All regions</Link>
      <header
        className="region-hero"
        style={{ '--region-color': region.color }}
      >
        <h1>{region.name}</h1>
        <p>Generation {region.generation} · Dex #{region.range[0]}–{region.range[1]}</p>
      </header>

      <section className="panel">
        <h2>Starter Pokémon</h2>
        <div className="starter-links">
          {region.starters.map((s) => (
            <Link key={s} to={`/pokemon/${s}`} className="starter-link">
              {formatName(s)}
            </Link>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Legendary & Mythical</h2>
        <div className="starter-links">
          {region.legendaries.slice(0, 12).map((s) => (
            <Link key={s} to={`/pokemon/${s}`} className="starter-link">
              {formatName(s)}
            </Link>
          ))}
          {region.legendaries.length > 12 && (
            <span className="text-muted">+{region.legendaries.length - 12} more</span>
          )}
        </div>
      </section>

      {region.locations?.length > 0 && (
        <section className="panel">
          <h2>Notable Locations</h2>
          <ul className="location-list">
            {region.locations.map((loc) => (
              <li key={loc}>{loc}</li>
            ))}
          </ul>
        </section>
      )}

      {regionalForms.length > 0 && (
        <section className="section">
          <h2 className="section-title">Regional Forms</h2>
          <div className="pokemon-grid">
            {regionalForms.map((p) => (
              <PokemonCard key={p.name} pokemon={p} />
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <h2 className="section-title">Regional Pokédex</h2>
        {loading ? (
          <GridSkeleton />
        ) : (
          <div className="pokemon-grid">
            {regionalDex.map((p) => (
              <PokemonCard key={p.id} pokemon={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
