import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SKUPINE = {
  prsa: 'Prsa',
  hrbet: 'Hrbet',
  noge: 'Noge',
  ramena: 'Ramena',
  roke: 'Roke',
  trebuh: 'Trebuh',
}

const prazna = () => ({ vajaId: '', serije: '3', ponovitve: '10' })
const prazenDan = () => ({ naziv: '', postavke: [prazna()] })

export default function NacrtForm() {
  const navigate = useNavigate()
  const [vaje, setVaje] = useState([])
  const [naziv, setNaziv] = useState('')
  const [dnevi, setDnevi] = useState([prazenDan()])
  const [napake, setNapake] = useState([])
  const [posilja, setPosilja] = useState(false)

  useEffect(() => {
    fetch('/api/vaje')
      .then((res) => (res.ok ? res.json() : []))
      .then(setVaje)
      .catch(() => setNapake(['Vaj ni mogoče naložiti']))
  }, [])

  function posodobiDan(i, spremembe) {
    setDnevi(dnevi.map((d, k) => (k === i ? { ...d, ...spremembe } : d)))
  }

  function dodajDan() {
    setDnevi([...dnevi, prazenDan()])
  }

  function odstraniDan(i) {
    setDnevi(dnevi.filter((_, k) => k !== i))
  }

  function dodajVajo(i) {
    posodobiDan(i, { postavke: [...dnevi[i].postavke, prazna()] })
  }

  function odstraniVajo(i, j) {
    posodobiDan(i, { postavke: dnevi[i].postavke.filter((_, k) => k !== j) })
  }

  function posodobiVajo(i, j, spremembe) {
    posodobiDan(i, {
      postavke: dnevi[i].postavke.map((p, k) => (k === j ? { ...p, ...spremembe } : p)),
    })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setNapake([])
    setPosilja(true)

    const telo = {
      naziv,
      dnevi: dnevi.map((d) => ({
        naziv: d.naziv,
        postavke: d.postavke.map((p) => ({
          vajaId: p.vajaId,
          serije: Number(p.serije),
          ponovitve: Number(p.ponovitve),
        })),
      })),
    }

    try {
      const res = await fetch('/api/nacrti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telo),
      })
      const data = await res.json()
      if (res.status === 201) {
        navigate('/nacrti', { state: { shranjeno: true } })
        return
      }
      setNapake(data.napake || [data.napaka || 'Načrta ni mogoče shraniti'])
    } catch {
      setNapake(['Strežnik ni dosegljiv'])
    } finally {
      setPosilja(false)
    }
  }

  return (
    <div className="siroka">
      <h1 className="naslov-strani">Nov načrt vadbe</h1>

      <form onSubmit={onSubmit} noValidate>
        <div className="polje">
          <label htmlFor="naziv">Naziv načrta</label>
          <input id="naziv" value={naziv} onChange={(e) => setNaziv(e.target.value)} />
        </div>

        {dnevi.map((dan, i) => (
          <div className="dan" key={i}>
            <div className="dan-glava">
              <strong>Dan {i + 1}</strong>
              <input
                className="dan-naziv"
                placeholder="Naziv dneva (npr. Prsa in triceps)"
                value={dan.naziv}
                onChange={(e) => posodobiDan(i, { naziv: e.target.value })}
              />
              <button type="button" className="gumb-sek nevaren" onClick={() => odstraniDan(i)}>
                Odstrani dan
              </button>
            </div>

            {dan.postavke.map((p, j) => (
              <div className="vaja-vrstica" key={j}>
                <select
                  value={p.vajaId}
                  onChange={(e) => posodobiVajo(i, j, { vajaId: e.target.value })}
                >
                  <option value="">Izberite vajo</option>
                  {Object.entries(SKUPINE).map(([skupina, ime]) => (
                    <optgroup key={skupina} label={ime}>
                      {vaje
                        .filter((v) => v.misicnaSkupina === skupina)
                        .map((v) => (
                          <option key={v._id} value={v._id}>
                            {v.naziv}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
                <label className="majhno">
                  Serije
                  <input
                    type="number"
                    value={p.serije}
                    onChange={(e) => posodobiVajo(i, j, { serije: e.target.value })}
                  />
                </label>
                <label className="majhno">
                  Ponovitve
                  <input
                    type="number"
                    value={p.ponovitve}
                    onChange={(e) => posodobiVajo(i, j, { ponovitve: e.target.value })}
                  />
                </label>
                <button
                  type="button"
                  className="gumb-sek nevaren"
                  onClick={() => odstraniVajo(i, j)}
                  aria-label="Odstrani vajo"
                >
                  ✕
                </button>
              </div>
            ))}

            <button type="button" className="gumb-sek" onClick={() => dodajVajo(i)}>
              + Dodaj vajo
            </button>
          </div>
        ))}

        <button type="button" className="gumb-sek" onClick={dodajDan}>
          + Dodaj dan
        </button>

        {napake.length > 0 && (
          <div className="napaka" role="alert">
            {napake.map((n, k) => (
              <div key={k}>{n}</div>
            ))}
          </div>
        )}

        <div className="akcije">
          <button className="gumb gumb-povezava" type="submit" disabled={posilja}>
            {posilja ? 'Shranjujem...' : 'Shrani osnutek'}
          </button>
          <Link className="gumb-sek" to="/nacrti">Prekliči</Link>
        </div>
      </form>
    </div>
  )
}
