import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconeImporter, IconeRetour, IconeTelecharger } from '../components/Icones'
import { useDonnees } from '../context/DonneesContext'
import { useToast } from '../context/ToastContext'
import { supabase } from '../lib/supabase'
import { messageErreur } from '../lib/api'
import { formaterDate } from '../lib/dates'
import { STATUTS } from '../lib/statuts'
import { pluriel } from '../lib/texte'
import { MODELE_CSV, lireFichier, preparerImport } from '../lib/import'

const TAILLE_LOT = 50

export default function Import() {
  const naviguer = useNavigate()
  const toast = useToast()
  const { taches, profils, profilsParId, recharger } = useDonnees()
  const champFichier = useRef(null)
  const [nomFichier, setNomFichier] = useState('')
  const [resultat, setResultat] = useState(null)
  const [erreur, setErreur] = useState('')
  const [progression, setProgression] = useState(null)

  const choisir = async (e) => {
    const fichier = e.target.files?.[0]
    e.target.value = ''
    if (!fichier) return
    setErreur('')
    setResultat(null)
    setNomFichier(fichier.name)
    try {
      const brut = await lireFichier(fichier)
      const numeros = new Set(taches.map((t) => t.numero))
      setResultat(preparerImport(brut, profils, numeros))
    } catch (err) {
      setErreur(messageErreur(err))
    }
  }

  const telechargerModele = () => {
    const blob = new Blob(['﻿' + MODELE_CSV], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'modele-import-agenda-crf.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const valides = resultat?.lignes.filter((l) => !l.erreurs.length) || []
  const enErreur = resultat?.lignes.filter((l) => l.erreurs.length) || []

  const importer = async () => {
    setProgression(0)
    setErreur('')
    try {
      let faits = 0
      // 1) tâches avec N° du fichier : insertion par lots
      const avecNumero = valides.filter((l) => l.numero)
      const sansNumero = valides.filter((l) => !l.numero)
      const versLigne = (l) => ({
        ...(l.numero ? { numero: l.numero } : {}),
        intitule: l.intitule,
        description: l.description,
        echeance: l.echeance,
        statut: l.statut,
        ...(l.date_creation ? { date_creation: l.date_creation } : {})
      })
      for (let i = 0; i < avecNumero.length; i += TAILLE_LOT) {
        const lot = avecNumero.slice(i, i + TAILLE_LOT)
        const { data, error } = await supabase.from('taches').insert(lot.map(versLigne)).select('id, numero')
        if (error) throw error
        const attributions = lot.flatMap((l) => {
          const id = data.find((d) => d.numero === l.numero)?.id
          return id ? l.attribues.map((profil_id) => ({ tache_id: id, profil_id })) : []
        })
        if (attributions.length) {
          const { error: e2 } = await supabase.from('attributions').insert(attributions)
          if (e2) throw e2
        }
        faits += lot.length
        setProgression(faits)
      }
      // 2) tâches sans N° : une par une (numérotation automatique)
      for (const l of sansNumero) {
        const { data, error } = await supabase.from('taches').insert(versLigne(l)).select('id').single()
        if (error) throw error
        if (l.attribues.length) {
          const { error: e2 } = await supabase.from('attributions').insert(l.attribues.map((profil_id) => ({ tache_id: data.id, profil_id })))
          if (e2) throw e2
        }
        faits += 1
        setProgression(faits)
      }
      await recharger()
      toast.info(`${pluriel(faits, 'tâche importée', 'tâches importées')}`)
      naviguer('/taches?tri=numero')
    } catch (err) {
      setErreur(`Import interrompu : ${messageErreur(err)}. Les tâches déjà importées sont conservées.`)
      await recharger()
    } finally {
      setProgression(null)
    }
  }

  return (
    <>
      <button type="button" className="btn btn--fantome btn--petit retour" onClick={() => naviguer('/compte')}>
        <IconeRetour /> Mon compte
      </button>
      <h1 className="titre-page" style={{ marginBottom: 8 }}>Importer des tâches</h1>
      <p className="texte-doux" style={{ marginBottom: 16 }}>
        Fichier Excel (.xlsx) ou CSV avec les colonnes <strong>N°, Tâche, Date, Échéance, Attributaire</strong>.
        Dates au format jj/mm/aaaa. Plusieurs attributaires : séparez-les par une virgule.
      </p>

      <div className="pile">
        <input ref={champFichier} type="file" accept=".xlsx,.csv,.txt,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv" onChange={choisir} hidden />
        <button className="btn btn--primaire btn--bloc" onClick={() => champFichier.current.click()} disabled={progression !== null}>
          <IconeImporter /> Choisir un fichier
        </button>
        <button className="btn btn--secondaire btn--bloc" onClick={telechargerModele}>
          <IconeTelecharger /> Télécharger un modèle (CSV)
        </button>
      </div>

      {erreur && <p className="message-erreur" style={{ marginTop: 16 }}>{erreur}</p>}

      {resultat && (
        <>
          <h2 className="titre-section">{nomFichier}</h2>
          <p className="message-info" style={{ marginBottom: 12 }}>
            {pluriel(valides.length, 'tâche prête', 'tâches prêtes')} à importer
            {enErreur.length > 0 && <> · <strong style={{ color: 'var(--rouge)' }}>{pluriel(enErreur.length, 'ligne ignorée', 'lignes ignorées')}</strong></>}
          </p>

          <div className="carte tableau-conteneur" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
            <table className="tableau apercu-import">
              <thead>
                <tr><th>Ligne</th><th>N°</th><th>Tâche</th><th>Date</th><th>Échéance</th><th>Attributaire</th><th>Statut</th><th>Remarques</th></tr>
              </thead>
              <tbody>
                {resultat.lignes.map((l) => (
                  <tr key={l.ligne} style={{ cursor: 'default' }}>
                    <td>{l.ligne}</td>
                    <td>{l.numero || 'auto'}</td>
                    <td style={{ minWidth: 180 }}>{l.intitule}</td>
                    <td>{l.date_creation ? formaterDate(l.date_creation) : '—'}</td>
                    <td>{l.echeance ? formaterDate(l.echeance) : '—'}</td>
                    <td style={{ minWidth: 120 }}>{l.attribues.map((id) => profilsParId[id]?.nom_complet).join(', ') || '—'}</td>
                    <td>{STATUTS[l.statut].libelle}</td>
                    <td style={{ minWidth: 180 }}>
                      {l.erreurs.map((e) => <div key={e} className="erreur">✕ {e}</div>)}
                      {l.avertissements.map((e) => <div key={e} className="attention">! {e}</div>)}
                      {!l.erreurs.length && !l.avertissements.length && <span style={{ color: 'var(--st-termine-texte)' }}>✓</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="barre-action">
            <button className="btn btn--primaire" disabled={!valides.length || progression !== null} onClick={importer}>
              {progression !== null ? `Import… ${progression}/${valides.length}` : `Importer ${pluriel(valides.length, 'tâche')}`}
            </button>
          </div>
        </>
      )}
    </>
  )
}
