import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, typeLienInitial } from '../lib/supabase'
import { chargerProfil } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profil, setProfil] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [erreurProfil, setErreurProfil] = useState(null)
  // Après un lien d'invitation ou « mot de passe oublié » : définir un mot de passe
  const [doitDefinirMotDePasse, setDoitDefinirMotDePasse] = useState(
    typeLienInitial === 'invite' || typeLienInitial === 'recovery'
  )

  const lireProfil = useCallback(async (utilisateur) => {
    if (!utilisateur) {
      setProfil(null)
      return
    }
    try {
      setErreurProfil(null)
      setProfil(await chargerProfil(utilisateur.id))
    } catch (e) {
      setErreurProfil(e)
    }
  }, [])

  useEffect(() => {
    let actif = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (!actif) return
      setSession(data.session)
      await lireProfil(data.session?.user)
      if (actif) setChargement(false)
    })

    const { data: abonnement } = supabase.auth.onAuthStateChange((evenement, nouvelleSession) => {
      setSession(nouvelleSession)
      if (evenement === 'PASSWORD_RECOVERY') setDoitDefinirMotDePasse(true)
      if (evenement === 'SIGNED_OUT') {
        setProfil(null)
        setDoitDefinirMotDePasse(false)
      }
      if (evenement === 'SIGNED_IN' || evenement === 'USER_UPDATED') {
        // hors du rappel (recommandation Supabase pour éviter les blocages)
        setTimeout(() => lireProfil(nouvelleSession?.user), 0)
      }
    })
    return () => {
      actif = false
      abonnement.subscription.unsubscribe()
    }
  }, [lireProfil])

  const valeur = useMemo(
    () => ({
      session,
      utilisateur: session?.user ?? null,
      profil,
      setProfil,
      chargement,
      erreurProfil,
      doitDefinirMotDePasse,
      motDePasseDefini: () => setDoitDefinirMotDePasse(false),
      rechargerProfil: () => lireProfil(session?.user),
      connexion: async (email, motDePasse) => {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: motDePasse })
        if (error) throw error
      },
      deconnexion: async () => {
        await supabase.auth.signOut()
      }
    }),
    [session, profil, chargement, erreurProfil, doitDefinirMotDePasse, lireProfil]
  )

  return <AuthContext.Provider value={valeur}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
