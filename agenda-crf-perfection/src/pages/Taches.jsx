import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ListeTaches from '../components/ListeTaches'
import FeuilleBas from '../components/FeuilleBas'
import { SqueletteCartes } from '../components/Chargement'
import { IconeRecherche, IconeTelecharger, IconeFichier, IconeFermer } from '../components/Icones'
import { useAuth } from '../context/AuthContext'
import { useDonnees } from '../context/DonneesContext'
import { useToast } from '../context/ToastContext'
import { FILTRES_STATUT, correspondStatut, filtrerTaches, libelleFiltres } from '../lib/filtres'
import { trierParEcheance, trierParNumero } from '../lib/statuts'
import { nomCourt, pluriel } from '../lib/texte'
import { messageErreur } from '../lib/api'

export default function Taches() {
  const { profil } = useAuth()
  const { taches, profilsActifs, profilsParId, jour, chargement } = useDonnees()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const [exportOuvert, setExportOuvert] = useState(false)
  const [exportEnCours, setExportEnCours] = useState(null)

  const filtre = params.get('filtre') || 'toutes'
  const personne = params.get('portee') === 'moi' ? profil.id : params.get('personne')
  const recherche = params.get('q') || ''
  const tri = params.get('tri') || 'echeance'

  const majParam = (cle, valeur) => {
    const p = new URLSearchParams(params)
    if (valeur === null || valeur === '' || valeur === undefined) p.delete(cle)
    else p.set(cle, valeur)
    if (cle === 'personne') p.delete('portee')
    setParams(p, { replace: true })
  }

  const resultat = useMemo(() => {
    const liste = filtrerTaches(taches, { filtre, personne, recherche, jour, profilsParId })
    return liste.sort(tri === 'numero' ? trierParNumero : trierParEcheance)
  }, [taches, filtre, personne, recherche, jour, profilsParId, tri])

  // nombre de tâches par filtre de statut (pour la personne sélectionnée)
  const compte = (cle) =>
    taches.filter((t) => correspondStatut(t, cle, jour) && (!personne || t.attribues.includes(personne))).length

  const sousTitre = libelleFiltres({ filtre, personne, recherche, profilsParId, moiId: profil.id })

  const lancerExport = async (format) => {
    setExportEnCours(format)
    try {
      const { exporterExcel, exporterPDF } = await import('../lib/export')
      if (format === 'excel') await exporterExcel(resultat, profilsParId, sousTitre)
      else await exporterPDF(resultat, profilsParId, sousTitre)
      setExportOuvert(false)
      toast.info(format === 'excel' ? 'Fichier Excel téléchargé' : 'Fichier PDF téléchargé')
    } catch (e) {
      toast.erreur(`Export impossible : ${messageErreur(e)}`)
    } finally {
      setExportEnCours(null)
    }
  }

  const autres = profilsActifs.filter((p) => p.id !== profil.id)

  return (
    <>
      <div className="ligne ligne--espace" style={{ marginBottom: 12 }}>
        <h1 className="titre-page">Tâches</h1>
        <button type="button" className="btn btn--secondaire btn--petit" onClick={() => setExportOuvert(true)}>
          <IconeTelecharger /> Exporter
        </button>
      </div>

      <div className="barre-outils" style={{ marginBottom: 12 }}>
        <div className="recherche">
          <IconeRecherche />
          <input
            className="saisie"
            type="search"
            placeholder="Rechercher…"
            value={recherche}
            onChange={(e) => majParam('q', e.target.value)}
            aria-label="Rechercher une tâche"
            enterKeyHint="search"
          />
        </div>
        <select className="saisie" style={{ width: 'auto', flex: 'none' }} value={tri} onChange={(e) => majParam('tri', e.target.value === 'echeance' ? null : e.target.value)} aria-label="Trier par">
          <option value="echeance">Échéance</option>
          <option value="numero">N°</option>
        </select>
      </div>

      {/* Filtres rapides */}
      <div className="puces" role="group" aria-label="Filtrer par statut">
        {FILTRES_STATUT.slice(0, 1).map((f) => (
          <button key={f.cle} type="button" className="puce" aria-pressed={filtre === f.cle && !personne} onClick={() => setParams({}, { replace: true })}>
            {f.libelle}
          </button>
        ))}
        <button type="button" className="puce" aria-pressed={personne === profil.id} onClick={() => majParam('personne', personne === profil.id ? null : profil.id)}>
          Mes tâches
        </button>
        {FILTRES_STATUT.slice(1).map((f) => (
          <button
            key={f.cle}
            type="button"
            className={`puce ${f.alerte ? 'puce--alerte' : ''}`}
            aria-pressed={filtre === f.cle}
            onClick={() => majParam('filtre', filtre === f.cle ? null : f.cle)}
          >
            {f.libelle} <span className="nb">{compte(f.cle)}</span>
          </button>
        ))}
      </div>
      <div className="puces" role="group" aria-label="Filtrer par attributaire" style={{ marginTop: 4 }}>
        {autres.map((p) => (
          <button key={p.id} type="button" className="puce" aria-pressed={personne === p.id} onClick={() => majParam('personne', personne === p.id ? null : p.id)}>
            {nomCourt(p.nom_complet)}
          </button>
        ))}
        <button type="button" className="puce" aria-pressed={personne === 'aucun'} onClick={() => majParam('personne', personne === 'aucun' ? null : 'aucun')}>
          Non attribuées
        </button>
      </div>

      <div className="ligne ligne--espace texte-doux texte-petit" style={{ margin: '10px 0' }}>
        <span>{pluriel(resultat.length, 'tâche')} · {sousTitre}</span>
        {(filtre !== 'toutes' || personne || recherche) && (
          <button type="button" className="btn btn--fantome btn--petit" onClick={() => setParams({}, { replace: true })} style={{ minHeight: 36, padding: '0 6px' }}>
            <IconeFermer /> Effacer
          </button>
        )}
      </div>

      {chargement ? (
        <SqueletteCartes />
      ) : (
        <ListeTaches taches={resultat} tableau vide="Aucune tâche ne correspond à ces filtres." />
      )}

      {!chargement && resultat.length > 0 && (
        <p className="texte-doux texte-tres-petit" style={{ textAlign: 'center', marginTop: 14 }}>
          Astuce : glissez une carte vers la droite pour la marquer terminée, vers la gauche pour changer son statut.
        </p>
      )}

      <FeuilleBas ouvert={exportOuvert} titre="Exporter la liste" onFermer={() => setExportOuvert(false)}>
        <p className="texte-doux" style={{ marginBottom: 14 }}>
          {pluriel(resultat.length, 'tâche')} ({sousTitre}) seront exportées, dans l'ordre affiché.
        </p>
        <div className="pile">
          <button className="btn btn--primaire btn--bloc" disabled={!resultat.length || exportEnCours} onClick={() => lancerExport('pdf')}>
            <IconeFichier /> {exportEnCours === 'pdf' ? 'Préparation du PDF…' : 'PDF (pour impression / réunion)'}
          </button>
          <button className="btn btn--secondaire btn--bloc" disabled={!resultat.length || exportEnCours} onClick={() => lancerExport('excel')}>
            <IconeTelecharger /> {exportEnCours === 'excel' ? 'Préparation du fichier…' : 'Excel (.xlsx)'}
          </button>
        </div>
      </FeuilleBas>
    </>
  )
}
