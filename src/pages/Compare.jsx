import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { usePokemonList } from '../hooks/usePokemonList'
import { fetchPokemon } from '../api/pokeapi'
import TypeBadge from '../components/ui/TypeBadge'
import StatChart from '../components/pokemon/StatChart'
import { formatName, getSpriteUrl, getBaseStatTotal } from '../utils/pokemonHelpers'

export default function Compare() {
  const { state, dispatch } = useApp()
  const { pokemon } = usePokemonList()
  const [details, setDetails] = useState([])
  const [addId, setAddId] = useState('')

  useEffect(() => {
    Promise.all(
      state.compare.map((id) => fetchPokemon(id).catch(() => null))
    ).then(setDetails)
  }, [state.compare])

  const add = () => {
    const id = parseInt(addId, 10)
    if (id) dispatch({ type: 'ADD_COMPARE', payload: id })
    setAddId('')
  }

  return (
    <div className="compare-page">
      <header className="page-header">
        <h1>Pokémon Comparison</h1>
        <p>Compare up to 6 Pokémon side by side</p>
      </header>

      <div className="compare-toolbar panel">
        <select value={addId} onChange={(e) => setAddId(e.target.value)} className="filter-input">
          <option value="">Add Pokémon...</option>
          {pokemon.map((p) => (
            <option key={p.id} value={p.id}>#{p.id} {p.displayName}</option>
          ))}
        </select>
        <button type="button" className="btn-primary" onClick={add}>Add</button>
        <button type="button" className="btn-secondary" onClick={() => dispatch({ type: 'CLEAR_COMPARE' })}>
          Clear all
        </button>
      </div>

      {details.length === 0 ? (
        <p className="text-center text-muted py-12">Add Pokémon from detail pages or the dropdown above.</p>
      ) : (
        <div className="compare-scroll">
          <div className="compare-grid" style={{ gridTemplateColumns: `repeat(${details.length}, minmax(200px, 1fr))` }}>
            {details.map((p) => p && (
              <div key={p.id} className="panel compare-col">
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => dispatch({ type: 'REMOVE_COMPARE', payload: p.id })}
                >
                  ×
                </button>
                <img src={getSpriteUrl(p)} alt="" className="compare-img" />
                <h3>
                  <Link to={`/pokemon/${p.id}`}>{formatName(p.name)}</Link>
                </h3>
                <div className="flex gap-1 justify-center">
                  {p.types.map((t) => (
                    <TypeBadge key={t.type.name} type={t.type.name} size="sm" />
                  ))}
                </div>
                <p className="font-bold">BST {getBaseStatTotal(p.stats)}</p>
                <p>Speed: {p.stats.find((s) => s.stat.name === 'speed')?.base_stat}</p>
                <StatChart stats={p.stats} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
