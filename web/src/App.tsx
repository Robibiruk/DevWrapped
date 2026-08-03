import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Wrapped from './pages/Wrapped'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/wrapped/:username" element={<Wrapped />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
