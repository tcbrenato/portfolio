// Import d'une liste initiale de tâches depuis un fichier CSV ou Excel (.xlsx)
// Colonnes reconnues : N° | Tâche | Date | Échéance | Attributaire (+ Statut, Description facultatifs)
import { analyserDate } from './dates'
import { normaliser } from './texte'

const COLONNES = {
  numero: ['n°', 'n', 'no', 'num', 'numero', 'n° tache', 'numero tache', '#'],
  intitule: ['tache', 'taches', 'intitule', 'libelle', 'designation', 'objet', 'activite', 'point'],
  date_creation: ['date', 'date de creation', 'date creation', 'cree le', 'date d\'inscription'],
  echeance: ['echeance', 'date d\'echeance', 'date limite', 'delai', 'date butoir', 'deadline'],
  attributaire: ['attributaire', 'attributaires', 'responsable', 'responsables', 'assigne a', 'charge', 'en charge', 'porteur', 'qui'],
  statut: ['statut', 'etat', 'situation'],
  description: ['description', 'details', 'observation', 'observations', 'commentaire', 'commentaires']
}

function colonneDe(entete) {
  const e = normaliser(entete).replace(/[:.]/g, '').trim()
  for (const [cle, synonymes] of Object.entries(COLONNES)) {
    if (synonymes.includes(e)) return cle
  }
  if (/^n\s*°|^num/.test(e)) return 'numero'
  if (/echeanc/.test(e)) return 'echeance'
  if (/attribu|responsab/.test(e)) return 'attributaire'
  if (/tache|intitul/.test(e)) return 'intitule'
  return null
}

const STATUTS_TEXTE = {
  'a faire': 'a_faire', 'afaire': 'a_faire', 'non demarre': 'a_faire', 'en attente': 'a_faire',
  'en cours': 'en_cours', 'encours': 'en_cours',
  'termine': 'termine', 'terminee': 'termine', 'fait': 'termine', 'fait(e)': 'termine', 'realise': 'termine', 'realisee': 'termine', 'ok': 'termine',
  'bloque': 'bloque', 'bloquee': 'bloque', 'suspendu': 'bloque'
}

// ------------------------------ Lecture ------------------------------
function decoderTexte(tampon) {
  const utf8 = new TextDecoder('utf-8').decode(tampon)
  // fichier enregistré par Excel en « CSV (séparateur : point-virgule) » : souvent en Windows-1252
  return utf8.includes('�') ? new TextDecoder('windows-1252').decode(tampon) : utf8.replace(/^﻿/, '')
}

export function analyserCSV(texte) {
  const premiereLigne = texte.split(/\r?\n/)[0] || ''
  const separateur = [';', '\t', ','].reduce((meilleur, s) =>
    premiereLigne.split(s).length > premiereLigne.split(meilleur).length ? s : meilleur, ';')
  const lignes = []
  let ligne = []
  let champ = ''
  let guillemets = false
  for (let i = 0; i < texte.length; i++) {
    const c = texte[i]
    if (guillemets) {
      if (c === '"' && texte[i + 1] === '"') { champ += '"'; i++ }
      else if (c === '"') guillemets = false
      else champ += c
    } else if (c === '"') guillemets = true
    else if (c === separateur) { ligne.push(champ); champ = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && texte[i + 1] === '\n') i++
      ligne.push(champ); lignes.push(ligne); ligne = []; champ = ''
    } else champ += c
  }
  if (champ || ligne.length) { ligne.push(champ); lignes.push(ligne) }
  return lignes
}

export async function lireFichier(fichier) {
  const nom = fichier.name.toLowerCase()
  if (nom.endsWith('.xlsx')) {
    const { readSheet } = await import('read-excel-file/browser')
    return await readSheet(fichier)
  }
  if (nom.endsWith('.csv') || nom.endsWith('.txt')) {
    return analyserCSV(decoderTexte(await fichier.arrayBuffer()))
  }
  if (nom.endsWith('.xls')) {
    throw new Error('Format .xls (ancien Excel) non pris en charge : dans Excel, faites « Enregistrer sous » > Classeur Excel (.xlsx) ou CSV.')
  }
  throw new Error('Format non reconnu. Utilisez un fichier .xlsx ou .csv.')
}

