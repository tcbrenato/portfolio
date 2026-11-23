// =====================================================================
//  Fonction Edge « rappels-echeances » — Agenda CRF Perfection
//
//  ⚠ ARCHITECTURE PRÊTE, NON ACTIVÉE.
//  Tant que le secret RAPPELS_ACTIFS ne vaut pas "true", la fonction
//  se contente de LISTER les rappels qui seraient envoyés (mode simulation).
//
//  Rappels gérés :
//    - « echeance_48h » : tâche non terminée dont l'échéance tombe dans les 48 h
//    - « echue »        : tâche non terminée dont l'échéance est dépassée
//  Chaque rappel n'est envoyé qu'une fois par attributaire (table journal_rappels).
//
//  Pour l'activer plus tard :
//    1. Générer des clés VAPID :  npx web-push generate-vapid-keys
//    2. supabase secrets set VAPID_PUBLIC_KEY=... VAPID_PRIVATE_KEY=... VAPID_SUJET=mailto:contact@exemple.com RAPPELS_ACTIFS=true
//    3. supabase functions deploy rappels-echeances
//    4. Décommenter la planification pg_cron en bas de 0003_rappels.sql
//    5. Côté application : VITE_NOTIFICATIONS_ACTIVES=true et VITE_VAPID_PUBLIC_KEY=...
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

type Rappel = {
  tache_id: string
  numero: number
  intitule: string
  echeance: string
  profil_id: string
  nom_complet: string
  type: 'echeance_48h' | 'echue'
}

function formaterDate(iso: string) {
  const [a, m, j] = iso.split('-')
  return `${j}/${m}/${a}`
}

function message(r: Rappel) {
  return r.type === 'echue'
    ? { titre: `Tâche N° ${r.numero} échue`, corps: `« ${r.intitule} » devait être terminée le ${formaterDate(r.echeance)}.` }
    : { titre: `Échéance proche : N° ${r.numero}`, corps: `« ${r.intitule} » arrive à échéance le ${formaterDate(r.echeance)}.` }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: enTetesCors })

  const url = Deno.env.get('SUPABASE_URL')!
  const cleService = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const actifs = Deno.env.get('RAPPELS_ACTIFS') === 'true'

  // Seul un appel avec la clé service_role (pg_cron) est accepté
  const jeton = (req.headers.get('Authorization') ?? '').replace('Bearer ', '')
  if (jeton !== cleService) return reponseJson({ erreur: 'Non autorisé' }, 401)

  const admin = createClient(url, cleService, { auth: { persistSession: false } })
  const { data, error } = await admin.rpc('rappels_a_envoyer')
  if (error) return reponseJson({ erreur: error.message }, 500)
  const rappels = (data ?? []) as Rappel[]

  if (!actifs) {
    return reponseJson({ mode: 'simulation', nombre: rappels.length, rappels: rappels.map((r) => ({ ...r, ...message(r) })) })
  }

  // ---- Envoi réel (Web Push) ----
  const webpush = (await import('npm:web-push@3')).default
  webpush.setVapidDetails(
    Deno.env.get('VAPID_SUJET') ?? 'mailto:contact@exemple.com',
    Deno.env.get('VAPID_PUBLIC_KEY')!,
    Deno.env.get('VAPID_PRIVATE_KEY')!
  )

  let envoyes = 0
  for (const r of rappels) {
    const { data: abonnements } = await admin.from('abonnements_push').select('*').eq('profil_id', r.profil_id)
    const { titre, corps } = message(r)
    for (const a of abonnements ?? []) {
      try {
        await webpush.sendNotification(
          { endpoint: a.endpoint, keys: { p256dh: a.p256dh, auth: a.auth } },
          JSON.stringify({ titre, corps, url: `/taches/${r.tache_id}` })
        )
        envoyes++
      } catch (e) {
        // Abonnement expiré : on le supprime
        if ((e as { statusCode?: number }).statusCode === 410) await admin.from('abonnements_push').delete().eq('id', a.id)
      }
    }
    await admin.from('journal_rappels').insert({ tache_id: r.tache_id, profil_id: r.profil_id, type: r.type })
  }

  return reponseJson({ mode: 'reel', rappels: rappels.length, notifications_envoyees: envoyes })
})
