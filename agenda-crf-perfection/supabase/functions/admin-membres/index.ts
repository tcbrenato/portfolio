// =====================================================================
//  Fonction Edge « admin-membres » — Agenda CRF Perfection
//  Réservée au DG et aux administrateurs (vérifié côté serveur).
//
//  Actions (corps JSON) :
//   { action: 'inviter', email, nom_complet, role, poste?, telephone?, redirectTo? }
//   { action: 'renvoyer_invitation', email, redirectTo? }
//   { action: 'desactiver', profil_id }
//   { action: 'reactiver',  profil_id }
//
//  Déploiement :  supabase functions deploy admin-membres
//  (SUPABASE_URL, SUPABASE_ANON_KEY et SUPABASE_SERVICE_ROLE_KEY sont fournies
//   automatiquement par Supabase à la fonction.)
// =====================================================================
import { createClient } from 'npm:@supabase/supabase-js@2'

// En-têtes CORS communs aux fonctions Edge
const enTetesCors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

function reponseJson(corps: unknown, statut = 200) {
  return new Response(JSON.stringify(corps), {
    status: statut,
    headers: { ...enTetesCors, 'Content-Type': 'application/json; charset=utf-8' }
  })
}

const ROLES = ['dg', 'admin', 'membre']
const BANNI = '876000h' // ~100 ans : compte bloqué tant qu'il est désactivé

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: enTetesCors })
  if (req.method !== 'POST') return reponseJson({ erreur: 'Méthode non autorisée' }, 405)

  const url = Deno.env.get('SUPABASE_URL')!
  const cleAnon = Deno.env.get('SUPABASE_ANON_KEY')!
  const cleService = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  // 1) Identifier l'appelant à partir de son jeton
  const jeton = (req.headers.get('Authorization') ?? '').replace('Bearer ', '')
  if (!jeton) return reponseJson({ erreur: 'Non connecté' }, 401)

  const clientAppelant = createClient(url, cleAnon, { global: { headers: { Authorization: `Bearer ${jeton}` } } })
  const { data: { user }, error: erreurUtilisateur } = await clientAppelant.auth.getUser(jeton)
  if (erreurUtilisateur || !user) return reponseJson({ erreur: 'Session invalide' }, 401)

  const admin = createClient(url, cleService, { auth: { persistSession: false, autoRefreshToken: false } })

  const { data: appelant } = await admin.from('profils').select('id, role, actif').eq('id', user.id).single()
  if (!appelant || !appelant.actif || !['dg', 'admin'].includes(appelant.role)) {
    return reponseJson({ erreur: 'Action réservée au DG et aux administrateurs' }, 403)
  }

  let corps: Record<string, string>
  try {
    corps = await req.json()
  } catch {
    return reponseJson({ erreur: 'Requête invalide' }, 400)
  }

  try {
    switch (corps.action) {
      case 'inviter': {
        const email = String(corps.email ?? '').trim().toLowerCase()
        const nom = String(corps.nom_complet ?? '').trim()
        const role = ROLES.includes(corps.role) ? corps.role : 'membre'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reponseJson({ erreur: 'Adresse email invalide' }, 400)
        if (!nom) return reponseJson({ erreur: 'Le nom complet est obligatoire' }, 400)
        if (role === 'dg' && appelant.role !== 'dg') return reponseJson({ erreur: 'Seul le DG peut inviter un DG' }, 403)

        const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
          data: { nom_complet: nom },
          redirectTo: corps.redirectTo || undefined
        })
        if (error) {
          const message = /already|registered|exists/i.test(error.message)
            ? 'Un compte existe déjà avec cet email'
            : error.message
          return reponseJson({ erreur: message }, 400)
        }

        // Le profil est créé par le trigger ; on complète rôle et informations
        const { error: erreurProfil } = await admin.from('profils').update({
          nom_complet: nom,
          role,
          poste: corps.poste?.trim() || null,
          telephone: corps.telephone?.trim() || null,
          actif: true
        }).eq('id', data.user.id)
        if (erreurProfil) return reponseJson({ erreur: erreurProfil.message }, 400)

        return reponseJson({ ok: true, profil_id: data.user.id })
      }

      case 'renvoyer_invitation': {
        const email = String(corps.email ?? '').trim().toLowerCase()
        const { error } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo: corps.redirectTo || undefined })
        if (error) {
          // Compte déjà confirmé : on envoie plutôt un lien de réinitialisation du mot de passe
          const { error: e2 } = await clientAppelant.auth.resetPasswordForEmail(email, { redirectTo: corps.redirectTo || undefined })
          if (e2) return reponseJson({ erreur: e2.message }, 400)
          return reponseJson({ ok: true, message: 'Lien de réinitialisation du mot de passe envoyé' })
        }
        return reponseJson({ ok: true, message: 'Invitation renvoyée' })
      }

      case 'desactiver':
      case 'reactiver': {
        const cible = String(corps.profil_id ?? '')
        if (!cible) return reponseJson({ erreur: 'Membre non précisé' }, 400)
        if (cible === appelant.id) return reponseJson({ erreur: 'Vous ne pouvez pas modifier votre propre accès' }, 400)

        const { data: profilCible } = await admin.from('profils').select('role').eq('id', cible).single()
        if (!profilCible) return reponseJson({ erreur: 'Membre introuvable' }, 404)
        if (profilCible.role === 'dg' && appelant.role !== 'dg') {
          return reponseJson({ erreur: 'Seul le DG peut modifier l\'accès d\'un DG' }, 403)
        }

        const actif = corps.action === 'reactiver'
        if (!actif && profilCible.role === 'dg') {
          const { count } = await admin.from('profils').select('id', { count: 'exact', head: true })
            .eq('role', 'dg').eq('actif', true).neq('id', cible)
          if (!count) return reponseJson({ erreur: 'Il doit rester au moins un DG actif' }, 400)
        }

        const { error: e1 } = await admin.from('profils').update({ actif }).eq('id', cible)
        if (e1) return reponseJson({ erreur: e1.message }, 400)
        const { error: e2 } = await admin.auth.admin.updateUserById(cible, { ban_duration: actif ? 'none' : BANNI })
        if (e2) return reponseJson({ erreur: e2.message }, 400)
        return reponseJson({ ok: true })
      }

      default:
        return reponseJson({ erreur: 'Action inconnue' }, 400)
    }
  } catch (e) {
    return reponseJson({ erreur: (e as Error).message ?? 'Erreur inattendue' }, 500)
  }
})
