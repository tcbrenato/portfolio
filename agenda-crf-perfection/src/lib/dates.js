// Dates de l'agenda : stockées au format ISO « aaaa-mm-jj » (type date Postgres),
// affichées au format « jj/mm/aaaa », calculées dans le fuseau Africa/Porto-Novo.

export const FUSEAU = 'Africa/Porto-Novo'

const formatIso = new Intl.DateTimeFormat('en-CA', {
  timeZone: FUSEAU, year: 'numeric', month: '2-digit', day: '2-digit'
})

/** Date du jour à Porto-Novo, « aaaa-mm-jj ». */
export function aujourdhui(maintenant = new Date()) {
  const p = Object.fromEntries(formatIso.formatToParts(maintenant).map((x) => [x.type, x.value]))
  return `${p.year}-${p.month}-${p.day}`
}

function versUTC(iso) {
  const [a, m, j] = iso.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1, j))
}

function depuisUTC(d) {
  return d.toISOString().slice(0, 10)
}

export function ajouterJours(iso, n) {
  const d = versUTC(iso)
  d.setUTCDate(d.getUTCDate() + n)
  return depuisUTC(d)
}

/** Nombre de jours de « de » à « a » (positif si « a » est après). */
export function ecartJours(de, a) {
  return Math.round((versUTC(a) - versUTC(de)) / 86400000)
}

export function finDuMois(iso) {
  const d = versUTC(iso)
  return depuisUTC(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)))
}

/** « aaaa-mm-jj » → « jj/mm/aaaa » */
export function formaterDate(iso) {
  if (!iso) return '—'
  const [a, m, j] = String(iso).slice(0, 10).split('-')
  return `${j}/${m}/${a}`
}

const formatLong = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
})
/** « lundi 23 novembre 2026 » */
export function formaterDateLongue(iso) {
  return formatLong.format(versUTC(iso))
}

const formatMois = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' })
export function formaterMois(iso) {
  return formatMois.format(versUTC(iso))
}

const formatHorodatage = new Intl.DateTimeFormat('fr-FR', {
  timeZone: FUSEAU, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
})
/** Horodatage (timestamptz) → « jj/mm/aaaa à hh:mm » (heure de Porto-Novo) */
export function formaterHorodatage(ts) {
  if (!ts) return ''
  return formatHorodatage.format(new Date(ts)).replace(' ', ' à ').replace(',', '')
}

/** Jour de la semaine (0 = lundi … 6 = dimanche) */
export function jourSemaine(iso) {
  return (versUTC(iso).getUTCDay() + 6) % 7
}

/**
 * Interprète une date saisie ou importée : « jj/mm/aaaa », « jj-mm-aa »,
 * « aaaa-mm-jj », objet Date, ou numéro de série Excel. Retourne « aaaa-mm-jj » ou null.
 */
export function analyserDate(valeur) {
  if (valeur === null || valeur === undefined || valeur === '') return null
  if (valeur instanceof Date && !isNaN(valeur)) {
    // read-excel-file renvoie des dates UTC à minuit
    return depuisUTC(new Date(Date.UTC(valeur.getUTCFullYear(), valeur.getUTCMonth(), valeur.getUTCDate())))
  }
  if (typeof valeur === 'number' && valeur > 20000 && valeur < 80000) {
    const d = new Date(Date.UTC(1899, 11, 30))
    d.setUTCDate(d.getUTCDate() + Math.floor(valeur))
    return depuisUTC(d)
  }
  const s = String(valeur).trim()
  let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/)
  if (m) return valider(+m[1], +m[2], +m[3])
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/)
  if (m) {
    let annee = +m[3]
    if (annee < 100) annee += 2000
    return valider(annee, +m[2], +m[1])
  }
  return null
}

function valider(a, m, j) {
  if (m < 1 || m > 12 || j < 1 || j > 31) return null
  const d = new Date(Date.UTC(a, m - 1, j))
  if (d.getUTCMonth() !== m - 1) return null
  return depuisUTC(d)
}
