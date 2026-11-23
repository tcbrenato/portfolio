import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [messages, setMessages] = useState([])
  const compteur = useRef(0)

  const retirer = useCallback((id) => setMessages((m) => m.filter((x) => x.id !== id)), [])

  const afficher = useCallback(
    (texte, { type = 'info', action, duree = 3500 } = {}) => {
      const id = ++compteur.current
      setMessages((m) => [...m.slice(-2), { id, texte, type, action }])
      setTimeout(() => retirer(id), action ? Math.max(duree, 5000) : duree)
    },
    [retirer]
  )

  const valeur = useMemo(
    () => ({
      info: (t, o) => afficher(t, { ...o, type: 'info' }),
      erreur: (t, o) => afficher(t, { duree: 5000, ...o, type: 'erreur' })
    }),
    [afficher]
  )

  return (
    <ToastContext.Provider value={valeur}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={`toast ${m.type === 'erreur' ? 'toast--erreur' : ''}`}>
            <span>{m.texte}</span>
            {m.action && (
              <button
                type="button"
                onClick={() => {
                  m.action.onClick()
                  retirer(m.id)
                }}
              >
                {m.action.libelle}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
