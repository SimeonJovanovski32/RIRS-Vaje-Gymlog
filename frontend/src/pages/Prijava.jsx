import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

export default function Prijava() {
  const { user, prijava } = useAuth()
  const { state } = useLocation()
  const [email, setEmail] = useState('')
  const [geslo, setGeslo] = useState('')
  const [napaka, setNapaka] = useState('')
  const [posilja, setPosilja] = useState(false)

  if (user) return <Navigate to="/" replace />

  async function onSubmit(e) {
    e.preventDefault()
    setNapaka('')
    setPosilja(true)
    try {
      await prijava(email, geslo)
    } catch (err) {
      setNapaka(err.message)
      setPosilja(false)
    }
  }

  return (
    <div className="kartica">
      <h1>Prijava</h1>
      {state?.registriran && (
        <p className="uspeh">Registracija je uspela. Prijavite se.</p>
      )}
      <form onSubmit={onSubmit} noValidate>
        <div className="polje">
          <label htmlFor="email">E-poštni naslov</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="polje">
          <label htmlFor="geslo">Geslo</label>
          <input id="geslo" type="password" value={geslo} onChange={(e) => setGeslo(e.target.value)} />
        </div>
        {napaka && <p className="napaka" role="alert">{napaka}</p>}
        <button className="gumb" type="submit" disabled={posilja}>
          {posilja ? 'Prijavljam...' : 'Prijava'}
        </button>
      </form>
      <p className="podnozje">
        Nimate računa? <Link to="/registracija">Registracija</Link>
      </p>
    </div>
  )
}
