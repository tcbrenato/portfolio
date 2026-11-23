// =====================================================================
//  RAPPELS / NOTIFICATIONS — architecture prête, NON ACTIVÉE
//
//  Pour activer plus tard (voir README, section « Rappels ») :
//   1. VITE_NOTIFICATIONS_ACTIVES=true et VITE_VAPID_PUBLIC_KEY=<clé publique>
//   2. Appliquer 0003_rappels.sql, déployer la fonction Edge « rappels-echeances »
//   3. Planifier l'appel quotidien (pg_cron)
//  Le service worker (public/sw-rappels.js) affiche déjà les notifications reçues.
// =====================================================================
import { supabase } from './supabase'

export const notificationsActives = import.meta.env.VITE_NOTIFICATIONS_ACTIVES === 'true'
const clePubliqueVapid = import.meta.env.VITE_VAPID_PUBLIC_KEY

export function notificationsPrisesEnCharge() {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

function cleEnOctets(base64) {
  const remplissage = '='.repeat((4 - (base64.length % 4)) % 4)
  const brut = atob((base64 + remplissage).replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from([...brut].map((c) => c.charCodeAt(0)))
}

/** Demande l'autorisation puis enregistre l'appareil pour recevoir les rappels. */
export async function activerRappelsSurCetAppareil() {
  if (!notificationsActives) throw new Error('Les rappels ne sont pas encore activés.')
  if (!notificationsPrisesEnCharge()) throw new Error("Ce navigateur ne prend pas en charge les notifications.")
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') throw new Error('Notifications refusées sur cet appareil.')

  const enregistrement = await navigator.serviceWorker.ready
  const abonnement =
    (await enregistrement.pushManager.getSubscription()) ||
    (await enregistrement.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: cleEnOctets(clePubliqueVapid) }))

  const { endpoint, keys } = abonnement.toJSON()
  const { error } = await supabase.from('abonnements_push').upsert(
    { endpoint, p256dh: keys.p256dh, auth: keys.auth, appareil: navigator.userAgent.slice(0, 200) },
    { onConflict: 'endpoint' }
  )
  if (error) throw error
}

export async function desactiverRappelsSurCetAppareil() {
  if (!notificationsPrisesEnCharge()) return
  const enregistrement = await navigator.serviceWorker.ready
  const abonnement = await enregistrement.pushManager.getSubscription()
  if (!abonnement) return
  await supabase.from('abonnements_push').delete().eq('endpoint', abonnement.endpoint)
  await abonnement.unsubscribe()
}

/** Préférences : rappel 48 h avant l'échéance, rappel tâche échue. */
export async function enregistrerPreferences(profilId, { echeance_48h = true, tache_echue = true, canal = 'push' }) {
  const { error } = await supabase
    .from('preferences_rappels')
    .upsert({ profil_id: profilId, echeance_48h, tache_echue, canal, modifie_le: new Date().toISOString() })
  if (error) throw error
}
