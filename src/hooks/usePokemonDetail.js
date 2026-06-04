import { useState, useEffect } from 'react'
import { fetchPokemonFull } from '../api/pokeapi'

export function usePokemonDetail(nameOrId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!nameOrId) return
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchPokemonFull(nameOrId)
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [nameOrId])

  return { data, loading, error }
}
