import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FeuilleBas from './FeuilleBas'
import ChampEcheance from './ChampEcheance'
import SelecteurPersonnes from './SelecteurPersonnes'
import { useAuth } from '../context/AuthContext'
import { useDonnees } from '../context/DonneesContext'
import { useToast } from '../context/ToastContext'
import { creerTache, messageErreur } from '../lib/api'
import { estGestionnaire } from '../lib/droits'

/** Ajout d'une tâche en moins de 10 secondes : intitulé, échéance, attributaire(s). */
export default function AjoutRapide({ ouvert, onFermer }) {
  const { profil } = useAuth()
  const { profilsActifs, remplacerTache } = useDonnees()
  const toast = useToast()
  const naviguer = useNavigate()

  const valeursInitiales = () => ({
    intitule: '',
    echeance: '',
    attribues: estGestionnaire(profil) ? [] : [profil?.id].filter(Boolean),
    haute: false
  })
  const [f, setF] = useState(valeursInitiales)
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    if (ouvert) {
      setF(valeursInitiales())
      setErreur('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ouvert])

  const enregistrer = async (e) => {
    e.preventDefault()
    if (!f.intitule.trim()) return setErreur("Indiquez l'intitulé de la tâche.")
    if (!f.echeance) return setErreur("Choisissez l'échéance.")
    if (!f.attribues.length) return setErreur('Choisissez au moins un attributaire.')
    setEnvoi(true)
    setErreur('')
    try {
      const tache = await creerTache(
        { intitule: f.intitule.trim(), echeance: f.echeance, priorite: f.haute ? 'haute' : 'normale' },
        f.attribues
      )
      remplacerTache(tache)
      onFermer()
      toast.info(`Tâche N° ${tache.numero} ajoutée`, {
        action: { libelle: 'Voir', onClick: () => naviguer(`/taches/${tache.id}`) }
      })
    } catch (err) {
      setErreur(messageErreur(err))
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <FeuilleBas ouvert={ouvert} titre="Nouvelle tâche" onFermer={onFermer}>
      <form className="pile" onSubmit={enregistrer} noValidate>
        <div className="champ">
          <label htmlFor="ajout-intitule">Intitulé *</label>
          <input
            id="ajout-intitule"
            className="saisie"
            value={f.intitule}
            onChange={(e) => setF({ ...f, intitule: e.target.value })}
            placeholder="Ex. : Préparer le rapport mensuel"
            autoFocus
            autoComplete="off"
            enterKeyHint="next"
            maxLength={300}
          />
        </div>

        <ChampEcheance id="ajout-echeance" valeur={f.echeance} onChange={(v) => setF({ ...f, echeance: v })} />

        <div className="champ">
          <span className="etiquette">Attributaire(s) *</span>
          <SelecteurPersonnes
            profils={profilsActifs}
            selection={f.attribues}
            onChange={(attribues) => setF({ ...f, attribues })}
            moiId={profil?.id}
          />
        </div>

        <label className="interrupteur">
          <span style={{ fontWeight: 600 }}>Priorité haute</span>
          <input type="checkbox" checked={f.haute} onChange={(e) => setF({ ...f, haute: e.target.checked })} />
        </label>

        {erreur && <p className="message-erreur" role="alert">{erreur}</p>}

        <button className="btn btn--primaire btn--bloc" type="submit" disabled={envoi}>
          {envoi ? 'Enregistrement…' : 'Enregistrer la tâche'}
        </button>
        <button
          type="button"
          className="btn btn--fantome btn--bloc"
          onClick={() => {
            onFermer()
            naviguer('/taches/nouvelle', { state: { brouillon: f } })
          }}
        >
          Plus d'options (description, date…)
        </button>
      </form>
    </FeuilleBas>
  )
}
