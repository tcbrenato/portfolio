import { useEffect, useRef } from 'react'
import { IconeFermer } from './Icones'

/** Feuille qui monte du bas de l'écran (mobile) / boîte de dialogue centrée (ordinateur). */
export default function FeuilleBas({ ouvert, titre, onFermer, children }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ouvert) return
    const auClavier = (e) => e.key === 'Escape' && onFermer()
    document.addEventListener('keydown', auClavier)
    const ancienDebordement = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusPrecedent = document.activeElement
    // met le focus dans la feuille (sauf si un champ s'en charge avec autoFocus)
    setTimeout(() => {
      if (ref.current && !ref.current.contains(document.activeElement)) ref.current.focus()
    }, 30)
    return () => {
      document.removeEventListener('keydown', auClavier)
      document.body.style.overflow = ancienDebordement
      focusPrecedent?.focus?.()
    }
  }, [ouvert, onFermer])

  if (!ouvert) return null
  return (
    <div className="voile" onMouseDown={(e) => e.target === e.currentTarget && onFermer()}>
      <div className="feuille" role="dialog" aria-modal="true" aria-label={titre} ref={ref} tabIndex={-1}>
        <div className="feuille__poignee" />
        <div className="feuille__entete">
          <h2 className="feuille__titre">{titre}</h2>
          <button type="button" className="btn-icone" onClick={onFermer} aria-label="Fermer">
            <IconeFermer />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
