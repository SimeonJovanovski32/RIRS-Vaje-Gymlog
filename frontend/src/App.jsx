import { useEffect, useState } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import Registracija from './pages/Registracija.jsx'

function povezava({ isActive }) {
  return isActive ? 'aktiven' : ''
}

function Domov() {
  const [stanje, setStanje] = useState('preverjam...')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStanje(data.status))
      .catch(() => setStanje('backend ni dosegljiv'))
  }, [])

  return (
    <div className="kartica">
      <h1>GymLog</h1>
      <p className="podnozje">Stanje API-ja: {stanje}</p>
    </div>
  )
}

function Prijava() {
  const { state } = useLocation()
  return (
    <div className="kartica">
      <h1>Prijava</h1>
      {state?.registriran && <p className="uspeh">Registracija je uspela. Prijavite se.</p>}
      <p className="podnozje">Prijavni obrazec bo dodan v US-02.</p>
    </div>
  )
}

export default function App() {
  return (
    <div>
      <header className="vrh">
        <span className="logo">GymLog</span>
        <nav>
          <NavLink to="/" end className={povezava}>Domov</NavLink>
          <NavLink to="/registracija" className={povezava}>Registracija</NavLink>
          <NavLink to="/prijava" className={povezava}>Prijava</NavLink>
        </nav>
      </header>
      <main className="stran">
        <Routes>
          <Route path="/" element={<Domov />} />
          <Route path="/registracija" element={<Registracija />} />
          <Route path="/prijava" element={<Prijava />} />
        </Routes>
      </main>
    </div>
  )
}