// --------------------------- Correspondances ---------------------------
/** Associe un nom saisi (« Koffi », « K. Agbodjan », « Koffi AGBODJAN ») à un profil. */
export function trouverProfil(nomSaisi, profils) {
  const n = normaliser(nomSaisi).replace(/\./g, '')
  if (!n) return null
  const exact = profils.filter((p) => normaliser(p.nom_complet) === n)
  if (exact.length === 1) return exact[0]
  const mots = n.split(' ').filter((m) => m.length > 1)
  const contient = profils.filter((p) => {
    const nomP = normaliser(p.nom_complet).split(' ')
    return mots.length && mots.every((m) => nomP.some((x) => x === m || x.startsWith(m)))
  })
  if (contient.length === 1) return contient[0]
  const email = profils.filter((p) => normaliser(p.email) === n)
  return email.length === 1 ? email[0] : null
}

function decouperNoms(valeur) {
  return String(valeur ?? '')
    .split(/[,;/+&\n]| et /i)
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Transforme les lignes brutes en tâches prêtes à importer, avec erreurs/avertissements.
 * @returns {{ colonnes: object, lignes: Array }}
 */
export function preparerImport(brut, profils, numerosExistants) {
  // ligne d'en-tête : la première qui contient une colonne « Tâche »
  const indexEntete = brut.findIndex((l) => l.some((c) => colonneDe(c ?? '') === 'intitule'))
  if (indexEntete === -1) {
    throw new Error('Colonne « Tâche » introuvable. La première ligne doit contenir les titres : N°, Tâche, Date, Échéance, Attributaire.')
  }
  const colonnes = {}
  brut[indexEntete].forEach((c, i) => {
    const cle = colonneDe(c ?? '')
    if (cle && colonnes[cle] === undefined) colonnes[cle] = i
  })

  const vus = new Set()
  const lignes = brut
    .slice(indexEntete + 1)
    .filter((l) => l.some((c) => c !== null && String(c).trim() !== ''))
    .map((l, i) => {
      const val = (cle) => (colonnes[cle] === undefined ? null : l[colonnes[cle]])
      const erreurs = []
      const avertissements = []

      const intitule = String(val('intitule') ?? '').trim()
      if (!intitule) erreurs.push('Intitulé vide')

      let numero = null
      const numBrut = val('numero')
      if (numBrut !== null && String(numBrut).trim() !== '') {
        numero = parseInt(String(numBrut).replace(/[^\d]/g, ''), 10)
        if (!numero || numero < 1) { avertissements.push('N° illisible : numérotation automatique'); numero = null }
        else if (numerosExistants.has(numero) || vus.has(numero)) { avertissements.push(`N° ${numero} déjà utilisé : numérotation automatique`); numero = null }
        else vus.add(numero)
      }

      const dateBrute = val('date_creation')
      const date_creation = analyserDate(dateBrute)
      if (dateBrute && !date_creation) avertissements.push(`Date « ${dateBrute} » illisible : date du jour`)

      const echBrute = val('echeance')
      const echeance = analyserDate(echBrute)
      if (echBrute && !echeance) erreurs.push(`Échéance « ${echBrute} » illisible (format jj/mm/aaaa)`)
      if (!echBrute) avertissements.push('Sans échéance')

      const attribues = []
      const inconnus = []
      for (const nom of decouperNoms(val('attributaire'))) {
        const p = trouverProfil(nom, profils)
        if (p) { if (!attribues.includes(p.id)) attribues.push(p.id) } else inconnus.push(nom)
      }
      if (inconnus.length) avertissements.push(`Attributaire inconnu : ${inconnus.join(', ')}`)

      const statut = STATUTS_TEXTE[normaliser(val('statut'))] || 'a_faire'
      const description = String(val('description') ?? '').trim() || null

      return { ligne: indexEntete + i + 2, numero, intitule, date_creation, echeance, attribues, statut, description, erreurs, avertissements }
    })

  return { colonnes, lignes }
}

export const MODELE_CSV =
  'N°;Tâche;Date;Échéance;Attributaire\r\n' +
  '1;Préparer le rapport mensuel;02/11/2026;30/11/2026;Prénom Nom\r\n' +
  '2;Relancer les fournisseurs;05/11/2026;15/11/2026;Prénom Nom, Autre Personne\r\n'
