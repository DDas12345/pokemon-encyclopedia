import { useState, useEffect, useCallback, useRef } from 'react'

export function useInfiniteScroll(items, pageSize = 24) {
  const [page, setPage] = useState(1)
  const [mode, setMode] = useState('pagination')
  const observerRef = useRef(null)
  const sentinelRef = useRef(null)

  useEffect(() => {
    setPage(1)
  }, [items])

  const visible = mode === 'infinite'
    ? items.slice(0, page * pageSize)
    : items.slice((page - 1) * pageSize, page * pageSize)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const hasMore = page * pageSize < items.length

  const loadMore = useCallback(() => {
    if (hasMore) setPage((p) => p + 1)
  }, [hasMore])

  useEffect(() => {
    if (mode !== 'infinite' || !sentinelRef.current) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) loadMore()
      },
      { rootMargin: '200px' }
    )
    obs.observe(sentinelRef.current)
    observerRef.current = obs
    return () => obs.disconnect()
  }, [mode, hasMore, loadMore, items.length])

  return {
    visible,
    page,
    setPage,
    totalPages,
    pageSize,
    mode,
    setMode,
    hasMore,
    loadMore,
    sentinelRef,
  }
}
