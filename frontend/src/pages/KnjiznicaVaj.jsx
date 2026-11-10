import { useEffect, useState } from 'react'

const SKUPINE = [
  ['', 'Vse'],
  ['prsa', 'Prsa'],
  ['hrbet', 'Hrbet'],
  ['noge', 'Noge'],
  ['ramena', 'Ramena'],
  ['roke', 'Roke'],
  ['trebuh', 'Trebuh'],
]

export default function KnjiznicaVaj() {
  const [skupina, setSkupina] = useState('')
  const [vaje, setVaje] = useState([])
  const [odprta, setOdprta] = useState(null)
  const [nalaganje, setNalaganje] = useState(true)
  const [napaka, setNapaka] = useState('')

  useEffect(() => {
    setNalaganje(true)
    setNapaka('')
    setOdprta(null)

    const url = skupina
      ? `/api/vaje?misicnaSkupina=${encodeURIComponent(skupina)}`
      : '/api/vaje'

    fetch(url)
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.napaka || 'Napaka pri nalaganju vaj')
        setVaje(data)
      })
      .catch((err) => setNapaka(err.message))
      .finally(() => setNalaganje(false))
  }, [skupina])

  return (
    <div className="siroka">
      <h1 className="naslov-strani">Knjižnica vaj</h1>

      <div className="filtri">
        {SKUPINE.map(([vrednost, ime]) => (
          <button
            key={vrednost}
            className={`filter ${skupina === vrednost ? 'aktiven' : ''}`}
            onClick={() => setSkupina(vrednost)}
          >
            {ime}
          </button>
        ))}
      </div>

      {napaka && <p className="napaka">{napaka}</p>}
      {nalaganje && <p className="podnozje">Nalaganje...</p>}

      {!nalaganje && !napaka && vaje.length === 0 && (
        <p className="podnozje">Ni vaj v tej skupini</p>
      )}

      {!nalaganje && vaje.length > 0 && (
        <div className="tabela">
          <div className="vrstica glava">
            <span>Naziv</span>
            <span>Mišična skupina</span>
            <span>Oprema</span>
          </div>
          {vaje.map((vaja) => (
            <div key={vaja._id}>
              <button
                className="vrstica klik"
                onClick={() => setOdprta(odprta === vaja._id ? null : vaja._id)}
              >
                <span className="ime">{vaja.naziv}</span>
                <span><span className="oznaka">{vaja.misicnaSkupina}</span></span>
                <span>{vaja.oprema}</span>
              </button>
              {odprta === vaja._id && (
                <div className="opis">{vaja.opis || 'Opis ni na voljo.'}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
