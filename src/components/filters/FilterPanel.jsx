import { TYPES } from '../../constants/types'
import { GENERATIONS } from '../../constants/regions'
import { formatName } from '../../utils/pokemonHelpers'

export default function FilterPanel({ filters, setFilters }) {
  const toggleArray = (key, value) => {
    const arr = filters[key]
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
    setFilters({ ...filters, [key]: next })
  }

  const triState = (key, value) => {
    setFilters({ ...filters, [key]: filters[key] === value ? null : value })
  }

  return (
    <aside className="filter-panel">
      <h2 className="filter-title">Filters</h2>

      <label className="filter-group">
        <span>Search</span>
        <input
          type="search"
          placeholder="Name or #..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="filter-input"
        />
      </label>

      <div className="filter-group">
        <span>Type</span>
        <div className="chip-grid">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              className={`chip ${filters.types.includes(t) ? 'active' : ''}`}
              onClick={() => toggleArray('types', t)}
            >
              {formatName(t)}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span>Generation</span>
        <div className="chip-grid">
          {GENERATIONS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`chip ${filters.generations.includes(g.id) ? 'active' : ''}`}
              onClick={() => toggleArray('generations', g.id)}
            >
              Gen {g.id}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span>Region</span>
        <div className="chip-grid">
          {GENERATIONS.map((g) => (
            <button
              key={g.region}
              type="button"
              className={`chip ${filters.regions.includes(g.region) ? 'active' : ''}`}
              onClick={() => toggleArray('regions', g.region)}
            >
              {g.region}
            </button>
          ))}
        </div>
      </div>

      <label className="filter-group">
        <span>Ability</span>
        <input
          type="text"
          placeholder="e.g. levitate"
          value={filters.abilitySearch || ''}
          onChange={(e) => {
            const v = e.target.value.trim().toLowerCase()
            setFilters({
              ...filters,
              abilitySearch: e.target.value,
              abilities: v ? [v] : [],
            })
          }}
          className="filter-input"
        />
      </label>

      <div className="filter-group">
        <span>Classification</span>
        <div className="flex flex-wrap gap-2">
          {[
            ['legendary', 'Legendary'],
            ['mythical', 'Mythical'],
            ['pseudo', 'Pseudo-Legendary'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`chip ${filters[key] === true ? 'active' : ''}`}
              onClick={() => triState(key, true)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="btn-secondary w-full"
        onClick={() =>
          setFilters({
            search: '',
            types: [],
            generations: [],
            abilities: [],
            regions: [],
            legendary: null,
            mythical: null,
            pseudo: null,
            abilitySearch: '',
          })
        }
      >
        Clear all
      </button>
    </aside>
  )
}
