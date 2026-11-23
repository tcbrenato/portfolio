import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { chargerProfils, chargerTaches } from '../lib/api'
import { aujourdhui } from '../lib/dates'

const DonneesContext = createContext(null)
const INTERVALLE_MIN_RAFRAICHISSEMENT = 30_000

/**
 * Charge une seule fois les tâches et les profils de l'équipe, puis les garde
 * en mémoire (économie de données mobiles). Rafraîchissement automatique
 * lorsque l'application revient au premier plan.
 */
export function DonneesProvider({ children }) {
  const [taches, setTaches] = useState([])
  const [profils, setProfils] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)
  const [jour, setJour] = useState(aujourdhui())
  const dernierChargement = useRef(0)

  const recharger = useCallback(async () => {
    try {
      setErreur(null)
      const [t, p] = await Promise.all([chargerTaches(), chargerProfils()])
      setTaches(t)
      setProfils(p)
      dernierChargement.current = Date.now()
    } catch (e) {
      setErreur(e)
    } finally {
      setChargement(false)
      setJour(aujourdhui())
    }
  }, [])

  useEffect(() => {
    recharger()
    const auRetour = () => {
      if (document.visibilityState === 'visible' && Date.now() - dernierChargement.current > INTERVALLE_MIN_RAFRAICHISSEMENT) {
        recharger()
      }
    }
    document.addEventListener('visibilitychange', auRetour)
    window.addEventListener('online', recharger)
    return () => {
      document.removeEventListener('visibilitychange', auRetour)
      window.removeEventListener('online', recharger)
    }
  }, [recharger])

  const majTache = useCallback((id, champs) => {
    setTaches((liste) => liste.map((t) => (t.id === id ? { ...t, ...champs } : t)))
  }, [])

  const remplacerTache = useCallback((tache) => {
    setTaches((liste) => {
      const existe = liste.some((t) => t.id === tache.id)
      return existe ? liste.map((t) => (t.id === tache.id ? tache : t)) : [...liste, tache]
    })
  }, [])

  const retirerTache = useCallback((id) => setTaches((liste) => liste.filter((t) => t.id !== id)), [])

  const majProfil = useCallback((profil) => {
    setProfils((liste) => liste.map((p) => (p.id === profil.id ? { ...p, ...profil } : p)))
  }, [])

  const valeur = useMemo(() => {
    const profilsParId = Object.fromEntries(profils.map((p) => [p.id, p]))
    return {
      taches,
      profils,
      profilsActifs: profils.filter((p) => p.actif),
      profilsParId,
      chargement,
      erreur,
      jour,
      recharger,
      majTache,
      remplacerTache,
      retirerTache,
      majProfil
    }
  }, [taches, profils, chargement, erreur, jour, recharger, majTache, remplacerTache, retirerTache, majProfil])

  return <DonneesContext.Provider value={valeur}>{children}</DonneesContext.Provider>
}

export function useDonnees() {
  return useContext(DonneesContext)
}
