import { useNavigate } from 'react-router-dom'
import CarteTache from './CarteTache'
import TableauTaches from './TableauTaches'
import MenuStatut from './MenuStatut'
import { useAuth } from '../context/AuthContext'
import { useDonnees } from '../context/DonneesContext'
import { useChangementStatut } from '../hooks/useChangementStatut'
import { useEstOrdinateur } from '../hooks/useMediaQuery'

/** Liste de tâches : cartes sur mobile, tableau sur ordinateur (si `tableau`). */
export default function ListeTaches({ taches, tableau = false, vide = 'Aucune tâche.' }) {
  const { profil } = useAuth()
  const { profilsParId, jour } = useDonnees()
  const naviguer = useNavigate()
  const ordinateur = useEstOrdinateur()
  const { appliquer, tacheMenu, ouvrirMenu, fermerMenu } = useChangementStatut()

  const ouvrir = (t) => naviguer(`/taches/${t.id}`)
  // la tâche du menu est relue depuis la liste (statut à jour)
  const tacheMenuAJour = tacheMenu && (taches.find((t) => t.id === tacheMenu.id) || tacheMenu)

  if (!taches.length) return <p className="vide">{vide}</p>

  return (
    <>
      {tableau && ordinateur ? (
        <TableauTaches taches={taches} profilsParId={profilsParId} jour={jour} profil={profil} onOuvrir={ouvrir} onMenu={ouvrirMenu} />
      ) : (
        <div className="liste-cartes">
          {taches.map((t) => (
            <CarteTache
              key={t.id}
              tache={t}
              profilsParId={profilsParId}
              jour={jour}
              profil={profil}
              onOuvrir={ouvrir}
              onStatut={appliquer}
              onMenu={ouvrirMenu}
            />
          ))}
        </div>
      )}
      <MenuStatut tache={tacheMenuAJour} onChoisir={appliquer} onFermer={fermerMenu} />
    </>
  )
}
