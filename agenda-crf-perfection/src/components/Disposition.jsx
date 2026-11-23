import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import AjoutRapide from './AjoutRapide'
import { IconeAccueil, IconeCalendrier, IconeCompte, IconePlus, IconeTaches } from './Icones'
import { useAuth } from '../context/AuthContext'
import { useDonnees } from '../context/DonneesContext'
import { estEchue } from '../lib/statuts'
import { initiales } from '../lib/texte'
import { ROLES } from '../lib/statuts'

const LIENS = [
  { vers: '/', libelle: 'Accueil', Icone: IconeAccueil, fin: true },
  { vers: '/taches', libelle: 'Tâches', Icone: IconeTaches },
  { vers: '/calendrier', libelle: 'Calendrier', Icone: IconeCalendrier },
  { vers: '/compte', libelle: 'Mon compte', Icone: IconeCompte }
]

export default function Disposition() {
  const { profil } = useAuth()
  const { taches, jour } = useDonnees()
  const [ajoutOuvert, setAjoutOuvert] = useState(false)
  const { pathname } = useLocation()

  const nbEchues = taches.filter((t) => estEchue(t, jour)).length
  const masquerFab = /\/(nouvelle|modifier)$/.test(pathname) || pathname.startsWith('/compte')

  return (
    <div className="app">
      <header className="entete">
        <div className="entete__barre">
          <img className="entete__logo" src="/logo-entete.png" alt="CRF Perfection" width="36" height="36" />
          <div className="entete__titre">
            Agenda
            <small>CRF Perfection</small>
          </div>
          <nav className="entete__nav" aria-label="Navigation principale">
            {LIENS.map(({ vers, libelle, Icone, fin }) => (
              <NavLink key={vers} to={vers} end={fin}>
                <Icone /> {libelle}
              </NavLink>
            ))}
          </nav>
          <div className="entete__droite">
            <NavLink to="/compte" className="avatar" title={`${profil?.nom_complet} — ${ROLES[profil?.role] || ''}`} aria-label="Mon compte" style={{ textDecoration: 'none' }}>
              {initiales(profil?.nom_complet)}
            </NavLink>
          </div>
        </div>
      </header>

      <main className="contenu">
        <Outlet />
      </main>

      {!masquerFab && (
        <button type="button" className="fab" onClick={() => setAjoutOuvert(true)} aria-label="Ajouter une tâche">
          <IconePlus />
        </button>
      )}

      <nav className="nav-basse" aria-label="Navigation">
        {LIENS.map(({ vers, libelle, Icone, fin }) => (
          <NavLink key={vers} to={vers} end={fin}>
            <Icone />
            {libelle}
            {vers === '/taches' && nbEchues > 0 && (
              <span className="pastille-nombre" aria-label={`${nbEchues} échues`}>{nbEchues > 99 ? '99+' : nbEchues}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <AjoutRapide ouvert={ajoutOuvert} onFermer={() => setAjoutOuvert(false)} />
    </div>
  )
}
