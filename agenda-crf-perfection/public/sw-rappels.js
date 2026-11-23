/* Agenda CRF Perfection — gestion des notifications push dans le service worker.
   Inactif tant que les rappels ne sont pas activés (aucun abonnement push n'est créé). */
self.addEventListener('push', (event) => {
  let donnees = {}
  try { donnees = event.data ? event.data.json() : {} } catch (e) { donnees = { corps: event.data && event.data.text() } }
  const titre = donnees.titre || 'Agenda CRF Perfection'
  event.waitUntil(
    self.registration.showNotification(titre, {
      body: donnees.corps || '',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      lang: 'fr',
      data: { url: donnees.url || '/' }
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((fenetres) => {
      for (const f of fenetres) {
        if ('focus' in f) { f.navigate(url); return f.focus() }
      }
      return self.clients.openWindow(url)
    })
  )
})
