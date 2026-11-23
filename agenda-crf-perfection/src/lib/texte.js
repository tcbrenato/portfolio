/** Minuscules, sans accents ni espaces superflus (recherche, correspondance de noms). */
export function normaliser(s) {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export function initiales(nom) {
  const mots = String(nom || '?').trim().split(/\s+/).filter(Boolean)
  if (mots.length === 0) return '?'
  if (mots.length === 1) return mots[0].slice(0, 2).toUpperCase()
  return (mots[0][0] + mots[mots.length - 1][0]).toUpperCase()
}

export function prenom(nom) {
  return String(nom || '').trim().split(/\s+/)[0] || ''
}

/** « Jean Dupont » → « Jean D. » (affichage compact sur mobile) */
export function nomCourt(nom) {
  const mots = String(nom || '').trim().split(/\s+/).filter(Boolean)
  if (mots.length <= 1) return mots[0] || ''
  return `${mots[0]} ${mots[mots.length - 1][0]}.`
}

export function pluriel(n, singulier, plurielForme = singulier + 's') {
  return `${n} ${n > 1 ? plurielForme : singulier}`
}

/** Première lettre en majuscule (« lundi 23 novembre » → « Lundi 23 novembre ») */
export function majuscule(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
}
