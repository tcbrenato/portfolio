import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { messageErreur } from '../lib/api'

/** Après une invitation ou un « mot de passe oublié » : choix du mot de passe. */
export default function DefinirMotDePasse() {
  const { utilisateur, motDePasseDefini, deconnexion } = useAuth()
  const [mdp, setMdp] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)

  const valider = async (e) => {
    e.preventDefault()
    setErreur('')
    if (mdp.length < 8) return setErreur('Le mot de passe doit contenir au moins 8 caractères.')
    if (mdp !== confirmation) return setErreur('Les deux mots de passe ne sont pas identiques.')
    setEnvoi(true)
    const { error } = await supabase.auth.updateUser({ password: mdp })
    setEnvoi(false)
    if (error) return setErreur(messageErreur(error))
    window.history.replaceState(null, '', '/')
    motDePasseDefini()
  }

  return (
    <div className="page-connexion">
      <div className="page-connexion__haut">
        <img className="page-connexion__logo" src="/logo-entete.png" alt="CRF Perfection" />
        <h1>Bienvenue</h1>
        <p>{utilisateur?.email}</p>
      </div>
      <form className="page-connexion__form" onSubmit={valider} noValidate>
        <div className="carte carte--padding pile">
          <p className="texte-doux">Choisissez votre mot de passe pour accéder à l'agenda.</p>
          <div className="champ">
            <label htmlFor="nouveau-mdp">Nouveau mot de passe</label>
            <input id="nouveau-mdp" className="saisie" type="password" autoComplete="new-password" value={mdp} onChange={(e) => setMdp(e.target.value)} />
            <span className="aide">8 caractères minimum.</span>
          </div>
          <div className="champ">
            <label htmlFor="confirmation-mdp">Confirmer le mot de passe</label>
            <input id="confirmation-mdp" className="saisie" type="password" autoComplete="new-password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
          </div>
          {erreur && <p className="message-erreur" role="alert">{erreur}</p>}
          <button className="btn btn--primaire btn--bloc" type="submit" disabled={envoi}>
            {envoi ? 'Enregistrement…' : 'Enregistrer et continuer'}
          </button>
          <button type="button" className="btn btn--fantome btn--bloc" onClick={deconnexion}>Annuler</button>
        </div>
      </form>
    </div>
  )
}
