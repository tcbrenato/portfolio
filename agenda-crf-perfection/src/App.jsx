import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DonneesProvider } from './context/DonneesContext'
import { ToastProvider } from './context/ToastContext'
import { configurationOk } from './lib/supabase'
import { estGestionnaire } from './lib/droits'
import Disposition from './components/Disposition'
import { ChargementPleinEcran } from './components/Chargement'
import Connexion from './pages/Connexion'
import DefinirMotDePasse from './pages/DefinirMotDePasse'
import CompteInactif from './pages/CompteInactif'
import ConfigurationManquante from './pages/ConfigurationManquante'
import Accueil from './pages/Accueil'
import Taches from './pages/Taches'
import FicheTache from './pages/FicheTache'
import FormulaireTache from './pages/FormulaireTache'
import Calendrier from './pages/Calendrier'
import MonCompte from './pages/MonCompte'
import GestionMembres from './pages/GestionMembres'
import Import from './pages/Import'

function Routeur() {
  const { session, profil, chargement, erreurProfil, doitDefinirMotDePasse } = useAuth()

  if (chargement) return <ChargementPleinEcran />
  if (!session) return <Connexion />
  if (doitDefinirMotDePasse) return <DefinirMotDePasse />
  if (!profil) return erreurProfil ? <CompteInactif erreur={erreurProfil} /> : <ChargementPleinEcran />
  if (!profil.actif) return <CompteInactif />

  const gestionnaire = estGestionnaire(profil)
  return (
    <DonneesProvider>
      <Routes>
        <Route element={<Disposition />}>
          <Route index element={<Accueil />} />
          <Route path="taches" element={<Taches />} />
          <Route path="taches/nouvelle" element={<FormulaireTache />} />
          <Route path="taches/:id" element={<FicheTache />} />
          <Route path="taches/:id/modifier" element={<FormulaireTache />} />
          <Route path="calendrier" element={<Calendrier />} />
          <Route path="compte" element={<MonCompte />} />
          <Route path="compte/membres" element={gestionnaire ? <GestionMembres /> : <Navigate to="/compte" replace />} />
          <Route path="compte/import" element={gestionnaire ? <Import /> : <Navigate to="/compte" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </DonneesProvider>
  )
}

export default function App() {
  if (!configurationOk) return <ConfigurationManquante />
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routeur />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
