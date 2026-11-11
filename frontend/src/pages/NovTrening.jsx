import { useEffect, useState } from 'react'

const SKUPINE = {
  prsa: 'Prsa',
  hrbet: 'Hrbet',
  noge: 'Noge',
  ramena: 'Ramena',
  roke: 'Roke',
  trebuh: 'Trebuh',
}

function danes() {
  const d = new Date()
  const mesec = String(d.getMonth() + 1).padStart(2, '0')
  const dan = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mesec}-${dan}`
}

const prazna = () => ({ teza: '', ponovitve: '' })
const prazenZapis = () => ({ vajaId: '', serije: [prazna()] })

// ID vaje je lahko niz ali že naložen objekt (populate)
const idVaje = (v) => (v && typeof v === 'object' ? v._id : v)

export default function NovTrening() {
  const [vaje, setVaje] = useState([])
  const [nacrti, setNacrti] = useState([])
  const [treningi, setTreningi] = useState([])
  const [datum, setDatum] = useState(danes())
  const [nacrtId, setNacrtId] = useState('')
  const [zapisi, setZapisi] = useState([prazenZapis()])
  const [napake, setNapake] = useState([])
  const [uspeh, setUspeh] = useState('')
  const [novirekordi, setNoviRekordi] = useState([])
  const [posilja, setPosilja] = useState(false)

  function naloziTreninge() {
    fetch('/api/treningi')
      .then((res) => (res.ok ? res.json() : { treningi: [] }))
      .then((data) => setTreningi(data.treningi || []))
      .catch(() => setTreningi([]))
  }

  useEffect(() => {
    fetch('/api/vaje')
      .then((res) => (res.ok ? res.json() : []))
      .then(setVaje)
      .catch(() => setNapake(['Vaj ni mogoče naložiti']))

    // samo aktivni načrti člana
    fetch('/api/nacrti')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setNacrti(data.filter((n) => n.stanje === 'aktiven')))
      .catch(() => setNacrti([]))

    naloziTreninge()
  }, [])

  function posodobiZapis(i, spremembe) {
    setZapisi(zapisi.map((z, k) => (k === i ? { ...z, ...spremembe } : z)))
  }

  function dodajZapis() {
    setZapisi([...zapisi, prazenZapis()])
  }

  function odstraniZapis(i) {
    setZapisi(zapisi.filter((_, k) => k !== i))
  }

  function dodajSerijo(i) {
    posodobiZapis(i, { serije: [...zapisi[i].serije, prazna()] })
  }

  function odstraniSerijo(i, j) {
    posodobiZapis(i, { serije: zapisi[i].serije.filter((_, k) => k !== j) })
  }

  function posodobiSerijo(i, j, spremembe) {
    posodobiZapis(i, {
      serije: zapisi[i].serije.map((s, k) => (k === j ? { ...s, ...spremembe } : s)),
    })
  }

  const imeVaje = (id) => vaje.find((v) => v._id === idVaje(id))?.naziv || 'neznana vaja'

  async function onSubmit(e) {
    e.preventDefault()
    setNapake([])
    setUspeh('')
    setNoviRekordi([])
    setPosilja(true)

    const telo = {
      datum,
      zapisi: zapisi.map((z) => ({
        vajaId: z.vajaId,
        serije: z.serije.map((s) => ({
          // prazno polje pošljemo kot neveljavno vrednost, da API vrne napako
          teza: s.teza === '' ? null : Number(s.teza),
          ponovitve: s.ponovitve === '' ? null : Number(s.ponovitve),
        })),
      })),
    }
    if (nacrtId) telo.nacrtId = nacrtId

    try {
      const res = await fetch('/api/treningi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telo),
      })
      const data = await res.json()
      if (res.status === 201) {
        setUspeh('Trening je shranjen.')
        setNoviRekordi(
          (data.rekordi || []).map((r) => ({ naziv: imeVaje(r.vajaId), teza: r.teza }))
        )
        setZapisi([prazenZapis()])
        setNacrtId('')
        setDatum(danes())
        naloziTreninge()
        return
      }
      setNapake(data.napake || [data.napaka || 'Treninga ni mogoče shraniti'])
    } catch {
      setNapake(['Strežnik ni dosegljiv'])
    } finally {
      setPosilja(false)
    }
  }

  return (
    <div className="siroka">
      <h1 className="naslov-strani">Nov trening</h1>

      {uspeh && (
        <div className="uspeh">
          <div>{uspeh}</div>
          {novirekordi.map((r, k) => (
            <div className="rekord-sporocilo" key={k}>
              Nov osebni rekord: {r.naziv} – {r.teza} kg
            </div>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        <div className="vrstica-polj">
          <div className="polje">
            <label htmlFor="datum">Datum</label>
            <input id="datum" type="date" value={datum} onChange={(e) => setDatum(e.target.value)} />
          </div>
          <div className="polje">
            <label htmlFor="nacrt">Načrt (neobvezno)</label>
            <select id="nacrt" className="izbira" value={nacrtId} onChange={(e) => setNacrtId(e.target.value)}>
              <option value="">Brez načrta</option>
              {nacrti.map((n) => (
                <option key={n._id} value={n._id}>
                  {n.naziv} (aktiven)
                </option>
              ))}
            </select>
          </div>
        </div>

        {zapisi.map((z, i) => (
          <div className="dan" key={i}>
            <div className="dan-glava">
              <select
                className="izbira"
                value={z.vajaId}
                onChange={(e) => posodobiZapis(i, { vajaId: e.target.value })}
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
              <button type="button" className="gumb-sek nevaren" onClick={() => odstraniZapis(i)}>
                Odstrani vajo
              </button>
            </div>

            {z.serije.map((s, j) => (
              <div className="vaja-vrstica" key={j}>
                <span className="st-serije">Serija {j + 1}</span>
                <label className="majhno">
                  Teža (kg)
                  <input
                    type="number"
                    step="0.5"
                    value={s.teza}
                    onChange={(e) => posodobiSerijo(i, j, { teza: e.target.value })}
                  />
                </label>
                <label className="majhno">
                  Ponovitve
                  <input
                    type="number"
                    value={s.ponovitve}
                    onChange={(e) => posodobiSerijo(i, j, { ponovitve: e.target.value })}
                  />
                </label>
                <button
                  type="button"
                  className="gumb-sek nevaren"
                  onClick={() => odstraniSerijo(i, j)}
                  aria-label="Odstrani serijo"
                >
                  ✕
                </button>
              </div>
            ))}

            <button type="button" className="gumb-sek" onClick={() => dodajSerijo(i)}>
              + Dodaj serijo
            </button>
          </div>
        ))}

        <button type="button" className="gumb-sek" onClick={dodajZapis}>
          + Dodaj vajo
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
            {posilja ? 'Shranjujem...' : 'Shrani trening'}
          </button>
        </div>
      </form>

      {treningi.length > 0 && (
        <div className="zadnji">
          <h2>Zadnji treningi</h2>
          {treningi.slice(0, 5).map((t) => {
            const rekordIdji = (t.rekordi || []).map((r) => String(idVaje(r.vajaId)))
            return (
              <div className="nacrt" key={t._id}>
                <div className="nacrt-glava">
                  <h2>{new Date(t.datum).toLocaleDateString('sl-SI')}</h2>
                  {t.nacrtId && <span className="oznaka">{t.nacrtId.naziv}</span>}
                </div>
                {t.zapisi.map((z, i) => (
                  <p className="nacrt-dan" key={i}>
                    <strong>{z.vajaId?.naziv || imeVaje(z.vajaId)}:</strong>{' '}
                    {z.serije.map((s) => `${s.teza} kg × ${s.ponovitve}`).join(', ')}
                    {rekordIdji.includes(String(idVaje(z.vajaId))) && (
                      <span className="rekord"> REKORD</span>
                    )}
                  </p>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
