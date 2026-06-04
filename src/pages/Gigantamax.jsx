import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GIGANTAMAX } from '../constants/megaGmaxForms'
import { fetchPokemon } from '../api/pokeapi'
import { formatName, getSpriteUrl } from '../utils/pokemonHelpers'

const GMAX_DESCRIPTIONS = {
  charizard: 'Its wings burn hotter and it breathes fire hot enough to melt boulders.',
  pikachu: 'Its body expands with electricity stored in its cheeks.',
  gengar: 'Its mouth becomes a portal; it is said to devour everything around it.',
  eevee: 'Becomes incredibly fluffy and cuddly-looking while growing in size.',
  lapras: 'Creates a dome of ice and water on its back for passengers.',
}

export default function Gigantamax() {
  const [selected, setSelected] = useState(GIGANTAMAX[3])
  const [base, setBase] = useState(null)
  const [gmax, setGmax] = useState(null)

  useEffect(() => {
    Promise.all([
      fetchPokemon(selected.base).catch(() => null),
      fetchPokemon(selected.gmax).catch(() => null),
    ]).then(([b, g]) => {
      setBase(b)
      setGmax(g)
    })
  }, [selected])

  const desc = GMAX_DESCRIPTIONS[selected.base] || 'A towering Dynamax form with unique G-Max power.'

  return (
    <div className="gmax-page">
      <header className="page-header">
        <h1>Gigantamax</h1>
        <p>G-Max forms and exclusive moves</p>
      </header>

      <div className="gmax-picker">
        {GIGANTAMAX.map((g) => (
          <button
            key={g.gmax}
            type="button"
            className={`gmax-chip ${selected.gmax === g.gmax ? 'active' : ''}`}
            onClick={() => setSelected(g)}
          >
            {formatName(g.base)}
          </button>
        ))}
      </div>

      <div className="compare-columns">
        <div className="panel compare-col">
          <h3>Standard</h3>
          {base && <img src={getSpriteUrl(base)} alt="" className="compare-img" />}
          <Link to={`/pokemon/${selected.base}`}>View {formatName(selected.base)}</Link>
        </div>
        <div className="panel compare-col gmax-highlight">
          <h3>Gigantamax</h3>
          {gmax && <img src={getSpriteUrl(gmax)} alt="" className="compare-img gmax-img" />}
          <p className="gmax-move"><strong>G-Max Move:</strong> {selected.move}</p>
          <p>{desc}</p>
          <Link to={`/pokemon/${selected.gmax}`}>View form</Link>
        </div>
      </div>
    </div>
  )
}
