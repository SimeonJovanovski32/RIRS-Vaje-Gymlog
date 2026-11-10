import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Registracija() {
  const navigate = useNavigate()
  const [vrednosti, setVrednosti] = useState({ ime: '', email: '', geslo: '' })
  const [polja, setPolja] = useState({})
  const [napaka, setNapaka] = useState('')
  const [posilja, setPosilja] = useState(false)

  function onChange(e) {
    setVrednosti({ ...vrednosti, [e.target.name]: e.target.value })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setPolja({})
    setNapaka('')
    setPosilja(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vrednosti),
      })
      const data = await res.json()
      if (res.status === 201) {
        navigate('/prijava', { state: { registriran: true } })
        return
      }
      if (data.polja) setPolja(data.polja)
      setNapaka(data.napaka || 'Registracija ni uspela')
    } catch {
      setNapaka('Strežnik ni dosegljiv')
    } finally {
      setPosilja(false)
    }
  }

  return (
    <div className="kartica">
      <h1>Registracija</h1>
      <form onSubmit={onSubmit} noValidate>
        <div className="polje">
          <label htmlFor="ime">Ime</label>
          <input id="ime" name="ime" value={vrednosti.ime} onChange={onChange} />
          {polja.ime && <p className="napaka-polje" role="alert">{polja.ime}</p>}
        </div>
        <div className="polje">
          <label htmlFor="email">E-poštni naslov</label>
          <input id="email" name="email" type="email" value={vrednosti.email} onChange={onChange} />
          {polja.email && <p className="napaka-polje" role="alert">{polja.email}</p>}
        </div>
        <div className="polje">
          <label htmlFor="geslo">Geslo (vsaj 8 znakov)</label>
          <input id="geslo" name="geslo" type="password" value={vrednosti.geslo} onChange={onChange} />
          {polja.geslo && <p className="napaka-polje" role="alert">{polja.geslo}</p>}
        </div>
        {napaka && <p className="napaka" role="alert">{napaka}</p>}
        <button className="gumb" type="submit" disabled={posilja}>
          {posilja ? 'Pošiljam...' : 'Ustvari račun'}
        </button>
      </form>
      <p className="podnozje">
        Že imate račun? <Link to="/prijava">Prijava</Link>
      </p>
    </div>
  )
}
