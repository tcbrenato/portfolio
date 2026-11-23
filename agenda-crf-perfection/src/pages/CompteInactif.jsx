import { useAuth } from '../context/AuthContext'
import { messageErreur } from '../lib/api'

export default function CompteInactif({ erreur }) {
  const { deconnexion, rechargerProfil } = useAuth()
  return (
    <div className="page-connexion">
      <div className="page-connexion__haut">
        <img className="page-connexion__logo" src="/logo-entete.png" alt="CRF Perfection" />
        <h1>Agenda CRF Perfection</h1>
      </div>
      <div className="page-connexion__form">
        <div className="carte carte--padding pile">
          {erreur ? (
            <>
              <h2 style={{ fontSize: '1.125rem' }}>Chargement impossible</h2>
              <p className="message-erreur">{messageErreur(erreur)}</p>
              <button className="btn btn--primaire btn--bloc" onClick={rechargerProfil}>Réessayer</button>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: '1.125rem' }}>Compte désactivé</h2>
              <p className="texte-doux">Votre accès à l'agenda a été désactivé. Contactez la Direction Générale.</p>
            </>
          )}
          <button className="btn btn--secondaire btn--bloc" onClick={deconnexion}>Se déconnecter</button>
        </div>
      </div>
    </div>
  )
}
