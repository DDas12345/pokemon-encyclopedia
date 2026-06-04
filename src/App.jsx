import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Pokedex from './pages/Pokedex'
import PokemonDetail from './pages/PokemonDetail'
import Regions from './pages/Regions'
import RegionDetail from './pages/RegionDetail'
import MegaEvolution from './pages/MegaEvolution'
import Gigantamax from './pages/Gigantamax'
import Forms from './pages/Forms'
import TypeCalculator from './pages/TypeCalculator'
import Compare from './pages/Compare'
import TeamBuilder from './pages/TeamBuilder'
import Favorites from './pages/Favorites'
import Fun from './pages/Fun'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="pokedex" element={<Pokedex />} />
            <Route path="pokemon/:id" element={<PokemonDetail />} />
            <Route path="regions" element={<Regions />} />
            <Route path="regions/:regionId" element={<RegionDetail />} />
            <Route path="mega" element={<MegaEvolution />} />
            <Route path="gigantamax" element={<Gigantamax />} />
            <Route path="forms" element={<Forms />} />
            <Route path="type-calc" element={<TypeCalculator />} />
            <Route path="compare" element={<Compare />} />
            <Route path="team" element={<TeamBuilder />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="fun" element={<Fun />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
