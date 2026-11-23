-- =================================================================
--  AGENDA CRF PERFECTION — INSTALLATION COMPLÈTE (à coller en une fois)
--  Supabase > SQL Editor > New query > coller > Run
--  Contient : 0001_schema.sql + 0002_rls.sql + 0003_rappels.sql
-- =================================================================


-- =====================================================================
--  AGENDA CRF PERFECTION — Migration 0001 : schéma de la base
--  À exécuter dans Supabase > SQL Editor (ou via la CLI Supabase),
--  AVANT 0002_rls.sql puis 0003_rappels.sql.
--  Fuseau de référence : Africa/Porto-Novo (UTC+1, sans heure d'été)
-- =====================================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------
--  Fonction utilitaire : date du jour à Porto-Novo
-- ---------------------------------------------------------------------
create or replace function public.aujourdhui_porto_novo()
returns date
language sql
stable
set search_path = ''
as $$
  select (now() at time zone 'Africa/Porto-Novo')::date;
$$;

-- ---------------------------------------------------------------------
--  Table PROFILS (1 ligne par compte, liée à auth.users)
-- ---------------------------------------------------------------------
create table if not exists public.profils (
  id           uuid primary key references auth.users (id) on delete cascade,
  nom_complet  text not null default '',
  email        text,
  role         text not null default 'membre' check (role in ('dg', 'admin', 'membre')),
  poste        text,
  telephone    text,
  actif        boolean not null default true,
  cree_le      timestamptz not null default now(),
  modifie_le   timestamptz not null default now()
);

comment on table public.profils is 'Personnel de CRF Perfection (un profil par compte).';
comment on column public.profils.role is 'dg = Directeur Général, admin = administrateur, membre = personnel';

-- ---------------------------------------------------------------------
--  Table TACHES
-- ---------------------------------------------------------------------
create sequence if not exists public.taches_numero_seq;

create table if not exists public.taches (
  id             uuid primary key default gen_random_uuid(),
  numero         integer not null unique default nextval('public.taches_numero_seq'),
  intitule       text not null check (length(btrim(intitule)) > 0),
  description    text,
  date_creation  date not null default public.aujourdhui_porto_novo(),
  echeance       date,
  statut         text not null default 'a_faire'
                   check (statut in ('a_faire', 'en_cours', 'termine', 'bloque')),
  priorite       text not null default 'normale' check (priorite in ('normale', 'haute')),
  cree_par       uuid default auth.uid() references public.profils (id) on delete set null,
  date_terminee  date,
  cree_le        timestamptz not null default now(),
  modifie_le     timestamptz not null default now()
);

alter sequence public.taches_numero_seq owned by public.taches.numero;

create index if not exists taches_echeance_idx on public.taches (echeance);
create index if not exists taches_statut_idx   on public.taches (statut);
create index if not exists taches_cree_par_idx on public.taches (cree_par);

comment on column public.taches.numero is 'Numéro lisible affiché « N° 1, 2, 3… » (auto-incrémenté).';

-- ---------------------------------------------------------------------
--  Table ATTRIBUTIONS (plusieurs attributaires par tâche)
-- ---------------------------------------------------------------------
create table if not exists public.attributions (
  tache_id      uuid not null references public.taches (id) on delete cascade,
  profil_id     uuid not null references public.profils (id) on delete cascade,
  attribue_le   timestamptz not null default now(),
  attribue_par  uuid default auth.uid() references public.profils (id) on delete set null,
  primary key (tache_id, profil_id)
);

create index if not exists attributions_profil_idx on public.attributions (profil_id);

-- ---------------------------------------------------------------------
--  Table COMMENTAIRES
-- ---------------------------------------------------------------------
create table if not exists public.commentaires (
  id         uuid primary key default gen_random_uuid(),
  tache_id   uuid not null references public.taches (id) on delete cascade,
  auteur_id  uuid default auth.uid() references public.profils (id) on delete set null,
  texte      text not null check (length(btrim(texte)) > 0),
  date       timestamptz not null default now()
);

create index if not exists commentaires_tache_idx on public.commentaires (tache_id, date);

-- ---------------------------------------------------------------------
--  Table HISTORIQUE (trace des changements : qui, quand, avant/après)
-- ---------------------------------------------------------------------
create table if not exists public.historique (
  id               bigint generated always as identity primary key,
  tache_id         uuid not null references public.taches (id) on delete cascade,
  auteur_id        uuid references public.profils (id) on delete set null,
  date             timestamptz not null default now(),
  champ            text not null check (champ in ('creation', 'statut', 'echeance', 'attribution')),
  ancienne_valeur  text,
  nouvelle_valeur  text
);

create index if not exists historique_tache_idx on public.historique (tache_id, date);

-- =====================================================================
--  FONCTIONS D'AIDE AUX DROITS (utilisées par les politiques RLS)
--  « security definer » : elles lisent les tables sans déclencher la RLS
--  (évite les boucles infinies de politiques).
-- =====================================================================
create or replace function public.est_actif()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (select 1 from public.profils p where p.id = auth.uid() and p.actif);
$$;

create or replace function public.est_gestionnaire()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profils p
    where p.id = auth.uid() and p.actif and p.role in ('dg', 'admin')
  );
