import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="app-shell min-h-screen">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>
          Data from{' '}
          <a href="https://pokeapi.co" target="_blank" rel="noreferrer">
            PokéAPI
          </a>
          . Not affiliated with Nintendo or The Pokémon Company.
        </p>
      </footer>
    </div>
  )
}
