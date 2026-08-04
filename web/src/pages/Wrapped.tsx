import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Deck from '../components/Deck'
import { useStory } from '../hooks/useWrapped'
import { useDeck } from '../store/deck'

export default function Wrapped() {
  const params = useParams<{ username: string }>()
  const username = params.username ?? ''
  const story = useStory(username)
  const reset = useDeck((s) => s.reset)

  // Always begin at the opening slide — for a fresh username or a repeat visit.
  useEffect(() => {
    reset()
  }, [reset, username])

  if (!username) return <Navigate to="/" replace />
  return <Deck story={story} username={username} />
}
