import { useState } from 'react'
import { Link } from 'react-router-dom'
import FeuilleBas from '../components/FeuilleBas'
import { IconeGroupe, IconeImporter, IconeCle, IconeSortie, IconeSuivant, IconeInstaller, IconeHorloge } from '../components/Icones'
import { useAuth } from '../context/AuthContext'
import { useDonnees } from '../context/DonneesContext'
import { useToast } from '../context/ToastContext'
import { useInstallation } from '../hooks/useInstallation'
import { messageErreur, modifierProfil } from '../lib/api'
import { supabase } from '../lib/supabase'
import { estGestionnaire } from '../lib/droits'
import { ROLES } from '../lib/statuts'
import { initiales } from '../lib/texte'
import { notificationsActives } from '../lib/notifications'

export default function MonCompte() {
  const { profil, setProfil, utilisateur, deconnexion } = useAuth()
  const { majProfil } = useDonnees()
  const toast = useToast()
  const installation = useInstallation()
  const [f, setF] = useState({ nom_complet: profil.nom_complet, poste: profil.poste || '', telephone: profil.telephone || '' })
  const [envoi, setEnvoi] = useState(false)
  const [mdpOuvert, setMdpOuvert] = useState(false)
  const [aideIOS, setAideIOS] = useState(false)
  const [mdp, setMdp] = useState({ nouveau: '', confirmation: '', erreur: '' })

  const modifie = f.nom_complet !== profil.nom_complet || f.poste !== (profil.poste || '') || f.telephone !== (profil.telephone || '')

  const enregistrer = async (e) => {
    e.preventDefault()
    if (!f.nom_complet.trim()) return toast.erreur('Le nom complet est obligatoire.')
    setEnvoi(true)
    try {
      const p = await modifierProfil(profil.id, {
        nom_complet: f.nom_complet.trim(),
        poste: f.poste.trim() || null,
        telephone: f.telephone.trim() || null
      })
      setProfil(p)
      majProfil(p)
      toast.info('Profil enregistré')
    } catch (err) {
      toast.erreur(messageErreur(err))
    } finally {
      setEnvoi(false)
    }
  }

  const changerMotDePasse = async (e) => {
    e.preventDefault()
    if (mdp.nouveau.length < 8) return setMdp({ ...mdp, erreur: 'Au moins 8 caractères.' })
    if (mdp.nouveau !== mdp.confirmation) return setMdp({ ...mdp, erreur: 'Les deux mots de passe diffèrent.' })
    const { error } = await supabase.auth.updateUser({ password: mdp.nouveau })
    if (error) return setMdp({ ...mdp, erreur: messageErreur(error) })
    setMdp({ nouveau: '', confirmation: '', erreur: '' })
    setMdpOuvert(false)
    toast.info('Mot de passe modifié')
  }

  return (
    <>
      <h1 className="titre-page" style={{ marginBottom: 16 }}>Mon compte</h1>

      <div className="carte carte--padding ligne" style={{ gap: 14, marginBottom: 16 }}>
        <span className="avatar avatar--grand">{initiales(profil.nom_complet)}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '1.0625rem' }}>{profil.nom_complet}</div>
          <div className="texte-doux texte-petit" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{utilisateur?.email}</div>
          <span className={`etiquette-role etiquette-role--${profil.role}`} style={{ marginTop: 4 }}>{ROLES[profil.role]}</span>
        </div>
      </div>

      <form className="carte carte--padding pile" onSubmit={enregistrer}>
        <h2 style={{ fontSize: '1rem' }}>Mon profil</h2>
        <div className="champ">
          <label htmlFor="nom">Nom complet</label>
          <input id="nom" className="saisie" value={f.nom_complet} onChange={(e) => setF({ ...f, nom_complet: e.target.value })} autoComplete="name" />
        </div>
        <div className="champ">
          <label htmlFor="poste">Poste</label>
          <input id="poste" className="saisie" value={f.poste} onChange={(e) => setF({ ...f, poste: e.target.value })} placeholder="Ex. : Comptable" />
        </div>
        <div className="champ">
          <label htmlFor="tel">Téléphone</label>
          <input id="tel" className="saisie" type="tel" inputMode="tel" value={f.telephone} onChange={(e) => setF({ ...f, telephone: e.target.value })} placeholder="+229 01 00 00 00 00" autoComplete="tel" />
        </div>
        <button className="btn btn--primaire btn--bloc" type="submit" disabled={!modifie || envoi}>{envoi ? 'Enregistrement…' : 'Enregistrer'}</button>
      </form>

      {estGestionnaire(profil) && (
        <>
          <h2 className="titre-section">Administration</h2>
          <nav className="carte liste-reglages" style={{ padding: '0 14px' }}>
            <Link to="/compte/membres"><IconeGroupe /> Gestion des membres <IconeSuivant className="chevron" /></Link>
            <Link to="/compte/import"><IconeImporter /> Importer une liste de tâches <IconeSuivant className="chevron" /></Link>
          </nav>
        </>
      )}

      <h2 className="titre-section">Application</h2>
      <div className="carte liste-reglages" style={{ padding: '0 14px' }}>
        {!installation.estInstallee && (installation.peutInstaller || installation.estIOS) && (
          <button type="button" className="lien" onClick={() => (installation.peutInstaller ? installation.installer() : setAideIOS(true))}>
            <IconeInstaller /> Installer sur l'écran d'accueil <IconeSuivant className="chevron" />
          </button>
        )}
        <button type="button" className="lien" onClick={() => setMdpOuvert(true)}>
          <IconeCle /> Changer mon mot de passe <IconeSuivant className="chevron" />
        </button>
        <div className="ligne" style={{ minHeight: 56, gap: 12, padding: '0 4px', borderBottom: '1px solid var(--bordure)' }}>
          <IconeHorloge style={{ width: 22, height: 22, color: 'var(--bleu-nuit)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>Rappels d'échéance</div>
            <div className="texte-doux texte-tres-petit">{notificationsActives ? 'Disponibles' : 'Bientôt disponibles (48 h avant, tâche échue)'}</div>
          </div>
        </div>
        <button type="button" className="lien" onClick={deconnexion} style={{ color: 'var(--rouge)' }}>
          <IconeSortie style={{ color: 'var(--rouge)' }} /> Se déconnecter
        </button>
      </div>

      <p className="texte-doux texte-tres-petit" style={{ textAlign: 'center', marginTop: 20 }}>
        Agenda CRF Perfection · version {__VERSION_APP__}
      </p>

      <FeuilleBas ouvert={mdpOuvert} titre="Changer mon mot de passe" onFermer={() => setMdpOuvert(false)}>
        <form className="pile" onSubmit={changerMotDePasse}>
          <div className="champ">
            <label htmlFor="n-mdp">Nouveau mot de passe</label>
            <input id="n-mdp" className="saisie" type="password" autoComplete="new-password" value={mdp.nouveau} onChange={(e) => setMdp({ ...mdp, nouveau: e.target.value })} />
          </div>
          <div className="champ">
            <label htmlFor="c-mdp">Confirmer</label>
            <input id="c-mdp" className="saisie" type="password" autoComplete="new-password" value={mdp.confirmation} onChange={(e) => setMdp({ ...mdp, confirmation: e.target.value })} />
          </div>
          {mdp.erreur && <p className="message-erreur">{mdp.erreur}</p>}
          <button className="btn btn--primaire btn--bloc" type="submit">Enregistrer</button>
        </form>
      </FeuilleBas>

      <FeuilleBas ouvert={aideIOS} titre="Installer sur iPhone" onFermer={() => setAideIOS(false)}>
        <ol className="pile" style={{ paddingLeft: 20, margin: 0 }}>
          <li>Ouvrez l'agenda dans <strong>Safari</strong>.</li>
          <li>Touchez le bouton <strong>Partager</strong> (carré avec une flèche vers le haut).</li>
          <li>Choisissez <strong>« Sur l'écran d'accueil »</strong>, puis <strong>Ajouter</strong>.</li>
        </ol>
      </FeuilleBas>
    </>
  )
}