$$;

create or replace function public.est_dg()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profils p
    where p.id = auth.uid() and p.actif and p.role = 'dg'
  );
$$;

create or replace function public.est_attribue(p_tache uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.attributions a
    where a.tache_id = p_tache and a.profil_id = auth.uid()
  );
$$;

create or replace function public.est_createur(p_tache uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.taches t
    where t.id = p_tache and t.cree_par = auth.uid()
  );
$$;

-- =====================================================================
--  TRIGGERS
-- =====================================================================

-- 1) Création automatique du profil lorsqu'un compte est créé / invité.
--    Le rôle est TOUJOURS « membre » à la création ; il est ensuite fixé
--    par le DG/admin (fonction admin-membres) ou en SQL pour le premier DG.
create or replace function public.creer_profil_nouvel_utilisateur()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  insert into public.profils (id, email, nom_complet)
  values (
    new.id,
    new.email,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'nom_complet'), ''), split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists sur_creation_utilisateur on auth.users;
create trigger sur_creation_utilisateur
  after insert on auth.users
  for each row execute function public.creer_profil_nouvel_utilisateur();

-- 2) Protection des profils : seul DG/admin change rôle / activation ;
--    seul le DG nomme ou retire un DG ; on ne peut pas retirer le dernier DG actif.
create or replace function public.proteger_profil()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  v_nb_dg integer;
begin
  new.modifie_le := now();

  -- Requêtes système (SQL Editor, clé service_role) : pas de contrôle applicatif
  if auth.uid() is null then
    return new;
  end if;

  if new.id <> old.id or new.email is distinct from old.email then
    raise exception 'Modification non autorisée de l''identifiant ou de l''email.';
  end if;

  if (new.role <> old.role or new.actif <> old.actif) then
    if not public.est_gestionnaire() then
      raise exception 'Seuls le DG et les administrateurs peuvent changer un rôle ou désactiver un compte.';
    end if;
    if (old.role = 'dg' or new.role = 'dg') and new.role <> old.role and not public.est_dg() then
      raise exception 'Seul le DG peut nommer ou retirer un DG.';
    end if;
    if new.id = auth.uid() and new.actif = false then
      raise exception 'Vous ne pouvez pas désactiver votre propre compte.';
    end if;
    if old.role = 'dg' and (new.role <> 'dg' or new.actif = false) then
      select count(*) into v_nb_dg from public.profils
      where role = 'dg' and actif and id <> old.id;
      if v_nb_dg = 0 then
        raise exception 'Il doit rester au moins un DG actif.';
      end if;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists avant_maj_profil on public.profils;
create trigger avant_maj_profil
  before update on public.profils
  for each row execute function public.proteger_profil();

