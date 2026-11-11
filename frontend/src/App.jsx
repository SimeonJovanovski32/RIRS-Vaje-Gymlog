import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import Registracija from './pages/Registracija.jsx'
import Prijava from './pages/Prijava.jsx'
import KnjiznicaVaj from './pages/KnjiznicaVaj.jsx'
import Nacrti from './pages/Nacrti.jsx'
import NacrtForm from './pages/NacrtForm.jsx'
import NovTrening from './pages/NovTrening.jsx'

const MENIJI = {
  clan: [
    ['/vaje', 'Vaje'],
    ['/nacrti', 'Moji načrti'],
    ['/nov-trening', 'Nov trening'],
    ['/zgodovina', 'Zgodovina'],
    ['/napredek', 'Napredek'],
  ],
  trener: [
    ['/nacrti', 'Moji načrti'],
    ['/clani', 'Člani'],
    ['/treningi-clanov', 'Treningi članov'],
  ],
  admin: [
    ['/uporabniki', 'Uporabniki'],
    ['/vaje', 'Vaje'],
  ],
}

const OZNAKE = { clan: 'član', trener: 'trener', admin: 'skrbnik' }

// [pot, dovoljene vloge, naslov]; prave strani pridejo v naslednjih issuih
const STRANI = [
  ['/zgodovina', ['clan'], 'Zgodovina treningov'],
  ['/napredek', ['clan'], 'Napredek po vaji'],
  ['/clani', ['trener'], 'Člani'],
  ['/treningi-clanov', ['trener'], 'Treningi članov'],
  ['/uporabniki', ['admin'], 'Upravljanje uporabnikov'],
]

function razred({ isActive }) {
  return isActive ? 'aktiven' : ''
}

function Vrh() {
  const { user, odjava } = useAuth()
  const navigate = useNavigate()

  const povezave = user
    ? MENIJI[user.vloga] || []
    : [
        ['/registracija', 'Registracija'],
        ['/prijava', 'Prijava'],
      ]

  async function onOdjava() {
    await odjava()
    navigate('/prijava')
  }

  return (
    <header className="vrh">
      <span className="logo">GymLog</span>
      <nav>
        <NavLink to="/" end className={razred}>Domov</NavLink>
        {povezave.map(([pot, ime]) => (
          <NavLink key={pot} to={pot} className={razred}>{ime}</NavLink>
        ))}
      </nav>
      {user && (
        <div className="uporabnik">
          <span>{user.ime} ({OZNAKE[user.vloga]})</span>
          <button className="gumb gumb-mali" onClick={onOdjava}>Odjava</button>
        </div>
      )}
    </header>
  )
}

function Domov() {
  const { user } = useAuth()
  return (
    <div className="kartica">
      <h1>GymLog</h1>
      <p className="podnozje">
        {user
          ? `Pozdravljeni, ${user.ime}. Prijavljeni ste kot ${OZNAKE[user.vloga]}.`
          : 'Prijavite se ali ustvarite račun.'}
      </p>
    </div>
  )
}

function Placeholder({ naslov }) {
  return (
    <div className="kartica">
      <h1>{naslov}</h1>
      <p className="podnozje">Ta stran še ni na voljo.</p>
    </div>
  )
}

export default function App() {
  return (
    <div>
      <Vrh />
      <main className="stran">
        <Routes>
          <Route path="/" element={<Domov />} />
          <Route path="/registracija" element={<Registracija />} />
          <Route path="/prijava" element={<Prijava />} />
          <Route
            path="/vaje"
            element={
              <ProtectedRoute vloge={['clan', 'admin']}>
                <KnjiznicaVaj />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nacrti"
            element={
              <ProtectedRoute vloge={['clan', 'trener']}>
                <Nacrti />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nacrti/nov"
            element={
              <ProtectedRoute vloge={['trener']}>
                <NacrtForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nov-trening"
            element={
              <ProtectedRoute vloge={['clan']}>
                <NovTrening />
              </ProtectedRoute>
            }
          />
          {STRANI.map(([pot, vloge, naslov]) => (
            <Route
              key={pot}
              path={pot}
              element={
                <ProtectedRoute vloge={vloge}>
                  <Placeholder naslov={naslov} />
                </ProtectedRoute>
              }
            />
          ))}
        </Routes>
      </main>
    </div>
  )
}
