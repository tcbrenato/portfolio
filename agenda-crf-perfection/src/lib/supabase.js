import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const cle = import.meta.env.VITE_SUPABASE_ANON_KEY

/** Vrai si les variables d'environnement Supabase sont renseignées. */
export const configurationOk = Boolean(url && cle && !String(url).includes('VOTRE-PROJET'))

// Lien reçu par email (invitation ou mot de passe oublié) : on lit le type
// AVANT que Supabase ne nettoie l'adresse.
const parametresLien = new URLSearchParams(
  (typeof window !== 'undefined' ? window.location.hash : '').replace(/^#/, '')
)
/** 'invite' | 'recovery' | null */
export const typeLienInitial = parametresLien.get('type')
/** Message d'erreur éventuel du lien (ex. lien expiré) */
export const erreurLienInitial = parametresLien.get('error_description')

export const supabase = configurationOk
  ? createClient(url, cle, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'implicit',
        storageKey: 'agenda-crf-auth'
      }
    })
  : null
