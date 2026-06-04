import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { usePokemonDetail } from '../hooks/usePokemonDetail'
import { useApp } from '../context/AppContext'
import TypeBadge from '../components/ui/TypeBadge'
import StatChart from '../components/pokemon/StatChart'
import EvolutionTree from '../components/pokemon/EvolutionTree'
import { DetailSkeleton } from '../components/ui/LoadingSkeleton'
import {
  formatName,
  getSpriteUrl,
  getCryUrl,
  getBaseStatTotal,
  getGenderRatio,
  getFlavorText,
  getEvYield,
  recommendNatures,
  getCompetitiveTier,
} from '../utils/pokemonHelpers'
import { getGenerationFromId } from '../constants/regions'
import { getDefensiveMatchups } from '../utils/typeEffectiveness'
import { isLegendary } from '../constants/classifications'

export default function PokemonDetail() {
  const { id } = useParams()
  const { data, loading, error } = usePokemonDetail(id)
  const { state, dispatch, unlockAchievement } = useApp()

  useEffect(() => {
    if (data?.pokemon) unlockAchievement('first_view')
  }, [data, unlockAchievement])

  if (loading) return <DetailSkeleton />
  if (error) return <div className="error-banner">{error}</div>
  if (!data?.pokemon) return <div className="error-banner">Pokémon not found</div>

  const { pokemon, species, evolutionChain } = data
  const types = pokemon.types.map((t) => t.type.name)
  const gen = getGenerationFromId(pokemon.id)
  const bst = getBaseStatTotal(pokemon.stats)
  const matchups = getDefensiveMatchups(types)
  const isFav = state.favorites.includes(pokemon.id)
  const sprite = getSpriteUrl(pokemon, state.shiny)
  const cry = getCryUrl(pokemon)

  return (
    <div className="detail-page">
      <Link to="/pokedex" className="back-link">← Back to Pokédex</Link>

      <header className="detail-header">
        <div>
          <span className="dex-number large">#{String(pokemon.id).padStart(4, '0')}</span>
          <h1>{formatName(pokemon.name)}</h1>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <TypeBadge key={t} type={t} size="lg" />
            ))}
          </div>
        </div>
        <div className="detail-actions">
          <button
            type="button"
            className={`btn-secondary ${isFav ? 'is-active' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_FAVORITE', payload: pokemon.id })}
          >
            {isFav ? '★ Favorited' : '☆ Favorite'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => dispatch({ type: 'ADD_COMPARE', payload: pokemon.id })}
          >
            + Compare
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => dispatch({ type: 'ADD_TO_TEAM', payload: pokemon.id })}
          >
            + Team
          </button>
        </div>
      </header>

      <div className="detail-grid">
        <div className="detail-art panel">
          <img src={sprite} alt={pokemon.name} className="detail-sprite" />
          {cry && (
            <button
              type="button"
              className="cry-btn"
              onClick={() => new Audio(cry).play().catch(() => {})}
            >
              🔊 Play Cry
            </button>
          )}
        </div>

        <div className="detail-info panel">
          <h2>Info</h2>
          <dl className="info-list">
            <dt>Generation</dt>
            <dd>{gen?.name || '—'}</dd>
            <dt>Region</dt>
            <dd>{gen?.region || '—'}</dd>
            <dt>Height</dt>
            <dd>{(pokemon.height / 10).toFixed(1)} m</dd>
            <dt>Weight</dt>
            <dd>{(pokemon.weight / 10).toFixed(1)} kg</dd>
            <dt>Gender</dt>
            <dd>{getGenderRatio(species)}</dd>
            <dt>Egg Groups</dt>
            <dd>{species?.egg_groups?.map((e) => formatName(e.name)).join(', ') || '—'}</dd>
            <dt>Capture Rate</dt>
            <dd>{species?.capture_rate ?? '—'}</dd>
            <dt>Habitat</dt>
            <dd>{species?.habitat ? formatName(species.habitat.name) : 'Unknown'}</dd>
            <dt>Base Stat Total</dt>
            <dd className="font-bold text-[var(--accent)]">{bst}</dd>
          </dl>

          <h3 className="mt-6">Abilities</h3>
          <ul className="ability-list">
            {pokemon.abilities.map((a) => (
              <li key={a.ability.name}>
                {formatName(a.ability.name)}
                {a.is_hidden && <span className="hidden-tag">Hidden</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="panel mt-8">
        <h2>Pokédex Entry</h2>
        <p className="flavor-text">{getFlavorText(species)}</p>
      </section>

      <section className="panel mt-8">
        <h2>Base Stats</h2>
        <StatChart stats={pokemon.stats} />
      </section>

      <section className="panel mt-8">
        <h2>Evolution</h2>
        <EvolutionTree evolutionChain={evolutionChain} currentName={pokemon.name} />
      </section>

      <section className="panel mt-8 competitive-section">
        <h2>Competitive</h2>
        <div className="comp-grid">
          <div>
            <h3>Tier</h3>
            <p>{getCompetitiveTier(bst, isLegendary(pokemon.name))}</p>
          </div>
          <div>
            <h3>EV Yield</h3>
            <p>{getEvYield(pokemon.stats)}</p>
          </div>
          <div>
            <h3>Nature picks</h3>
            <p>{recommendNatures(pokemon).join(', ')}</p>
          </div>
        </div>
        <h3 className="mt-4">Weak to</h3>
        <div className="type-row">
          {matchups.superEffective.map((t) => (
            <TypeBadge key={t} type={t} size="sm" />
          ))}
        </div>
        <h3 className="mt-4">Resists</h3>
        <div className="type-row">
          {matchups.notVeryEffective.map((t) => (
            <TypeBadge key={t} type={t} size="sm" />
          ))}
        </div>
        <h3 className="mt-4">Immune to</h3>
        <div className="type-row">
          {matchups.immune.length
            ? matchups.immune.map((t) => <TypeBadge key={t} type={t} size="sm" />)
            : <span className="text-muted">None</span>}
        </div>
      </section>
    </div>
  )
}
