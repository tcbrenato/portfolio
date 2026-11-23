import { aujourdhui, ecartJours } from './dates'

export const STATUTS = {
  a_faire: { libelle: 'À faire' },
  en_cours: { libelle: 'En cours' },
  bloque: { libelle: 'Bloquée' },
  termine: { libelle: 'Terminée' }
}
export const ORDRE_STATUTS = ['a_faire', 'en_cours', 'bloque', 'termine']

export const ROLES = {
  dg: 'Directeur Général',
  admin: 'Administrateur',
  membre: 'Membre'
}

export function estTerminee(t) {
  return t.statut === 'termine'
}

/** Échue : échéance passée et tâche non terminée. */
export function estEchue(t, jour = aujourdhui()) {
  return !estTerminee(t) && Boolean(t.echeance) && t.echeance < jour
}

/** Tâche en cours au sens du tableau de bord (non terminée et non échue). */
export function estEnCours(t, jour = aujourdhui()) {
  return t.statut === 'en_cours' && !estEchue(t, jour)
}

/** Délai calculé automatiquement. */
export function delai(t, jour = aujourdhui()) {
  if (estTerminee(t)) return { texte: 'Terminé', classe: 'delai--termine', jours: null }
  if (!t.echeance) return { texte: 'Sans échéance', classe: '', jours: null }
  const n = ecartJours(jour, t.echeance)
  if (n > 0) return { texte: `Dans ${n} j`, classe: n <= 7 ? 'delai--bientot' : '', jours: n }
  if (n === 0) return { texte: "Aujourd'hui", classe: 'delai--aujourdhui', jours: 0 }
  return { texte: `Échu depuis ${-n} j`, classe: 'delai--echu', jours: n }
}

/** Tri par défaut : non terminées d'abord, échéance la plus proche, puis N°. */
export function trierParEcheance(a, b) {
  const ta = estTerminee(a) ? 1 : 0
  const tb = estTerminee(b) ? 1 : 0
  if (ta !== tb) return ta - tb
  if (ta === 1) return (b.date_terminee || '').localeCompare(a.date_terminee || '') || b.numero - a.numero
  const ea = a.echeance || '9999-12-31'
  const eb = b.echeance || '9999-12-31'
  return ea.localeCompare(eb) || (b.priorite === 'haute') - (a.priorite === 'haute') || a.numero - b.numero
}

export function trierParNumero(a, b) {
  return a.numero - b.numero
}
