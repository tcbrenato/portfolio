// Droits côté interface (la sécurité réelle est assurée par la RLS Supabase).

export function estGestionnaire(profil) {
  return Boolean(profil && profil.actif && (profil.role === 'dg' || profil.role === 'admin'))
}

export function estAttribuee(profil, tache) {
  return Boolean(profil && tache.attribues?.includes(profil.id))
}

export function estCreateur(profil, tache) {
  return Boolean(profil && tache.cree_par === profil.id)
}

export function peutChangerStatut(profil, tache) {
  return estGestionnaire(profil) || estAttribuee(profil, tache) || estCreateur(profil, tache)
}

export function peutModifier(profil, tache) {
  return estGestionnaire(profil) || estCreateur(profil, tache)
}

export function peutSupprimer(profil) {
  return estGestionnaire(profil)
}

export function peutCommenter(profil, tache) {
  return estGestionnaire(profil) || estAttribuee(profil, tache) || estCreateur(profil, tache)
}
