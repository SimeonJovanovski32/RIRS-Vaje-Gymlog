import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'

function Domov() {
  const [stanje, setStanje] = useState('preverjam...')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStanje(data.status))
      .catch(() => setStanje('backend ni dosegljiv'))
  }, [])

  return (
    <div>
      <h1>GymLog</h1>
      <p>Stanje API-ja: {stanje}</p>
    </div>
  )
}

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">Domov</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Domov />} />
      </Routes>
    </div>
  )
}
