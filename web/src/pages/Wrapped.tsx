import { Navigate, useParams } from 'react-router-dom'
import Deck from '../components/Deck'
import { useStory } from '../hooks/useWrapped'

export default function Wrapped() {
  const params = useParams<{ username: string }>()
  const username = params.username ?? ''
  const story = useStory(username)

  if (!username) return <Navigate to="/" replace />
  return <Deck story={story} username={username} />
}
