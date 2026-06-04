import { Link } from 'react-router-dom'
import TypeBadge from '../ui/TypeBadge'
import { useApp } from '../../context/AppContext'

export default function PokemonCard({ pokemon }) {
  const { state, dispatch } = useApp()
  const isFav = state.favorites.includes(pokemon.id)
  const sprite = state.shiny && pokemon.shinySprite ? pokemon.shinySprite : pokemon.sprite

  return (
    <article className="pokemon-card group relative">
      <button
        type="button"
        className={`favorite-btn absolute right-2 top-2 z-10 ${isFav ? 'is-active' : ''}`}
        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        onClick={(e) => {
          e.preventDefault()
          dispatch({ type: 'TOGGLE_FAVORITE', payload: pokemon.id })
        }}
      >
        {isFav ? '★' : '☆'}
      </button>
      <Link to={`/pokemon/${pokemon.id}`} className="block">
        <span className="dex-number">#{String(pokemon.id).padStart(4, '0')}</span>
        <div className="card-image-wrap">
          <img
            src={sprite || '/favicon.svg'}
            alt={pokemon.displayName || pokemon.name}
            loading="lazy"
            className="card-sprite transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <h3 className="card-name">{pokemon.displayName || pokemon.name}</h3>
        <div className="mt-2 flex flex-wrap justify-center gap-1">
          {pokemon.types?.map((t) => (
            <TypeBadge key={t} type={t} size="sm" />
          ))}
        </div>
        {pokemon.legendary && <span className="badge-legend">Legendary</span>}
        {pokemon.mythical && <span className="badge-myth">Mythical</span>}
      </Link>
    </article>
  )
}
