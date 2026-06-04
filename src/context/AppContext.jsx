import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'

const STORAGE_KEYS = {
  favorites: 'pokedex_favorites',
  teams: 'pokedex_teams',
  theme: 'pokedex_theme',
  shiny: 'pokedex_shiny',
  achievements: 'pokedex_achievements',
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const initialState = {
  theme: loadJSON(STORAGE_KEYS.theme, 'dark'),
  shiny: loadJSON(STORAGE_KEYS.shiny, false),
  favorites: loadJSON(STORAGE_KEYS.favorites, []),
  compare: [],
  teams: loadJSON(STORAGE_KEYS.teams, []),
  achievements: loadJSON(STORAGE_KEYS.achievements, []),
  teamDraft: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'TOGGLE_SHINY':
      return { ...state, shiny: !state.shiny }
    case 'TOGGLE_FAVORITE': {
      const id = action.payload
      const exists = state.favorites.includes(id)
      const favorites = exists
        ? state.favorites.filter((f) => f !== id)
        : [...state.favorites, id]
      return { ...state, favorites }
    }
    case 'ADD_COMPARE': {
      if (state.compare.includes(action.payload) || state.compare.length >= 6) return state
      return { ...state, compare: [...state.compare, action.payload] }
    }
    case 'REMOVE_COMPARE':
      return { ...state, compare: state.compare.filter((c) => c !== action.payload) }
    case 'CLEAR_COMPARE':
      return { ...state, compare: [] }
    case 'SET_TEAM_DRAFT':
      return { ...state, teamDraft: action.payload }
    case 'ADD_TO_TEAM': {
      if (state.teamDraft.length >= 6) return state
      if (state.teamDraft.includes(action.payload)) return state
      return { ...state, teamDraft: [...state.teamDraft, action.payload] }
    }
    case 'REMOVE_FROM_TEAM':
      return { ...state, teamDraft: state.teamDraft.filter((t) => t !== action.payload) }
    case 'SAVE_TEAM': {
      const team = { id: Date.now(), name: action.name, members: [...state.teamDraft] }
      return { ...state, teams: [...state.teams, team], teamDraft: [] }
    }
    case 'DELETE_TEAM':
      return { ...state, teams: state.teams.filter((t) => t.id !== action.payload) }
    case 'UNLOCK_ACHIEVEMENT': {
      if (state.achievements.includes(action.payload)) return state
      return { ...state, achievements: [...state.achievements, action.payload] }
    }
    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(state.theme))
  }, [state.theme])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(state.favorites))
  }, [state.favorites])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.teams, JSON.stringify(state.teams))
  }, [state.teams])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.shiny, JSON.stringify(state.shiny))
  }, [state.shiny])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(state.achievements))
  }, [state.achievements])

  const unlockAchievement = useCallback((id) => {
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: id })
  }, [])

  const value = { state, dispatch, unlockAchievement }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
