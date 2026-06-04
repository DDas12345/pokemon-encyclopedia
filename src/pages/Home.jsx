import { Link } from 'react-router-dom'
import { REGIONS } from '../constants/regions'

const FEATURES = [
  { to: '/pokedex', icon: '📖', title: 'Full Pokédex', desc: '1,025 Pokémon from Gen I–IX' },
  { to: '/regions', icon: '🗺', title: 'Region Explorer', desc: 'Kanto through Paldea' },
  { to: '/mega', icon: '💎', title: 'Mega Evolution', desc: 'Side-by-side comparisons' },
  { to: '/gigantamax', icon: '☁', title: 'Gigantamax', desc: 'G-Max forms & moves' },
  { to: '/type-calc', icon: '⚔', title: 'Type Calculator', desc: 'Matchups & type chart' },
  { to: '/team', icon: '👥', title: 'Team Builder', desc: 'Analyze strengths & weaknesses' },
]

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-glow" />
        <h1 className="hero-title">
          Pokémon <span className="text-gradient">Encyclopedia</span>
        </h1>
        <p className="hero-subtitle">
          Your comprehensive Pokédex covering every region from Kanto to Paldea.
          Search, compare, build teams, and explore evolutions.
        </p>
        <div className="hero-actions">
          <Link to="/pokedex" className="btn-primary">
            Open Pokédex
          </Link>
          <Link to="/fun" className="btn-secondary">
            Daily Pokémon
          </Link>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Explore</h2>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <Link key={f.to} to={f.to} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Regions</h2>
        <div className="region-grid">
          {REGIONS.map((r) => (
            <Link
              key={r.id}
              to={`/regions/${r.id}`}
              className="region-card"
              style={{ '--region-color': r.color }}
            >
              <span className="region-gen">Gen {r.generation}</span>
              <h3>{r.name}</h3>
              <p>#{r.range[0]} – #{r.range[1]}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
