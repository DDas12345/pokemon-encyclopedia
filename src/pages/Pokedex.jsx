import { useState, useMemo } from 'react'
import { usePokemonList } from '../hooks/usePokemonList'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { filterPokemonList, getDefaultFilters } from '../utils/filterPokemon'
import FilterPanel from '../components/filters/FilterPanel'
import PokemonCard from '../components/pokemon/PokemonCard'
import { GridSkeleton } from '../components/ui/LoadingSkeleton'

export default function Pokedex() {
  const { pokemon, loading, error } = usePokemonList()
  const [filters, setFilters] = useState(getDefaultFilters)

  const filtered = useMemo(
    () => filterPokemonList(pokemon, filters),
    [pokemon, filters]
  )

  const {
    visible,
    page,
    setPage,
    totalPages,
    mode,
    setMode,
    sentinelRef,
  } = useInfiniteScroll(filtered, 24)

  return (
    <div className="pokedex-page">
      <header className="page-header">
        <h1>Pokédex</h1>
        <p>
          {loading ? 'Loading...' : `${filtered.length} Pokémon`}
        </p>
      </header>

      {loading && (
        <div className="panel mb-4 text-center">
          <p className="font-semibold">Loading Pokédex data from PokéAPI…</p>
          <p className="text-muted text-sm mt-1">
            First visit may take 1–2 minutes. Data is cached locally afterward.
          </p>
        </div>
      )}

      {error && (
        <div className="error-banner">
          {error}. Check your connection and refresh.
        </div>
      )}

      <div className="pokedex-layout">
        <FilterPanel filters={filters} setFilters={setFilters} />

        <div className="pokedex-main">
          <div className="view-controls">
            <button
              type="button"
              className={mode === 'pagination' ? 'active' : ''}
              onClick={() => setMode('pagination')}
            >
              Pages
            </button>
            <button
              type="button"
              className={mode === 'infinite' ? 'active' : ''}
              onClick={() => setMode('infinite')}
            >
              Infinite scroll
            </button>
          </div>

          {loading ? (
            <GridSkeleton count={12} />
          ) : (
            <>
              <div className="pokemon-grid">
                {visible.map((p) => (
                  <PokemonCard key={`${p.id}-${p.name}`} pokemon={p} />
                ))}
              </div>

              {mode === 'infinite' && (
                <div ref={sentinelRef} className="h-8" aria-hidden />
              )}

              {mode === 'pagination' && totalPages > 1 && (
                <div className="pagination">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    ← Prev
                  </button>
                  <span>
                    Page {page} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
