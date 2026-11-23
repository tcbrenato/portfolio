import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PastilleStatut from '../components/PastilleStatut'
import MenuStatut from '../components/MenuStatut'
import FeuilleBas from '../components/FeuilleBas'
import { SqueletteCartes } from '../components/Chargement'
import { IconeRetour, IconeCrayon, IconePoubelle, IconeEnvoyer, IconeTelephone, IconeCoche, IconeActualiser } from '../components/Icones'
import { useAuth } from '../context/AuthContext'
import { useDonnees } from '../context/DonneesContext'
import { useToast } from '../context/ToastContext'
import { useChangementStatut } from '../hooks/useChangementStatut'
import {
  ajouterCommentaire, chargerCommentaires, chargerHistorique, chargerTache,
  messageErreur, supprimerCommentaire, supprimerTache
} from '../lib/api'
import { formaterDate, formaterHorodatage } from '../lib/dates'
import { STATUTS, delai, estEchue, estTerminee, ROLES } from '../lib/statuts'
import { estGestionnaire, peutChangerStatut, peutCommenter, peutModifier, peutSupprimer } from '../lib/droits'
import { initiales } from '../lib/texte'

function texteHistorique(h, profilsParId) {
  switch (h.champ) {
    case 'creation':
      return 'Tâche créée'
    case 'statut':
      return <>Statut : {STATUTS[h.ancienne_valeur]?.libelle} → <strong>{STATUTS[h.nouvelle_valeur]?.libelle}</strong></>
    case 'echeance':
      return <>Échéance : {formaterDate(h.ancienne_valeur)} → <strong>{formaterDate(h.nouvelle_valeur)}</strong></>
    case 'attribution':
      return h.nouvelle_valeur ? <>Attribuée à <strong>{h.nouvelle_valeur}</strong></> : <>Retirée à <strong>{h.ancienne_valeur}</strong></>
    default:
      return h.champ
  }
}

