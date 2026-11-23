-- =====================================================================
--  AGENDA CRF PERFECTION — Migration 0002 : sécurité (Row Level Security)
--
--  DG et admin : accès total (voir, créer, modifier, supprimer, assigner).
--  Membre      : voit toutes les tâches de l'équipe ;
--                modifie le statut et commente les tâches qui lui sont attribuées ;
--                crée ses propres tâches (et peut les modifier / les attribuer).
--  Compte désactivé : plus aucun accès aux données.
-- =====================================================================

alter table public.profils      enable row level security;
alter table public.taches       enable row level security;
alter table public.attributions enable row level security;
alter table public.commentaires enable row level security;
alter table public.historique   enable row level security;

-- ------------------------------- PROFILS -------------------------------
drop policy if exists "profils_lecture" on public.profils;
create policy "profils_lecture" on public.profils
  for select to authenticated
  using (id = auth.uid() or public.est_actif());

drop policy if exists "profils_modification" on public.profils;
create policy "profils_modification" on public.profils
  for update to authenticated
  using (id = auth.uid() or public.est_gestionnaire())
  with check (id = auth.uid() or public.est_gestionnaire());
-- (Le trigger proteger_profil empêche un membre de changer son rôle ou son statut actif.)
-- Pas d'INSERT/DELETE : les profils naissent avec le compte (invitation) et sont désactivés, pas supprimés.

-- ------------------------------- TACHES --------------------------------
drop policy if exists "taches_lecture" on public.taches;
create policy "taches_lecture" on public.taches
  for select to authenticated
  using (public.est_actif());

drop policy if exists "taches_creation" on public.taches;
create policy "taches_creation" on public.taches
  for insert to authenticated
  with check (
    public.est_gestionnaire()
    or (public.est_actif() and cree_par = auth.uid())
  );

drop policy if exists "taches_modification" on public.taches;
create policy "taches_modification" on public.taches
  for update to authenticated
  using (
    public.est_gestionnaire()
    or (public.est_actif() and (cree_par = auth.uid() or public.est_attribue(id)))
  )
  with check (
    public.est_gestionnaire()
    or (public.est_actif() and (cree_par = auth.uid() or public.est_attribue(id)))
  );
-- (Le trigger regles_tache limite un membre attributaire au seul changement de statut.)

drop policy if exists "taches_suppression" on public.taches;
create policy "taches_suppression" on public.taches
  for delete to authenticated
  using (public.est_gestionnaire());

-- ----------------------------- ATTRIBUTIONS ----------------------------
drop policy if exists "attributions_lecture" on public.attributions;
create policy "attributions_lecture" on public.attributions
  for select to authenticated
  using (public.est_actif());

drop policy if exists "attributions_ajout" on public.attributions;
create policy "attributions_ajout" on public.attributions
  for insert to authenticated
  with check (
    public.est_gestionnaire()
    or (public.est_actif() and public.est_createur(tache_id))
  );

drop policy if exists "attributions_retrait" on public.attributions;
create policy "attributions_retrait" on public.attributions
  for delete to authenticated
  using (
    public.est_gestionnaire()
    or (public.est_actif() and public.est_createur(tache_id))
  );

-- ----------------------------- COMMENTAIRES ----------------------------
drop policy if exists "commentaires_lecture" on public.commentaires;
create policy "commentaires_lecture" on public.commentaires
  for select to authenticated
  using (public.est_actif());

drop policy if exists "commentaires_ajout" on public.commentaires;
create policy "commentaires_ajout" on public.commentaires
  for insert to authenticated
  with check (
    auteur_id = auth.uid()
    and (
      public.est_gestionnaire()
      or (public.est_actif() and (public.est_attribue(tache_id) or public.est_createur(tache_id)))
    )
  );

drop policy if exists "commentaires_modification" on public.commentaires;
create policy "commentaires_modification" on public.commentaires
  for update to authenticated
  using (auteur_id = auth.uid() and public.est_actif())
  with check (auteur_id = auth.uid());

drop policy if exists "commentaires_suppression" on public.commentaires;
create policy "commentaires_suppression" on public.commentaires
  for delete to authenticated
  using ((auteur_id = auth.uid() and public.est_actif()) or public.est_gestionnaire());

-- ------------------------------ HISTORIQUE -----------------------------
-- Lecture seule : l'historique est écrit uniquement par les triggers.
drop policy if exists "historique_lecture" on public.historique;
create policy "historique_lecture" on public.historique
  for select to authenticated
  using (public.est_actif());
