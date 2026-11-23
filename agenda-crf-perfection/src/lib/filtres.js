import { estEchue, estTerminee } from './statuts'
import { normaliser } from './texte'

export const FILTRES_STATUT = [
  { cle: 'toutes', libelle: 'Toutes' },
  { cle: 'en_cours', libelle: 'En cours' },
  { cle: 'echues', libelle: 'Échues', alerte: true },
  { cle: 'terminees', libelle: 'Terminées' },
  { cle: 'bloquees', libelle: 'Bloquées' }
]

/**
 * - « En cours »  : non terminées et pas encore échues (à faire, en cours, bloquées)
 * - « Échues »    : échéance dépassée et non terminées
 * - « Terminées » : statut terminé
 * - « Bloquées »  : statut bloqué
 */
export function correspondStatut(t, filtre, jour) {
  switch (filtre) {
    case 'en_cours': return !estTerminee(t) && !estEchue(t, jour)
    case 'echues': return estEchue(t, jour)
    case 'terminees': return estTerminee(t)
    case 'bloquees': return t.statut === 'bloque'
    default: return true
  }
}

export function filtrerTaches(taches, { filtre = 'toutes', personne = null, recherche = '', jour, profilsParId = {} }) {
  const q = normaliser(recherche)
  return taches.filter((t) => {
    if (!correspondStatut(t, filtre, jour)) return false
    if (personne === 'aucun' && t.attribues.length) return false
    if (personne && personne !== 'aucun' && !t.attribues.includes(personne)) return false
    if (q) {
      const noms = t.attribues.map((id) => profilsParId[id]?.nom_complet || '').join(' ')
      const texte = normaliser(`${t.numero} n°${t.numero} ${t.intitule} ${t.description || ''} ${noms}`)
      if (!q.split(' ').every((mot) => texte.includes(mot))) return false
    }
    return true
  })
}

export function libelleFiltres({ filtre, personne, recherche, profilsParId, moiId }) {
  const morceaux = [FILTRES_STATUT.find((f) => f.cle === filtre)?.libelle || 'Toutes']
  if (personne === moiId) morceaux.push('Mes tâches')
  else if (personne === 'aucun') morceaux.push('Non attribuées')
  else if (personne) morceaux.push(profilsParId[personne]?.nom_complet || '')
  if (recherche) morceaux.push(`« ${recherche} »`)
  return morceaux.join(' · ')
}
