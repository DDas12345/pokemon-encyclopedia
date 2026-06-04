import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/pokedex', label: 'Pokédex' },
  { to: '/regions', label: 'Regions' },
  { to: '/mega', label: 'Mega' },
  { to: '/gigantamax', label: 'G-Max' },
  { to: '/forms', label: 'Forms' },
  { to: '/type-calc', label: 'Types' },
  { to: '/compare', label: 'Compare' },
  { to: '/team', label: 'Team' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/fun', label: 'Fun' },
]

export default function Navbar() {
  const { state, dispatch } = useApp()
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar sticky top-0 z-50">
      <div className="nav-inner">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          <span className="logo-ball" />
          <span>PokéDex</span>
        </Link>

        <nav className={`nav-links ${open ? 'is-open' : ''}`}>
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="icon-btn"
            title="Toggle shiny sprites"
            onClick={() => dispatch({ type: 'TOGGLE_SHINY' })}
          >
            {state.shiny ? '✨' : '◇'}
          </button>
          <button
            type="button"
            className="icon-btn"
            title="Toggle theme"
            onClick={() =>
              dispatch({
                type: 'SET_THEME',
                payload: state.theme === 'dark' ? 'light' : 'dark',
              })
            }
          >
            {state.theme === 'dark' ? '☀' : '☾'}
          </button>
          <button
            type="button"
            className="menu-btn md:hidden"
            aria-label="Menu"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  )
}
