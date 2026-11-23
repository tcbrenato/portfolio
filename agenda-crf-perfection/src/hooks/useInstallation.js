import { useEffect, useState } from 'react'

let invitationMemorisee = null
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    invitationMemorisee = e
  })
}

/** Gestion du bouton « Installer l'application » (Android / ordinateur) et aide iPhone. */
export function useInstallation() {
  const [invitation, setInvitation] = useState(invitationMemorisee)
  const estInstallee =
    typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true)
  const estIOS = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent)

  useEffect(() => {
    const capter = (e) => {
      e.preventDefault()
      invitationMemorisee = e
      setInvitation(e)
    }
    const installee = () => setInvitation(null)
    window.addEventListener('beforeinstallprompt', capter)
    window.addEventListener('appinstalled', installee)
    return () => {
      window.removeEventListener('beforeinstallprompt', capter)
      window.removeEventListener('appinstalled', installee)
    }
  }, [])

  return {
    estInstallee,
    estIOS,
    peutInstaller: Boolean(invitation),
    installer: async () => {
      if (!invitation) return false
      invitation.prompt()
      const { outcome } = await invitation.userChoice
      invitationMemorisee = null
      setInvitation(null)
      return outcome === 'accepted'
    }
  }
}
