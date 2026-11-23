import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ListeTaches from '../components/ListeTaches'
import { SqueletteCartes } from '../components/Chargement'
import { IconeAlerte, IconeHorloge, IconeActualiser } from '../components/Icones'
import { useAuth } from '../context/AuthContext'
import { useDonnees } from '../context/DonneesContext'
import { ajouterJours, formaterDateLongue } from '../lib/dates'
import { estEchue, estTerminee, trierParEcheance } from '../lib/statuts'
import { estGestionnaire } from '../lib/droits'
import { majuscule, prenom } from '../lib/texte'
import { messageErreur } from '../lib/api'

const CLE_PORTEE = 'agenda-crf-portee-accueil'

export default function Accueil() {
  const { profil } = useAuth()
  const { taches, jour, chargement, erreur, recharger } = useDonnees()
  const [portee, setPortee] = useState(() => {
    try {
      return localStorage.getItem(CLE_PORTEE) || (estGestionnaire(profil) ? 'equipe' : 'moi')
    } catch {
      return 'equipe'
    }
  })
  const changerPortee = (p) => {
    setPortee(p)
    try { localStorage.setItem(CLE_PORTEE, p) } catch { /* stockage indisponible */ }
  }

  const { liste, compteurs, enRetard, semaine } = useMemo(() => {
    const liste = portee === 'moi' ? taches.filter((t) => t.attribues.includes(profil.id)) : taches
    const dans7 = ajouterJours(jour, 7)
    const enRetard = liste.filter((t) => estEchue(t, jour)).sort(trierParEcheance)
    const semaine = liste
      .filter((t) => !estTerminee(t) && t.echeance && t.echeance >= jour && t.echeance <= dans7)
      .sort(trierParEcheance)
    return {
      liste,
      enRetard,
      semaine,
      compteurs: {
        total: liste.length,
        enCours: liste.filter((t) => !estTerminee(t) && !estEchue(t, jour)).length,
        echues: enRetard.length,
        terminees: liste.filter(estTerminee).length
      }
    }
  }, [taches, portee, profil.id, jour])

  const suffixe = portee === 'moi' ? '&portee=moi' : ''

  return (
    <>
      <div className="ligne ligne--espace" style={{ alignItems: 'flex-start', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 className="titre-page">Bonjour {prenom(profil.nom_complet)}</h1>
          <p className="sous-titre">{majuscule(formaterDateLongue(jour))}</p>
        </div>
        <div className="segment" role="group" aria-label="Portée du tableau de bord">
          <button type="button" aria-pressed={portee === 'equipe'} onClick={() => changerPortee('equipe')}>Équipe</button>
          <button type="button" aria-pressed={portee === 'moi'} onClick={() => changerPortee('moi')}>Mes tâches</button>
        </div>
      </div>

      {erreur && (
        <div className="message-erreur ligne ligne--espace" style={{ marginBottom: 12 }}>
          <span>{messageErreur(erreur)}</span>
          <button className="btn btn--petit btn--secondaire" onClick={recharger}><IconeActualiser /> Réessayer</button>
        </div>
      )}

      <section className="compteurs" aria-label="Compteurs">
        <Link to={`/taches?filtre=toutes${suffixe}`} className="compteur compteur--total">
          <div className="compteur__valeur">{chargement ? '–' : compteurs.total}</div>
          <div className="compteur__libelle">Total</div>
        </Link>
        <Link to={`/taches?filtre=en_cours${suffixe}`} className="compteur compteur--encours">
          <div className="compteur__valeur">{chargement ? '–' : compteurs.enCours}</div>
          <div className="compteur__libelle">En cours</div>
        </Link>
        <Link to={`/taches?filtre=echues${suffixe}`} className={`compteur compteur--echues ${compteurs.echues ? '' : 'vide'}`}>
          <div className="compteur__valeur">{chargement ? '–' : compteurs.echues}</div>
          <div className="compteur__libelle">Échues</div>
        </Link>
        <Link to={`/taches?filtre=terminees${suffixe}`} className="compteur compteur--terminees">
          <div className="compteur__valeur">{chargement ? '–' : compteurs.terminees}</div>
          <div className="compteur__libelle">Terminées</div>
        </Link>
      </section>

      {chargement ? (
        <div style={{ marginTop: 24 }}><SqueletteCartes nombre={3} /></div>
      ) : (
        <div className="colonnes-accueil">
          {enRetard.length > 0 ? (
            <section className="bloc-retard" aria-labelledby="titre-retard">
              <h2 className="titre-section" id="titre-retard">
                <IconeAlerte /> En retard <span className="compte">({enRetard.length})</span>
              </h2>
              <ListeTaches taches={enRetard.slice(0, 8)} />
              {enRetard.length > 8 && (
                <Link to={`/taches?filtre=echues${suffixe}`} className="btn btn--alerte btn--bloc" style={{ marginTop: 10 }}>
                  Voir les {enRetard.length} tâches en retard
                </Link>
              )}
            </section>
          ) : (
            <section>
              <h2 className="titre-section">En retard</h2>
              <p className="vide">Aucune tâche en retard. 👍</p>
            </section>
          )}

          <section aria-labelledby="titre-semaine">
            <h2 className="titre-section" id="titre-semaine">
              <IconeHorloge width="20" height="20" /> À échéance dans les 7 jours <span className="compte">({semaine.length})</span>
            </h2>
            <ListeTaches taches={semaine} vide="Rien à rendre dans les 7 prochains jours." />
          </section>
        </div>
      )}
      {!chargement && liste.length === 0 && (
        <p className="message-info" style={{ marginTop: 16 }}>
          Aucune tâche pour l'instant. Touchez le bouton <strong>+</strong> pour en ajouter une.
        </p>
      )}
    </>
  )
}
