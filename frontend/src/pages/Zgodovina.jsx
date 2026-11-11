import { useEffect, useState } from 'react'

// ID vaje je lahko niz ali že naložen objekt (populate)
const idVaje = (v) => (v && typeof v === 'object' ? v._id : v)

export default function Zgodovina() {
  const [stran, setStran] = useState(1)
  const [podatki, setPodatki] = useState({ treningi: [], strani: 1, skupaj: 0 })
  const [odprt, setOdprt] = useState(null)
  const [podrobnosti, setPodrobnosti] = useState(null)
  const [nalaganje, setNalaganje] = useState(true)
  const [napaka, setNapaka] = useState('')

  useEffect(() => {
    setNalaganje(true)
    setNapaka('')
    setOdprt(null)
    setPodrobnosti(null)

    fetch(`/api/treningi?stran=${stran}`)
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.napaka || 'Napaka pri nalaganju treningov')
        setPodatki(data)
      })
      .catch((err) => setNapaka(err.message))
      .finally(() => setNalaganje(false))
  }, [stran])

  async function onKlik(trening) {
    if (odprt === trening._id) {
      setOdprt(null)
      setPodrobnosti(null)
      return
    }
    setOdprt(trening._id)
    setPodrobnosti(null)
    try {
      const res = await fetch(`/api/treningi/${trening._id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.napaka || 'Treninga ni mogoče odpreti')
      setPodrobnosti(data)
    } catch (err) {
      setNapaka(err.message)
    }
  }

  const { treningi, strani, skupaj } = podatki

  return (
    <div className="siroka">
      <h1 className="naslov-strani">Zgodovina treningov</h1>

      {napaka && <p className="napaka">{napaka}</p>}
      {nalaganje && <p className="podnozje">Nalaganje...</p>}

      {!nalaganje && !napaka && skupaj === 0 && (
        <p className="podnozje">Še nimate treningov</p>
      )}

      {!nalaganje && treningi.length > 0 && (
        <div className="tabela">
          <div className="vrstica glava zgodovina-vrstica">
            <span>Datum</span>
            <span>Vaje</span>
            <span>Načrt</span>
            <span>Rekord</span>
          </div>
          {treningi.map((t) => (
            <div key={t._id}>
              <button className="vrstica klik zgodovina-vrstica" onClick={() => onKlik(t)}>
                <span className="ime">{new Date(t.datum).toLocaleDateString('sl-SI')}</span>
                <span>{t.zapisi.length}</span>
                <span>{t.nacrtId ? t.nacrtId.naziv : '–'}</span>
                <span>
                  {t.rekordi && t.rekordi.length > 0 && <span className="rekord">REKORD</span>}
                </span>
              </button>

              {odprt === t._id && (
                <div className="opis">
                  {!podrobnosti && <span>Nalaganje...</span>}
                  {podrobnosti &&
                    podrobnosti.zapisi.map((z, i) => {
                      const jeRekord = (podrobnosti.rekordi || []).some(
                        (r) => String(idVaje(r.vajaId)) === String(idVaje(z.vajaId))
                      )
                      return (
                        <p className="nacrt-dan" key={i}>
                          <strong>{z.vajaId?.naziv || 'neznana vaja'}:</strong>{' '}
                          {z.serije.map((s) => `${s.teza} kg × ${s.ponovitve}`).join(', ')}
                          {jeRekord && <span className="rekord"> REKORD</span>}
                        </p>
                      )
                    })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!nalaganje && strani > 1 && (
        <div className="strani">
          <button
            className="gumb-sek"
            disabled={stran <= 1}
            onClick={() => setStran(stran - 1)}
          >
            ← Prejšnja
          </button>
          <span>
            Stran {stran} od {strani}
          </span>
          <button
            className="gumb-sek"
            disabled={stran >= strani}
            onClick={() => setStran(stran + 1)}
          >
            Naslednja →
          </button>
        </div>
      )}
    </div>
  )
}
