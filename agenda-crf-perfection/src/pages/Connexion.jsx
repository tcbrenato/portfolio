import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { messageErreur } from '../lib/api'
import { supabase, erreurLienInitial } from '../lib/supabase'
import { IconeOeil, IconeOeilBarre } from '../components/Icones'

export default function Connexion() {
  const { connexion } = useAuth()
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [voir, setVoir] = useState(false)
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState(
    erreurLienInitial ? 'Le lien utilisé a expiré ou a déjà servi. Demandez un nouveau lien.' : ''
  )
  const [info, setInfo] = useState('')

  const seConnecter = async (e) => {
    e.preventDefault()
    setErreur('')
    setInfo('')
    if (!email || !motDePasse) return setErreur('Saisissez votre email et votre mot de passe.')
    setEnvoi(true)
    try {
      await connexion(email, motDePasse)
    } catch (err) {
      setErreur(messageErreur(err))
      setEnvoi(false)
    }
  }

  const motDePasseOublie = async () => {
    setErreur('')
    setInfo('')
    if (!email) return setErreur("Saisissez d'abord votre adresse email ci-dessus.")
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin })
    if (error) setErreur(messageErreur(error))
    else setInfo('Si un compte existe pour cette adresse, un email de réinitialisation vient d\'être envoyé.')
  }

  return (
    <div className="page-connexion">
      <div className="page-connexion__haut">
        <img className="page-connexion__logo" src="/logo-entete.png" alt="CRF Perfection" />
        <h1>Agenda CRF Perfection</h1>
        <p>Suivi des tâches de l'équipe</p>
      </div>

      <form className="page-connexion__form" onSubmit={seConnecter} noValidate>
        <div className="carte carte--padding pile">
          <div className="champ">
            <label htmlFor="email">Adresse email</label>
            <input
              id="email"
              className="saisie"
              type="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="prenom.nom@exemple.com"
            />
          </div>
          <div className="champ">
            <label htmlFor="mdp">Mot de passe</label>
            <div className="champ-mdp">
              <input
                id="mdp"
                className="saisie"
                type={voir ? 'text' : 'password'}
                autoComplete="current-password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
              />
              <button type="button" className="btn-icone" onClick={() => setVoir(!voir)} aria-label={voir ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
                {voir ? <IconeOeilBarre /> : <IconeOeil />}
              </button>
            </div>
          </div>

          {erreur && <p className="message-erreur" role="alert">{erreur}</p>}
          {info && <p className="message-info" role="status">{info}</p>}

          <button className="btn btn--primaire btn--bloc" type="submit" disabled={envoi}>
            {envoi ? 'Connexion…' : 'Se connecter'}
          </button>
          <button type="button" className="btn btn--fantome btn--bloc" onClick={motDePasseOublie}>
            Mot de passe oublié ?
          </button>
        </div>
        <p className="texte-doux texte-tres-petit" style={{ textAlign: 'center', marginTop: 16 }}>
          Accès réservé au personnel de CRF Perfection.<br />Les comptes sont créés sur invitation de la Direction.
        </p>
      </form>
      <footer className="page-connexion__pied">© {new Date().getFullYear()} CRF Perfection</footer>
    </div>
  )
}
