import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { usePokemonList } from '../hooks/usePokemonList'
import PokemonCard from '../components/pokemon/PokemonCard'

export default function Favorites() {
  const { state } = useApp()
  const { pokemon, loading } = usePokemonList()

  const favorites = useMemo(
    () => pokemon.filter((p) => state.favorites.includes(p.id)),
    [pokemon, state.favorites]
  )

  return (
    <div className="favorites-page">
      <header className="page-header">
        <h1>Favorites</h1>
        <p>{favorites.length} Pokémon saved locally</p>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : favorites.length === 0 ? (
        <div className="empty-state panel">
          <p>No favorites yet. Star Pokémon in the Pokédex!</p>
          <Link to="/pokedex" className="btn-primary mt-4 inline-block">Browse Pokédex</Link>
        </div>
      ) : (
        <div className="pokemon-grid">
          {favorites.map((p) => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
        </div>
      )}
    </div>
  )
}
