-- =====================================================================
--  AGENDA CRF PERFECTION — Migration 0003 : architecture des RAPPELS
--  (notifications « échéance dans 48 h » et « tâche échue »)
--
--  ⚠ PRÉPARÉ MAIS NON ACTIVÉ : aucune notification n'est envoyée tant que
--    la planification (pg_cron, en bas de fichier) n'est pas activée et que
--    la fonction Edge « rappels-echeances » n'a pas RAPPELS_ACTIFS=true.
-- =====================================================================

-- Préférences de chaque membre
create table if not exists public.preferences_rappels (
  profil_id     uuid primary key references public.profils (id) on delete cascade,
  echeance_48h  boolean not null default true,
  tache_echue   boolean not null default true,
  canal         text not null default 'push' check (canal in ('push', 'email', 'aucun')),
  modifie_le    timestamptz not null default now()
);

-- Abonnements « Web Push » (un par appareil / navigateur)
create table if not exists public.abonnements_push (
  id          uuid primary key default gen_random_uuid(),
  profil_id   uuid not null default auth.uid() references public.profils (id) on delete cascade,
  endpoint    text not null unique,
  p256dh      text not null,
  auth        text not null,
  appareil    text,
  cree_le     timestamptz not null default now()
);

-- Journal des rappels envoyés (évite les doublons)
create table if not exists public.journal_rappels (
  id         bigint generated always as identity primary key,
  tache_id   uuid not null references public.taches (id) on delete cascade,
  profil_id  uuid not null references public.profils (id) on delete cascade,
  type       text not null check (type in ('echeance_48h', 'echue')),
  envoye_le  timestamptz not null default now(),
  unique (tache_id, profil_id, type)
);

alter table public.preferences_rappels enable row level security;
alter table public.abonnements_push    enable row level security;
alter table public.journal_rappels     enable row level security;

revoke all on public.preferences_rappels, public.abonnements_push, public.journal_rappels from anon;
grant select, insert, update on public.preferences_rappels to authenticated;
grant select, insert, delete on public.abonnements_push to authenticated;
grant select on public.journal_rappels to authenticated;

drop policy if exists "prefs_les_miennes" on public.preferences_rappels;
create policy "prefs_les_miennes" on public.preferences_rappels
  for all to authenticated
  using (profil_id = auth.uid()) with check (profil_id = auth.uid());

drop policy if exists "push_les_miens" on public.abonnements_push;
create policy "push_les_miens" on public.abonnements_push
  for all to authenticated
  using (profil_id = auth.uid()) with check (profil_id = auth.uid());

drop policy if exists "journal_les_miens" on public.journal_rappels;
create policy "journal_les_miens" on public.journal_rappels
  for select to authenticated
  using (profil_id = auth.uid() or public.est_gestionnaire());

-- Liste des rappels à envoyer maintenant (utilisée par la fonction Edge)
create or replace function public.rappels_a_envoyer()
returns table (
  tache_id uuid, numero integer, intitule text, echeance date,
  profil_id uuid, nom_complet text, type text
)
language sql stable security definer
set search_path = ''
as $$
  with candidats as (
    select t.id as tache_id, t.numero, t.intitule, t.echeance, a.profil_id,
           case
             when t.echeance < public.aujourdhui_porto_novo() then 'echue'
             else 'echeance_48h'
           end as type
    from public.taches t
    join public.attributions a on a.tache_id = t.id
    join public.profils p on p.id = a.profil_id and p.actif
    where t.statut <> 'termine'
      and t.echeance is not null
      and t.echeance <= public.aujourdhui_porto_novo() + 2
  )
  select c.tache_id, c.numero, c.intitule, c.echeance, c.profil_id, p.nom_complet, c.type
  from candidats c
  join public.profils p on p.id = c.profil_id
  left join public.preferences_rappels pr on pr.profil_id = c.profil_id
  where not exists (
          select 1 from public.journal_rappels j
          where j.tache_id = c.tache_id and j.profil_id = c.profil_id and j.type = c.type
        )
    and coalesce(pr.canal, 'push') <> 'aucun'
    and (
      (c.type = 'echue' and coalesce(pr.tache_echue, true))
      or (c.type = 'echeance_48h' and coalesce(pr.echeance_48h, true))
    );
$$;

revoke execute on function public.rappels_a_envoyer() from public, anon, authenticated;

-- ---------------------------------------------------------------------
--  ACTIVATION FUTURE (laisser commenté pour l'instant)
--  1) Database > Extensions : activer « pg_cron » et « pg_net »
--  2) Déployer la fonction Edge : supabase functions deploy rappels-echeances
--  3) Décommenter et adapter (URL du projet + clé service_role stockée dans Vault)
-- ---------------------------------------------------------------------
-- select cron.schedule(
--   'rappels-echeances-quotidiens',
--   '0 7 * * *',   -- tous les jours à 07:00 UTC = 08:00 à Porto-Novo
--   $$
--   select net.http_post(
--     url     := 'https://VOTRE-PROJET.supabase.co/functions/v1/rappels-echeances',
--     headers := jsonb_build_object(
--       'Content-Type', 'application/json',
--       'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'service_role_key')
--     ),
--     body    := '{}'::jsonb
--   );
--   $$
-- );
