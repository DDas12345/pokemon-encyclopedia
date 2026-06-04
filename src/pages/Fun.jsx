import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { usePokemonList } from '../hooks/usePokemonList'
import { useApp } from '../context/AppContext'

const ACHIEVEMENTS = [
  { id: 'first_view', name: 'Researcher', desc: 'View your first Pokémon' },
  { id: 'favorite_5', name: 'Collector', desc: 'Favorite 5 Pokémon' },
  { id: 'team_save', name: 'Trainer', desc: 'Save a team' },
  { id: 'quiz_win', name: 'Professor', desc: 'Win the quiz' },
]

function dailyId() {
  const start = new Date('2020-01-01')
  const today = new Date()
  const days = Math.floor((today - start) / (86400000))
  return (days % 1025) + 1
}

export default function Fun() {
  const { pokemon, loading } = usePokemonList()
  const { state, unlockAchievement } = useApp()
  const [tab, setTab] = useState('daily')
  const [quizAnswer, setQuizAnswer] = useState(null)
  const [guess, setGuess] = useState('')
  const [guessResult, setGuessResult] = useState(null)
  const [score, setScore] = useState(0)

  const daily = useMemo(() => pokemon.find((p) => p.id === dailyId()), [pokemon])
  const random = useMemo(() => {
    if (!pokemon.length) return null
    return pokemon[Math.floor(Math.random() * Math.min(1025, pokemon.length))]
  }, [pokemon, tab])

  const quizOptions = useMemo(() => {
    if (!pokemon.length) return { correct: null, options: [] }
    const correct = pokemon[Math.floor(Math.random() * pokemon.length)]
    const others = pokemon
      .filter((p) => p.id !== correct.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    const options = [...others, correct].sort(() => Math.random() - 0.5)
    return { correct, options }
  }, [pokemon, tab, score])

  const guessMon = useMemo(() => {
    if (!pokemon.length) return null
    return pokemon[Math.floor(Math.random() * Math.min(151, pokemon.length))]
  }, [pokemon, tab])

  useEffect(() => {
    if (state.favorites.length >= 5) unlockAchievement('favorite_5')
  }, [state.favorites, unlockAchievement])

  useEffect(() => {
    if (state.teams.length) unlockAchievement('team_save')
  }, [state.teams, unlockAchievement])

  const tabs = [
    { id: 'daily', label: 'Daily' },
    { id: 'random', label: 'Random' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'guess', label: 'Guess' },
    { id: 'news', label: 'News' },
    { id: 'achievements', label: 'Achievements' },
  ]

  return (
    <div className="fun-page">
      <header className="page-header">
        <h1>Pokémon Fun Zone</h1>
        <p>Daily picks, quizzes, and more</p>
      </header>

      <div className="fun-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? 'active' : ''}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="panel fun-content">
        {loading && <p>Loading...</p>}

        {tab === 'daily' && daily && (
          <div className="daily-feature text-center">
            <h2>Pokémon of the Day</h2>
            <img src={daily.sprite} alt="" className="mx-auto h-48" />
            <h3>{daily.displayName}</h3>
            <p>#{daily.id}</p>
            <Link to={`/pokemon/${daily.id}`} className="btn-primary mt-4 inline-block">View profile</Link>
          </div>
        )}

        {tab === 'random' && random && (
          <div className="text-center">
            <h2>Random Pokémon</h2>
            <img src={random.sprite} alt="" className="mx-auto h-48" />
            <h3>{random.displayName}</h3>
            <button type="button" className="btn-primary mt-4" onClick={() => setTab('random')}>
              Roll again
            </button>
            <Link to={`/pokemon/${random.id}`} className="btn-secondary mt-2 ml-2 inline-block">Details</Link>
          </div>
        )}

        {tab === 'quiz' && quizOptions.correct && (
          <div>
            <h2>Who&apos;s that Pokémon?</h2>
            <p className="score">Score: {score}</p>
            <img
              src={quizOptions.correct.sprite}
              alt="?"
              className="mx-auto h-40 blur-sm"
              style={{ filter: quizAnswer ? 'none' : 'blur(12px)' }}
            />
            <div className="quiz-options">
              {quizOptions.options.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  disabled={quizAnswer !== null}
                  className={
                    quizAnswer === p.id
                      ? p.id === quizOptions.correct.id
                        ? 'correct'
                        : 'wrong'
                      : ''
                  }
                  onClick={() => {
                    setQuizAnswer(p.id)
                    if (p.id === quizOptions.correct.id) {
                      setScore((s) => s + 1)
                      unlockAchievement('quiz_win')
                    }
                    setTimeout(() => {
                      setQuizAnswer(null)
                      setScore((s) => s)
                    }, 1500)
                  }}
                >
                  {p.displayName}
                </button>
              ))}
            </div>
            <button type="button" className="btn-secondary mt-4" onClick={() => setScore(0)}>
              Reset score
            </button>
          </div>
        )}

        {tab === 'guess' && guessMon && (
          <div>
            <h2>Guess the Pokémon</h2>
            <img
              src={guessMon.sprite}
              alt="silhouette"
              className="mx-auto h-40"
              style={{ filter: 'brightness(0)', opacity: guessResult ? 1 : 0.9 }}
            />
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter name..."
              className="filter-input mt-4 max-w-xs mx-auto block"
            />
            <button
              type="button"
              className="btn-primary mt-2"
              onClick={() => {
                const ok = guess.toLowerCase().replace(/\s/g, '-') === guessMon.name
                setGuessResult(ok ? 'correct' : 'wrong')
              }}
            >
              Submit
            </button>
            {guessResult && (
              <p className={guessResult === 'correct' ? 'text-green-500' : 'text-red-500'}>
                {guessResult === 'correct' ? 'Correct!' : `It was ${guessMon.displayName}`}
              </p>
            )}
          </div>
        )}

        {tab === 'news' && (
          <div className="news-list">
            <h2>Pokémon News</h2>
            <article className="news-item">
              <time>Jun 2026</time>
              <h3>Paldea DLC & Terastal raids continue worldwide</h3>
              <p>Trainers are still exploring Area Zero and hunting shiny Terapagos.</p>
            </article>
            <article className="news-item">
              <time>May 2026</time>
              <h3>PokéAPI updates Gen IX sprites</h3>
              <p>This encyclopedia pulls live data for the latest artwork and stats.</p>
            </article>
            <article className="news-item">
              <time>Apr 2026</time>
              <h3>Classic Kanto starters remain fan favorites</h3>
              <p>Charizard, Blastoise, and Venusaur top favorite lists in our app.</p>
            </article>
          </div>
        )}

        {tab === 'achievements' && (
          <div>
            <h2>Achievements</h2>
            <ul className="achievement-list">
              {ACHIEVEMENTS.map((a) => (
                <li key={a.id} className={state.achievements.includes(a.id) ? 'unlocked' : ''}>
                  <span className="achievement-icon">{state.achievements.includes(a.id) ? '🏆' : '🔒'}</span>
                  <div>
                    <strong>{a.name}</strong>
                    <p>{a.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
