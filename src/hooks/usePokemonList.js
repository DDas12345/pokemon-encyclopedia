import { useState, useEffect } from 'react'
import { fetchPokemonList } from '../api/pokeapi'

export function usePokemonList() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchPokemonList()
      .then((list) => {
        if (!cancelled) {
          setData(list.filter((p) => p.id && p.id <= 1025))
          setError(null)
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return { pokemon: data, loading, error, refetch: () => fetchPokemonList().then(setData) }
}
