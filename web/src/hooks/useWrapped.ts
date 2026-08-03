import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchWrapped } from '../lib/api'
import { mockWrapped } from '../lib/mock'
import { analyze } from '../lib/analysis'
import { computePersonality } from '../lib/personality'
import { useDeck } from '../store/deck'
import type { WrappedPayload } from '../types'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === '1'

export function useWrapped(username: string) {
  return useQuery<WrappedPayload>({
    queryKey: ['wrapped', username],
    queryFn: ({ signal }) => (USE_MOCK ? Promise.resolve(mockWrapped(username)) : fetchWrapped(username, signal)),
    enabled: !!username,
    staleTime: Infinity,
  })
}

export function useStory(username: string) {
  const query = useWrapped(username)
  const tone = useDeck((s) => s.tone)

  const analysis = useMemo(() => (query.data ? analyze(query.data) : null), [query.data])
  const personality = useMemo(
    () => (analysis ? computePersonality(analysis, tone) : null),
    [analysis, tone],
  )

  return { ...query, analysis, personality }
}