-- 3) Règles métier des tâches (avant écriture)
--    - date_terminee renseignée automatiquement
--    - un membre ne peut modifier QUE le statut d'une tâche qui lui est attribuée
--      (il peut tout modifier sur une tâche qu'il a lui-même créée, sauf N° et créateur)
create or replace function public.regles_tache()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  new.modifie_le := now();

  if new.statut = 'termine' then
    if tg_op = 'INSERT' or old.statut <> 'termine' then
      new.date_terminee := coalesce(new.date_terminee, public.aujourdhui_porto_novo());
    end if;
  else
    new.date_terminee := null;
  end if;

  if auth.uid() is null or public.est_gestionnaire() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.cree_par := auth.uid();
    return new;
  end if;

  -- UPDATE par un membre
  if new.numero <> old.numero or new.cree_par is distinct from old.cree_par
     or new.date_creation <> old.date_creation then
    raise exception 'Le numéro, la date de création et le créateur ne peuvent pas être modifiés.';
  end if;

  if old.cree_par is distinct from auth.uid() then
    if new.intitule is distinct from old.intitule
       or new.description is distinct from old.description
       or new.echeance is distinct from old.echeance
       or new.priorite is distinct from old.priorite then
      raise exception 'Sur une tâche qui vous est attribuée, seul le statut peut être modifié.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists avant_ecriture_tache on public.taches;
create trigger avant_ecriture_tache
  before insert or update on public.taches
  for each row execute function public.regles_tache();

-- 4) Historique automatique (création, statut, échéance)
create or replace function public.historiser_tache()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.historique (tache_id, auteur_id, champ, nouvelle_valeur)
    values (new.id, auth.uid(), 'creation', new.statut);
    return new;
  end if;

  if new.statut is distinct from old.statut then
    insert into public.historique (tache_id, auteur_id, champ, ancienne_valeur, nouvelle_valeur)
    values (new.id, auth.uid(), 'statut', old.statut, new.statut);
  end if;

  if new.echeance is distinct from old.echeance then
    insert into public.historique (tache_id, auteur_id, champ, ancienne_valeur, nouvelle_valeur)
    values (new.id, auth.uid(), 'echeance', old.echeance::text, new.echeance::text);
  end if;

  return new;
end;
$$;

drop trigger if exists apres_ecriture_tache on public.taches;
create trigger apres_ecriture_tache
  after insert or update on public.taches
  for each row execute function public.historiser_tache();

-- 5) Historique des attributions (ajout / retrait d'un attributaire)
create or replace function public.historiser_attribution()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  v_nom text;
begin
  if tg_op = 'INSERT' then
    select nom_complet into v_nom from public.profils where id = new.profil_id;
    insert into public.historique (tache_id, auteur_id, champ, nouvelle_valeur)
    values (new.tache_id, auth.uid(), 'attribution', v_nom);
    return new;
  else
    -- la tâche peut être en cours de suppression (cascade) : on ignore alors
    if exists (select 1 from public.taches where id = old.tache_id) then
      select nom_complet into v_nom from public.profils where id = old.profil_id;
      insert into public.historique (tache_id, auteur_id, champ, ancienne_valeur)
      values (old.tache_id, auth.uid(), 'attribution', v_nom);
    end if;
    return old;
  end if;
end;
$$;

drop trigger if exists apres_ecriture_attribution on public.attributions;
create trigger apres_ecriture_attribution
  after insert or delete on public.attributions
  for each row execute function public.historiser_attribution();

-- 6) Numérotation : si des N° sont fournis explicitement (import),
--    la séquence est recalée pour que la prochaine tâche suive le plus grand N°.
create or replace function public.recaler_numerotation()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  v_max integer;
  v_dernier bigint;
  v_appele boolean;
begin
  select max(numero) into v_max from public.taches;
  select last_value, is_called into v_dernier, v_appele from public.taches_numero_seq;
  if v_max is not null and (v_max > v_dernier or (v_max = v_dernier and not v_appele)) then
    perform setval('public.taches_numero_seq', v_max, true);
  end if;
  return null;
end;
$$;

drop trigger if exists apres_insertion_taches on public.taches;
create trigger apres_insertion_taches
  after insert on public.taches
  for each statement execute function public.recaler_numerotation();

-- =====================================================================
--  DROITS DE BASE (la RLS de 0002_rls.sql affine ensuite ligne par ligne)
-- =====================================================================
revoke all on public.profils, public.taches, public.attributions,
              public.commentaires, public.historique from anon;

grant select, update on public.profils to authenticated;
grant select, insert, update, delete on public.taches to authenticated;
grant select, insert, delete on public.attributions to authenticated;
grant select, insert, update, delete on public.commentaires to authenticated;
grant select on public.historique to authenticated;
grant usage, select on sequence public.taches_numero_seq to authenticated;

grant execute on function public.est_actif(), public.est_gestionnaire(), public.est_dg(),
  public.est_attribue(uuid), public.est_createur(uuid), public.aujourdhui_porto_novo()
  to authenticated;


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
