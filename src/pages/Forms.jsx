import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FORM_FAMILIES } from '../constants/megaGmaxForms'
import { fetchPokemon } from '../api/pokeapi'
import TypeBadge from '../components/ui/TypeBadge'
import { formatName, getSpriteUrl, getBaseStatTotal } from '../utils/pokemonHelpers'

export default function Forms() {
  const [family, setFamily] = useState(FORM_FAMILIES[0])
  const [forms, setForms] = useState([])
  const [compare, setCompare] = useState([0, 1])

  useEffect(() => {
    Promise.all(family.forms.map((f) => fetchPokemon(f).catch(() => null))).then(setForms)
  }, [family])

  const a = forms[compare[0]]
  const b = forms[compare[1]]

  return (
    <div className="forms-page">
      <header className="page-header">
        <h1>Alternate Forms</h1>
        <p>Rotom, Deoxys, Necrozma, and more</p>
      </header>

      <div className="forms-tabs">
        {FORM_FAMILIES.map((f) => (
          <button
            key={f.name}
            type="button"
            className={family.name === f.name ? 'active' : ''}
            onClick={() => {
              setFamily(f)
              setCompare([0, 1])
            }}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="forms-grid">
        {forms.map((p, i) => (
          p && (
            <Link key={p.name} to={`/pokemon/${p.id}`} className="form-card panel">
              <img src={getSpriteUrl(p)} alt="" />
              <h3>{formatName(p.name)}</h3>
              <div className="flex gap-1 justify-center">
                {p.types.map((t) => (
                  <TypeBadge key={t.type.name} type={t.type.name} size="sm" />
                ))}
              </div>
              <p>BST {getBaseStatTotal(p.stats)}</p>
            </Link>
          )
        ))}
      </div>

      {a && b && (
        <section className="panel mt-8">
          <h2>Compare forms</h2>
          <div className="flex gap-4 mb-4">
            <select value={compare[0]} onChange={(e) => setCompare([+e.target.value, compare[1]])}>
              {forms.map((p, i) => p && <option key={i} value={i}>{formatName(p.name)}</option>)}
            </select>
            <select value={compare[1]} onChange={(e) => setCompare([compare[0], +e.target.value])}>
              {forms.map((p, i) => p && <option key={i} value={i}>{formatName(p.name)}</option>)}
            </select>
          </div>
          <div className="compare-columns">
            <div>
              <h3>{formatName(a.name)}</h3>
              <p>Types: {a.types.map((t) => t.type.name).join(', ')}</p>
              <p>BST: {getBaseStatTotal(a.stats)}</p>
            </div>
            <div>
              <h3>{formatName(b.name)}</h3>
              <p>Types: {b.types.map((t) => t.type.name).join(', ')}</p>
              <p>BST: {getBaseStatTotal(b.stats)}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
