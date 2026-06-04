import { Link } from 'react-router-dom'
import { REGIONS } from '../constants/regions'

export default function Regions() {
  return (
    <div className="regions-page">
      <header className="page-header">
        <h1>Region Explorer</h1>
        <p>Journey through all nine Pokémon regions</p>
      </header>
      <div className="region-grid large">
        {REGIONS.map((r) => (
          <Link
            key={r.id}
            to={`/regions/${r.id}`}
            className="region-card"
            style={{ '--region-color': r.color }}
          >
            <span className="region-gen">Generation {r.generation}</span>
            <h2>{r.name}</h2>
            <p>National Dex #{r.range[0]}–{r.range[1]}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
