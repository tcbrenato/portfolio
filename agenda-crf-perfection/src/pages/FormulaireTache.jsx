import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import ChampEcheance from '../components/ChampEcheance'
import SelecteurPersonnes from '../components/SelecteurPersonnes'
import { SqueletteCartes } from '../components/Chargement'
import { IconeRetour } from '../components/Icones'
import { useAuth } from '../context/AuthContext'
import { useDonnees } from '../context/DonneesContext'
import { useToast } from '../context/ToastContext'
import { creerTache, messageErreur, modifierTache } from '../lib/api'
import { aujourdhui } from '../lib/dates'
import { ORDRE_STATUTS, STATUTS } from '../lib/statuts'
import { estGestionnaire, peutModifier } from '../lib/droits'

export default function FormulaireTache() {
  const { id } = useParams()
  const edition = Boolean(id)
  const { state } = useLocation()
  const naviguer = useNavigate()
  const toast = useToast()
  const { profil } = useAuth()
  const { taches, profils, profilsActifs, chargement, remplacerTache } = useDonnees()
  const tache = edition ? taches.find((t) => t.id === id) : null
  const gestionnaire = estGestionnaire(profil)

  const [f, setF] = useState(null)
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    if (f) return
    if (edition) {
      if (!tache) return
      setF({
        intitule: tache.intitule,
        description: tache.description || '',
        echeance: tache.echeance || '',
        date_creation: tache.date_creation,
        priorite: tache.priorite,
        statut: tache.statut,
        attribues: [...tache.attribues]
      })
    } else {
      const b = state?.brouillon
      setF({
        intitule: b?.intitule || '',
        description: '',
        echeance: b?.echeance || '',
        date_creation: aujourdhui(),
        priorite: b?.haute ? 'haute' : 'normale',
        statut: 'a_faire',
        attribues: b?.attribues || (gestionnaire ? [] : [profil.id])
      })
    }
  }, [edition, tache, f, state, gestionnaire, profil.id])

  if (edition && !chargement && !tache) return <Navigate to="/taches" replace />
  if (edition && tache && !peutModifier(profil, tache)) return <Navigate to={`/taches/${id}`} replace />
  if (!f) return <SqueletteCartes nombre={2} />

  // personnes proposées : membres actifs + attributaires actuels éventuellement inactifs
  const choix = [...profilsActifs, ...profils.filter((p) => !p.actif && f.attribues.includes(p.id))]

  const enregistrer = async (e) => {
    e.preventDefault()
    if (!f.intitule.trim()) return setErreur("Indiquez l'intitulé de la tâche.")
    if (!f.echeance) return setErreur("Choisissez l'échéance.")
    if (!f.attribues.length) return setErreur('Choisissez au moins un attributaire.')
    if (f.date_creation && f.echeance < f.date_creation) return setErreur("L'échéance ne peut pas précéder la date de la tâche.")
    setErreur('')
    setEnvoi(true)
    const champs = {
      intitule: f.intitule.trim(),
      description: f.description.trim() || null,
      echeance: f.echeance,
      priorite: f.priorite,
      statut: f.statut
    }
    if (gestionnaire && f.date_creation) champs.date_creation = f.date_creation
    try {
      const resultat = edition
        ? await modifierTache(id, champs, f.attribues, tache.attribues)
        : await creerTache(champs, f.attribues)
      remplacerTache(resultat)
      toast.info(edition ? `Tâche N° ${resultat.numero} modifiée` : `Tâche N° ${resultat.numero} ajoutée`)
      naviguer(`/taches/${resultat.id}`, { replace: true })
    } catch (err) {
      setErreur(messageErreur(err))
      setEnvoi(false)
    }
  }

  return (
    <form className="formulaire-large" onSubmit={enregistrer} noValidate>
      <button type="button" className="btn btn--fantome btn--petit retour" onClick={() => naviguer(-1)}>
        <IconeRetour /> Retour
      </button>
      <h1 className="titre-page" style={{ marginBottom: 16 }}>
        {edition ? `Modifier la tâche N° ${tache.numero}` : 'Nouvelle tâche'}
      </h1>

      <div className="pile">
        <div className="champ">
          <label htmlFor="intitule">Intitulé *</label>
          <input id="intitule" className="saisie" value={f.intitule} onChange={(e) => setF({ ...f, intitule: e.target.value })} maxLength={300} autoComplete="off" autoFocus={!edition} />
        </div>

        <ChampEcheance valeur={f.echeance} onChange={(v) => setF({ ...f, echeance: v })} />

        <div className="champ">
          <span className="etiquette">Attributaire(s) *</span>
          <SelecteurPersonnes profils={choix} selection={f.attribues} onChange={(attribues) => setF({ ...f, attribues })} moiId={profil.id} />
        </div>

        <div className="champ">
          <label htmlFor="description">Description <span className="texte-doux">(facultatif)</span></label>
          <textarea id="description" className="saisie" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} maxLength={5000} placeholder="Détails, consignes, contacts…" />
        </div>

        <div className="ligne" style={{ gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div className="champ" style={{ flex: '1 1 150px' }}>
            <label htmlFor="statut">Statut</label>
            <select id="statut" className="saisie" value={f.statut} onChange={(e) => setF({ ...f, statut: e.target.value })}>
              {ORDRE_STATUTS.map((s) => <option key={s} value={s}>{STATUTS[s].libelle}</option>)}
            </select>
          </div>
          {gestionnaire && (
            <div className="champ" style={{ flex: '1 1 150px' }}>
              <label htmlFor="date_creation">Date de la tâche</label>
              <input id="date_creation" className="saisie" type="date" value={f.date_creation || ''} onChange={(e) => setF({ ...f, date_creation: e.target.value })} />
            </div>
          )}
        </div>

        <label className="interrupteur">
          <span style={{ fontWeight: 600 }}>Priorité haute</span>
          <input type="checkbox" checked={f.priorite === 'haute'} onChange={(e) => setF({ ...f, priorite: e.target.checked ? 'haute' : 'normale' })} />
        </label>

        {erreur && <p className="message-erreur" role="alert">{erreur}</p>}
      </div>

      <div className="barre-action">
        <button type="button" className="btn btn--secondaire" onClick={() => naviguer(-1)}>Annuler</button>
        <button type="submit" className="btn btn--primaire" disabled={envoi}>{envoi ? 'Enregistrement…' : 'Enregistrer'}</button>
      </div>
    </form>
  )
}
