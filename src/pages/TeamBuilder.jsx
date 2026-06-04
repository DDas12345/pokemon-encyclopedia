import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { usePokemonList } from '../hooks/usePokemonList'
import { fetchPokemon } from '../api/pokeapi'
import TypeBadge from '../components/ui/TypeBadge'
import { formatName } from '../utils/pokemonHelpers'
import { TYPE_CHART } from '../constants/types'

function analyzeTeam(members) {
  const weaknesses = {}
  const resistances = {}
  for (const types of members) {
    for (const atk of Object.keys(TYPE_CHART)) {
      let mult = 1
      for (const def of types) {
        mult *= TYPE_CHART[atk]?.[def] ?? 1
      }
      if (mult >= 2) weaknesses[atk] = (weaknesses[atk] || 0) + 1
      if (mult > 0 && mult <= 0.5) resistances[atk] = (resistances[atk] || 0) + 1
      if (mult === 0) resistances[atk] = (resistances[atk] || 0) + 2
    }
  }
  const weakSorted = Object.entries(weaknesses).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const resistSorted = Object.entries(resistances).sort((a, b) => b[1] - a[1]).slice(0, 6)
  return { weaknesses: weakSorted, strengths: resistSorted }
}

export default function TeamBuilder() {
  const { state, dispatch } = useApp()
  const { pokemon } = usePokemonList()
  const [memberData, setMemberData] = useState([])
  const [teamName, setTeamName] = useState('My Team')

  useEffect(() => {
    Promise.all(
      state.teamDraft.map((id) => fetchPokemon(id).catch(() => null))
    ).then(setMemberData)
  }, [state.teamDraft])

  const analysis = useMemo(
    () => analyzeTeam(memberData.filter(Boolean).map((p) => p.types.map((t) => t.type.name))),
    [memberData]
  )

  const saveTeam = () => {
    if (state.teamDraft.length === 0) return
    dispatch({ type: 'SAVE_TEAM', name: teamName })
  }

  return (
    <div className="team-page">
      <header className="page-header">
        <h1>Team Builder</h1>
        <p>Build a party of 6 and analyze type coverage</p>
      </header>

      <div className="team-layout">
        <section className="panel">
          <h2>Current team ({state.teamDraft.length}/6)</h2>
          <div className="team-slots">
            {state.teamDraft.map((id) => {
              const p = pokemon.find((x) => x.id === id)
              return (
                <div key={id} className="team-slot">
                  {p && <img src={p.sprite} alt="" />}
                  <span>{p?.displayName || id}</span>
                  <button type="button" onClick={() => dispatch({ type: 'REMOVE_FROM_TEAM', payload: id })}>×</button>
                </div>
              )
            })}
            {Array.from({ length: 6 - state.teamDraft.length }).map((_, i) => (
              <div key={`empty-${i}`} className="team-slot empty">Empty</div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="filter-input flex-1"
              placeholder="Team name"
            />
            <button type="button" className="btn-primary" onClick={saveTeam} disabled={!state.teamDraft.length}>
              Save team
            </button>
          </div>
        </section>

        <section className="panel">
          <h2>Team analysis</h2>
          <h3>Shared weaknesses</h3>
          <div className="type-row">
            {analysis.weaknesses.map(([t, count]) => (
              <span key={t} className="team-type-stat">
                <TypeBadge type={t} size="sm" /> ×{count}
              </span>
            ))}
          </div>
          <h3 className="mt-4">Shared resistances</h3>
          <div className="type-row">
            {analysis.strengths.map(([t, count]) => (
              <span key={t} className="team-type-stat">
                <TypeBadge type={t} size="sm" /> ×{count}
              </span>
            ))}
          </div>
        </section>
      </div>

      {state.teams.length > 0 && (
        <section className="panel mt-8">
          <h2>Saved teams</h2>
          {state.teams.map((team) => (
            <div key={team.id} className="saved-team">
              <strong>{team.name}</strong>
              <span>{team.members.length} Pokémon</span>
              <button type="button" onClick={() => dispatch({ type: 'DELETE_TEAM', payload: team.id })}>Delete</button>
            </div>
          ))}
        </section>
      )}

      <p className="mt-4 text-muted">
        Add Pokémon from their detail page with &quot;+ Team&quot;, or browse the{' '}
        <Link to="/pokedex">Pokédex</Link>.
      </p>
    </div>
  )
}
