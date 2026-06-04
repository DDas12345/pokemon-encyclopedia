import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MEGA_EVOLUTIONS } from '../constants/megaGmaxForms'
import { fetchPokemon } from '../api/pokeapi'
import TypeBadge from '../components/ui/TypeBadge'
import StatChart from '../components/pokemon/StatChart'
import { formatName, getSpriteUrl, getBaseStatTotal } from '../utils/pokemonHelpers'
import { GridSkeleton } from '../components/ui/LoadingSkeleton'

export default function MegaEvolution() {
  const [selected, setSelected] = useState(MEGA_EVOLUTIONS[1])
  const [baseData, setBaseData] = useState(null)
  const [megaData, setMegaData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([
      fetchPokemon(selected.base).catch(() => null),
      fetchPokemon(selected.mega).catch(() => null),
    ]).then(([base, mega]) => {
      if (!cancelled) {
        setBaseData(base)
        setMegaData(mega)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [selected])

  const uniqueBases = [...new Map(MEGA_EVOLUTIONS.map((m) => [m.base, m])).values()]

  return (
    <div className="mega-page">
      <header className="page-header">
        <h1>Mega Evolution</h1>
        <p>Compare normal and Mega forms side by side</p>
      </header>

      <div className="mega-layout">
        <aside className="mega-list panel">
          {uniqueBases.map((m) => (
            <button
              key={`${m.base}-${m.mega}`}
              type="button"
              className={selected.mega === m.mega ? 'active' : ''}
              onClick={() => setSelected(m)}
            >
              {formatName(m.mega)}
            </button>
          ))}
        </aside>

        <div className="mega-compare">
          {loading ? (
            <GridSkeleton count={2} />
          ) : (
            <>
              <p className="stone-label">Mega Stone: <strong>{selected.stone}</strong></p>
              <div className="compare-columns">
                <div className="panel compare-col">
                  <h3>Normal — {formatName(selected.base)}</h3>
                  {baseData && (
                    <>
                      <img src={getSpriteUrl(baseData)} alt="" className="compare-img" />
                      <div className="flex gap-1">
                        {baseData.types.map((t) => (
                          <TypeBadge key={t.type.name} type={t.type.name} />
                        ))}
                      </div>
                      <p>BST: {getBaseStatTotal(baseData.stats)}</p>
                      <StatChart stats={baseData.stats} />
                    </>
                  )}
                  <Link to={`/pokemon/${selected.base}`} className="link-btn">View details</Link>
                </div>
                <div className="panel compare-col mega-highlight">
                  <h3>Mega — {formatName(selected.mega)}</h3>
                  {megaData && (
                    <>
                      <img src={getSpriteUrl(megaData)} alt="" className="compare-img" />
                      <div className="flex gap-1">
                        {(selected.types || megaData.types.map((t) => t.type.name)).map((t) => (
                          <TypeBadge key={t} type={t} />
                        ))}
                      </div>
                      <p>BST: {getBaseStatTotal(megaData.stats)}</p>
                      <StatChart stats={megaData.stats} compareStats={baseData?.stats} />
                    </>
                  )}
                  <Link to={`/pokemon/${selected.mega}`} className="link-btn">View details</Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
