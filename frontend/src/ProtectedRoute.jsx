import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'

export default function ProtectedRoute({ vloge, children }) {
  const { user, nalaganje } = useAuth()

  if (nalaganje) return <p className="stran">Nalaganje...</p>
  if (!user) return <Navigate to="/prijava" replace />

  if (vloge && !vloge.includes(user.vloga)) {
    return (
      <div className="kartica">
        <h1>Ni dostopa</h1>
        <p className="napaka">Nimate pravic za ogled te strani.</p>
      </div>
    )
  }

  return children
}