export default function FicheTache() {
  const { id } = useParams()
  const naviguer = useNavigate()
  const toast = useToast()
  const { profil } = useAuth()
  const { taches, profilsParId, jour, chargement, remplacerTache, retirerTache } = useDonnees()
  const { appliquer, tacheMenu, ouvrirMenu, fermerMenu } = useChangementStatut()

  const tacheEnMemoire = taches.find((t) => t.id === id)
  const [tacheDistante, setTacheDistante] = useState(null)
  const [introuvable, setIntrouvable] = useState(false)
  const tache = tacheEnMemoire || tacheDistante

  const [onglet, setOnglet] = useState('commentaires')
  const [commentaires, setCommentaires] = useState(null)
  const [historique, setHistorique] = useState(null)
  const [texte, setTexte] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [confirmerSuppression, setConfirmerSuppression] = useState(false)

  // Tâche absente de la liste en mémoire (ex. lien direct) : chargement à la demande
  useEffect(() => {
    if (chargement || tacheEnMemoire) return
    chargerTache(id)
      .then((t) => (t ? (setTacheDistante(t), remplacerTache(t)) : setIntrouvable(true)))
      .catch(() => setIntrouvable(true))
  }, [id, chargement, tacheEnMemoire, remplacerTache])

  useEffect(() => {
    chargerCommentaires(id).then(setCommentaires).catch(() => setCommentaires([]))
  }, [id])

  // l'historique est rechargé à chaque changement de la tâche (statut, échéance…)
  const signature = tache ? `${tache.statut}|${tache.echeance}|${tache.attribues.join(',')}` : ''
  useEffect(() => {
    if (onglet === 'historique') chargerHistorique(id).then(setHistorique).catch(() => setHistorique([]))
  }, [id, onglet, signature])

  if (introuvable) {
    return (
      <div className="pile">
        <p className="vide">Cette tâche n'existe pas ou a été supprimée.</p>
        <Link to="/taches" className="btn btn--secondaire">Retour aux tâches</Link>
      </div>
    )
  }
  if (!tache) return <SqueletteCartes nombre={2} />

  const terminee = estTerminee(tache)
  const echue = estEchue(tache, jour)
  const d = delai(tache, jour)
  const modifStatut = peutChangerStatut(profil, tache)
  const createur = profilsParId[tache.cree_par]

  const envoyerCommentaire = async (e) => {
    e.preventDefault()
    if (!texte.trim()) return
    setEnvoi(true)
    try {
      const c = await ajouterCommentaire(tache.id, texte.trim())
      setCommentaires((l) => [...(l || []), c])
      setTexte('')
    } catch (err) {
      toast.erreur(messageErreur(err))
    } finally {
      setEnvoi(false)
    }
  }

  const effacerCommentaire = async (c) => {
    try {
      await supprimerCommentaire(c.id)
      setCommentaires((l) => l.filter((x) => x.id !== c.id))
    } catch (err) {
      toast.erreur(messageErreur(err))
    }
  }

  const supprimer = async () => {
    try {
      await supprimerTache(tache.id)
      retirerTache(tache.id)
      toast.info(`Tâche N° ${tache.numero} supprimée`)
      naviguer('/taches', { replace: true })
    } catch (err) {
      toast.erreur(messageErreur(err))
      setConfirmerSuppression(false)
    }
  }

  return (
    <>
      <button type="button" className="btn btn--fantome btn--petit retour" onClick={() => (window.history.length > 1 ? naviguer(-1) : naviguer('/taches'))}>
        <IconeRetour /> Retour
      </button>

      <div className="page-fiche">
        <div className={terminee ? 'fiche--terminee' : ''}>
          <div className="ligne" style={{ flexWrap: 'wrap', marginBottom: 6 }}>
            <span className="numero" style={{ fontSize: '0.9375rem' }}>N° {tache.numero}</span>
            {tache.priorite === 'haute' && <span className="badge-haute">Priorité haute</span>}
          </div>
          <h1 className="fiche__titre">{tache.intitule}</h1>

          <div className="ligne ligne--espace" style={{ margin: '12px 0 16px' }}>
            <PastilleStatut statut={tache.statut} onClick={modifStatut ? () => ouvrirMenu(tache) : undefined} />
            <span className={`delai ${d.classe}`} style={{ fontSize: '0.9375rem' }}>{d.texte}</span>
          </div>

          <dl className={`grille-infos ${echue ? 'grille-infos--echue' : ''}`} style={{ margin: 0 }}>
            <div><dt>Date</dt><dd>{formaterDate(tache.date_creation)}</dd></div>
            <div className="cellule-echeance"><dt>Échéance</dt><dd className={echue ? 'delai--echu' : ''}>{formaterDate(tache.echeance)}</dd></div>
            <div><dt>Créée par</dt><dd>{createur?.nom_complet || '—'}</dd></div>
            <div><dt>{terminee ? 'Terminée le' : 'Statut'}</dt><dd>{terminee ? formaterDate(tache.date_terminee) : STATUTS[tache.statut].libelle}</dd></div>
          </dl>

          {modifStatut && (
            <div className="ligne" style={{ marginTop: 14 }}>
              {terminee ? (
                <button className="btn btn--secondaire btn--bloc" onClick={() => appliquer(tache, 'en_cours')}><IconeActualiser /> Rouvrir la tâche</button>
              ) : (
                <button className="btn btn--primaire btn--bloc" onClick={() => appliquer(tache, 'termine')}><IconeCoche /> Marquer terminée</button>
              )}
            </div>
          )}

          {tache.description && (
            <>
              <h2 className="titre-section">Description</h2>
              <p className="description carte carte--padding">{tache.description}</p>
            </>
          )}

          <h2 className="titre-section">Attributaire{tache.attribues.length > 1 ? 's' : ''} <span className="compte">({tache.attribues.length})</span></h2>
          <div className="carte" style={{ padding: '2px 14px' }}>
            {tache.attribues.length === 0 && <p className="texte-doux" style={{ padding: '12px 0' }}>Non attribuée</p>}
            {tache.attribues.map((pid) => {
              const p = profilsParId[pid]
              if (!p) return null
              return (
                <div key={pid} className="personne">
                  <span className="avatar">{initiales(p.nom_complet)}</span>
                  <div style={{ minWidth: 0 }}>
                    <div className="personne__nom">{p.nom_complet}{!p.actif && ' (inactif)'}</div>
                    <div className="personne__poste">{p.poste || ROLES[p.role]}</div>
                  </div>
                  {p.telephone && (
                    <a className="btn-icone" href={`tel:${p.telephone.replace(/\s/g, '')}`} aria-label={`Appeler ${p.nom_complet}`}><IconeTelephone /></a>
                  )}
                </div>
              )
            })}
          </div>

          {(peutModifier(profil, tache) || peutSupprimer(profil)) && (
            <div className="ligne" style={{ marginTop: 16, gap: 10 }}>
              {peutModifier(profil, tache) && (
                <Link to={`/taches/${tache.id}/modifier`} className="btn btn--secondaire" style={{ flex: 1 }}><IconeCrayon /> Modifier</Link>
              )}
              {peutSupprimer(profil) && (
                <button type="button" className="btn btn--alerte" style={{ flex: 1 }} onClick={() => setConfirmerSuppression(true)}><IconePoubelle /> Supprimer</button>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="onglets" role="tablist">
            <button role="tab" aria-selected={onglet === 'commentaires'} onClick={() => setOnglet('commentaires')}>
              Commentaires{commentaires?.length ? ` (${commentaires.length})` : ''}
            </button>
            <button role="tab" aria-selected={onglet === 'historique'} onClick={() => setOnglet('historique')}>Historique</button>
          </div>

          {onglet === 'commentaires' ? (
            <div role="tabpanel">
              {commentaires === null && <p className="texte-doux" style={{ padding: '12px 0' }}>Chargement…</p>}
              {commentaires?.length === 0 && <p className="texte-doux" style={{ padding: '14px 0' }}>Aucun commentaire.</p>}
              {commentaires?.map((c) => (
                <div key={c.id} className="commentaire">
                  <div className="commentaire__entete">
                    <strong>{profilsParId[c.auteur_id]?.nom_complet || 'Ancien membre'}</strong>
                    <span className="texte-doux">{formaterHorodatage(c.date)}</span>
                    {(c.auteur_id === profil.id || estGestionnaire(profil)) && (
                      <button type="button" className="btn btn--fantome" style={{ marginLeft: 'auto', minHeight: 32, padding: '0 6px', fontSize: '0.8125rem' }} onClick={() => effacerCommentaire(c)}>Supprimer</button>
                    )}
                  </div>
                  <p className="commentaire__texte">{c.texte}</p>
                </div>
              ))}
              {peutCommenter(profil, tache) ? (
                <form className="zone-commentaire" onSubmit={envoyerCommentaire}>
                  <textarea className="saisie" placeholder="Ajouter un commentaire…" value={texte} onChange={(e) => setTexte(e.target.value)} rows={1} maxLength={2000} aria-label="Commentaire" />
                  <button className="btn btn--primaire" type="submit" disabled={envoi || !texte.trim()} aria-label="Envoyer" style={{ padding: '0 14px' }}><IconeEnvoyer /></button>
                </form>
              ) : (
                <p className="texte-doux texte-tres-petit" style={{ marginTop: 12 }}>Seuls les attributaires de cette tâche et la Direction peuvent commenter.</p>
              )}
            </div>
          ) : (
            <div role="tabpanel">
              {historique === null && <p className="texte-doux" style={{ padding: '12px 0' }}>Chargement…</p>}
              {historique?.length === 0 && <p className="texte-doux" style={{ padding: '14px 0' }}>Aucun changement enregistré.</p>}
              {historique?.length > 0 && (
                <ol className="chronologie">
                  {historique.map((h) => (
                    <li key={h.id}>
                      <div>{texteHistorique(h, profilsParId)}</div>
                      <div className="quand">{formaterHorodatage(h.date)} · {profilsParId[h.auteur_id]?.nom_complet || 'Système'}</div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </div>
      </div>

      <MenuStatut tache={tacheMenu && tache} onChoisir={appliquer} onFermer={fermerMenu} />

      <FeuilleBas ouvert={confirmerSuppression} titre="Supprimer la tâche ?" onFermer={() => setConfirmerSuppression(false)}>
        <p style={{ marginBottom: 16 }}>
          La tâche <strong>N° {tache.numero} — {tache.intitule}</strong> sera supprimée définitivement, avec ses commentaires et son historique.
        </p>
        <div className="pile">
          <button className="btn btn--accent btn--bloc" onClick={supprimer}><IconePoubelle /> Supprimer définitivement</button>
          <button className="btn btn--secondaire btn--bloc" onClick={() => setConfirmerSuppression(false)}>Annuler</button>
        </div>
      </FeuilleBas>
    </>
  )
}
