import { useEffect, useState } from 'react'

export function useMediaQuery(requete) {
  const [correspond, setCorrespond] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(requete).matches : false
  )
  useEffect(() => {
    const mq = window.matchMedia(requete)
    const maj = () => setCorrespond(mq.matches)
    maj()
    mq.addEventListener('change', maj)
    return () => mq.removeEventListener('change', maj)
  }, [requete])
  return correspond
}

/** Vrai sur ordinateur / tablette paysage (≥ 900 px) */
export function useEstOrdinateur() {
  return useMediaQuery('(min-width: 900px)')
}
