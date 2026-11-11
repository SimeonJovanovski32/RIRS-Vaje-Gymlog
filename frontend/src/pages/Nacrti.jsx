import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

const STANJA = {
  osnutek: 'Osnutek',
  dodeljen: 'Dodeljen',
  aktiven: 'Aktiven',
  zakljucen: 'Zaključen',
}

export default function Nacrti() {
  const { user } = useAuth()
  const { state } = useLocation()
  const [nacrti, setNacrti] = useState([])
  const [clani, setClani] = useState([])
  const [izbrani, setIzbrani] = useState({})
  const [napake, setNapake] = useState({})
  const [nalaganje, setNalaganje] = useState(true)
  const [napaka, setNapaka] = useState('')
  const [sporocilo, setSporocilo] = useState('')

  const jeTrener = user?.vloga === 'trener'

  useEffect(() => {
    fetch('/api/nacrti')
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.napaka || 'Napaka pri nalaganju načrtov')
        setNacrti(data)
      })
      .catch((err) => setNapaka(err.message))
      .finally(() => setNalaganje(false))
  }, [])

  // člane za izbiro naložimo samo trenerju
  useEffect(() => {
    if (!jeTrener) return
    fetch('/api/clani')
      .then((res) => (res.ok ? res.json() : []))
      .then(setClani)
      .catch(() => setClani([]))
  }, [jeTrener])

  async function onIzbrisi(nacrt) {
    if (!window.confirm(`Izbrišem načrt »${nacrt.naziv}«? Tega ni mogoče razveljaviti.`)) {
      return
    }
    setNapaka('')
    setSporocilo('')
    try {
      const res = await fetch(`/api/nacrti/${nacrt._id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.napaka || 'Načrta ni mogoče izbrisati')
      setNacrti(nacrti.filter((n) => n._id !== nacrt._id))
      setSporocilo('Načrt je izbrisan.')
    } catch (err) {
      setNapaka(err.message)
    }
  }

  async function onDodeli(nacrt) {
    const clanId = izbrani[nacrt._id]
    setNapake({ ...napake, [nacrt._id]: '' })
    setSporocilo('')

    if (!clanId) {
      setNapake({ ...napake, [nacrt._id]: 'Izberite člana' })
      return
    }

    try {
      const res = await fetch(`/api/nacrti/${nacrt._id}/dodeli`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clanId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.napaka || 'Načrta ni mogoče dodeliti')

      const clan = clani.find((c) => c._id === clanId)
      setNacrti(
        nacrti.map((n) =>
          n._id === nacrt._id ? { ...n, stanje: 'dodeljen', clanId: clanId } : n
        )
      )
      setSporocilo(`Načrt je dodeljen članu ${clan ? clan.ime : ''}.`)
    } catch (err) {
      setNapake({ ...napake, [nacrt._id]: err.message })
    }
  }

  return (
    <div className="siroka">
      <div className="glava-strani">
        <h1 className="naslov-strani">{jeTrener ? 'Moji načrti' : 'Načrti'}</h1>
        {jeTrener && (
          <Link className="gumb gumb-povezava" to="/nacrti/nov">+ Nov načrt</Link>
        )}
      </div>

      {state?.shranjeno && !sporocilo && (
        <p className="uspeh">Načrt je shranjen kot osnutek.</p>
      )}
      {sporocilo && <p className="uspeh">{sporocilo}</p>}
      {napaka && <p className="napaka">{napaka}</p>}
      {nalaganje && <p className="podnozje">Nalaganje...</p>}

      {!nalaganje && !napaka && nacrti.length === 0 && (
        <p className="podnozje">
          {jeTrener ? 'Še nimate načrtov.' : 'Nimate dodeljenih načrtov.'}
        </p>
      )}

      {nacrti.map((n) => (
        <div className="nacrt" key={n._id}>
          <div className="nacrt-glava">
            <h2>{n.naziv}</h2>
            <div className="nacrt-akcije">
              <span className="oznaka">{STANJA[n.stanje] || n.stanje}</span>
              {jeTrener && n.stanje === 'osnutek' && (
                <button className="gumb-sek nevaren" onClick={() => onIzbrisi(n)}>
                  Izbriši
                </button>
              )}
            </div>
          </div>
          {n.dnevi.map((d, i) => (
            <p className="nacrt-dan" key={i}>
              <strong>{d.naziv || `Dan ${i + 1}`}:</strong>{' '}
              {d.postavke
                .map((p) =>
                  p.vajaId
                    ? `${p.vajaId.naziv} ${p.serije}×${p.ponovitve}`
                    : 'neznana vaja'
                )
                .join(', ')}
            </p>
          ))}

          {jeTrener && n.stanje === 'osnutek' && (
            <div className="dodeli">
              <select
                value={izbrani[n._id] || ''}
                onChange={(e) => setIzbrani({ ...izbrani, [n._id]: e.target.value })}
              >
                <option value="">Izberite člana</option>
                {clani.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.ime} ({c.email})
                  </option>
                ))}
              </select>
              <button className="gumb gumb-povezava" onClick={() => onDodeli(n)}>
                Dodeli
              </button>
            </div>
          )}
          {napake[n._id] && <p className="napaka">{napake[n._id]}</p>}
        </div>
      ))}
    </div>
  )
}
