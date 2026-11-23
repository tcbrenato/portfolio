import { supabase } from './supabase'

/** Traduit les erreurs techniques en messages compréhensibles. */
export function messageErreur(e) {
  const brut = String(e?.message || e || '')
  if (/Failed to fetch|NetworkError|Load failed|network/i.test(brut)) {
    return 'Connexion impossible. Vérifiez votre réseau puis réessayez.'
  }
  if (/Invalid login credentials/i.test(brut)) return 'Email ou mot de passe incorrect.'
  if (/Email not confirmed/i.test(brut)) return "Votre compte n'est pas encore activé. Utilisez le lien reçu par email."
  if (/User is banned|banned/i.test(brut)) return 'Votre compte a été désactivé. Contactez la Direction.'
  if (/row-level security|permission denied|violates row-level/i.test(brut)) {
    return "Action non autorisée pour votre compte."
  }
  if (/duplicate key.*numero/i.test(brut)) return 'Ce numéro de tâche est déjà utilisé.'
  if (/JWT expired|invalid JWT/i.test(brut)) return 'Votre session a expiré. Reconnectez-vous.'
  if (/Password should be at least/i.test(brut)) return 'Le mot de passe doit contenir au moins 8 caractères.'
  if (/same password|different from the old/i.test(brut)) return "Le nouveau mot de passe doit être différent de l'ancien."
  if (/rate limit|too many/i.test(brut)) return 'Trop de tentatives. Patientez quelques minutes.'
  return brut || 'Une erreur est survenue.'
}

function verifier({ data, error }) {
  if (error) throw error
  return data
}

// ------------------------------- Profils -------------------------------
export async function chargerProfils() {
  return verifier(await supabase.from('profils').select('*').order('nom_complet'))
}

export async function chargerProfil(id) {
  return verifier(await supabase.from('profils').select('*').eq('id', id).maybeSingle())
}

export async function modifierProfil(id, champs) {
  return verifier(await supabase.from('profils').update(champs).eq('id', id).select().single())
}

// ------------------------------- Tâches --------------------------------
const SELECTION_TACHE = '*, attributions(profil_id)'

function enrichir(t) {
  const { attributions, ...reste } = t
  return { ...reste, attribues: (attributions || []).map((a) => a.profil_id) }
}

export async function chargerTaches() {
  const data = verifier(
    await supabase.from('taches').select(SELECTION_TACHE).order('numero', { ascending: true }).limit(5000)
  )
  return data.map(enrichir)
}

export async function chargerTache(id) {
  const data = verifier(await supabase.from('taches').select(SELECTION_TACHE).eq('id', id).maybeSingle())
  return data ? enrichir(data) : null
}

async function synchroniserAttributions(tacheId, nouveaux, anciens = []) {
  const aAjouter = nouveaux.filter((id) => !anciens.includes(id))
  const aRetirer = anciens.filter((id) => !nouveaux.includes(id))
  if (aRetirer.length) {
    verifier(await supabase.from('attributions').delete().eq('tache_id', tacheId).in('profil_id', aRetirer))
  }
  if (aAjouter.length) {
    verifier(await supabase.from('attributions').insert(aAjouter.map((profil_id) => ({ tache_id: tacheId, profil_id }))))
  }
}

export async function creerTache(champs, attribues = []) {
  const tache = verifier(await supabase.from('taches').insert(champs).select().single())
  await synchroniserAttributions(tache.id, attribues)
  return chargerTache(tache.id)
}

export async function modifierTache(id, champs, attribues, anciensAttribues) {
  if (champs && Object.keys(champs).length) {
    verifier(await supabase.from('taches').update(champs).eq('id', id).select('id').single())
  }
  if (attribues) await synchroniserAttributions(id, attribues, anciensAttribues)
  return chargerTache(id)
}

export async function changerStatut(id, statut) {
  const data = verifier(await supabase.from('taches').update({ statut }).eq('id', id).select('id, statut, date_terminee, modifie_le'))
  if (!data.length) throw new Error('permission denied')
  return data[0]
}

export async function supprimerTache(id) {
  const data = verifier(await supabase.from('taches').delete().eq('id', id).select('id'))
  if (!data.length) throw new Error('permission denied')
}

// ---------------------- Commentaires & historique ----------------------
export async function chargerCommentaires(tacheId) {
  return verifier(await supabase.from('commentaires').select('*').eq('tache_id', tacheId).order('date'))
}

export async function ajouterCommentaire(tacheId, texte) {
  return verifier(await supabase.from('commentaires').insert({ tache_id: tacheId, texte }).select().single())
}

export async function supprimerCommentaire(id) {
  verifier(await supabase.from('commentaires').delete().eq('id', id))
}

export async function chargerHistorique(tacheId) {
  return verifier(await supabase.from('historique').select('*').eq('tache_id', tacheId).order('date', { ascending: false }))
}

// ------------------------- Gestion des membres -------------------------
/** Appelle la fonction Edge « admin-membres » (invitation, désactivation…). */
export async function adminMembres(action, donnees = {}) {
  const { data, error } = await supabase.functions.invoke('admin-membres', {
    body: { action, redirectTo: window.location.origin, ...donnees }
  })
  if (error) {
    let message = error.message
    try {
      const corps = await error.context?.json?.()
      if (corps?.erreur) message = corps.erreur
    } catch { /* réponse non JSON */ }
    if (/Failed to send a request|Function not found|404/i.test(message)) {
      message = "La fonction « admin-membres » n'est pas déployée sur Supabase (voir README)."
    }
    throw new Error(message)
  }
  if (data?.erreur) throw new Error(data.erreur)
  return data
}
