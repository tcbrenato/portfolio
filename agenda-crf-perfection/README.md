# Agenda CRF Perfection

Agenda électronique de suivi des tâches pour tout le personnel de **CRF Perfection**.
Le Directeur Général y inscrit ses propres points et ceux de l'équipe. Chaque tâche a un
**numéro**, une **date**, une **échéance** et un ou plusieurs **attributaires**. D'un coup d'œil,
on voit ce qui n'est pas encore échu, ce qui est en cours et ce qui est en retard.

- Conçue **d'abord pour le téléphone** (360 à 430 px), puis pour l'ordinateur
- **Installable** sur l'écran d'accueil (PWA), elle s'ouvre comme une application
- Légère pour les connexions faibles : environ 140 Ko compressés au premier chargement, puis l'application reste en cache
- Interface 100 % en français, dates au format jj/mm/aaaa, fuseau **Africa/Porto-Novo**

**Technologies :** React + Vite · Supabase (Auth, Postgres, Row Level Security, Edge Functions) · Vercel

---

## Sommaire

1. [Fonctionnalités](#1-fonctionnalités)
2. [Structure du projet](#2-structure-du-projet)
3. [Créer le projet Supabase](#3-créer-le-projet-supabase)
4. [Variables d'environnement](#4-variables-denvironnement)
5. [Lancer en local (Windows / PowerShell / VS Code)](#5-lancer-en-local-windows--powershell--vs-code)
6. [Créer le premier compte DG](#6-créer-le-premier-compte-dg)
7. [Déployer sur Vercel](#7-déployer-sur-vercel)
8. [Inviter les membres](#8-inviter-les-membres)
9. [Logo et icônes](#9-logo-et-icônes)
10. [Import d'une liste existante](#10-import-dune-liste-existante)
11. [Rappels (prévus, non activés)](#11-rappels-prévus-non-activés)
12. [Droits et sécurité](#12-droits-et-sécurité)
13. [Dépannage](#13-dépannage)

---

## 1. Fonctionnalités

| Écran | Contenu |
|---|---|
| **Connexion** | Email et mot de passe, logo, « Mot de passe oublié ». Pas d'inscription libre. |
| **Accueil** | 4 compteurs (Total, En cours, Échues, Terminées), section **En retard** mise en évidence, section **À échéance dans les 7 jours**. Bascule « Équipe / Mes tâches ». |
| **Tâches** | Cartes sur mobile, tableau sur ordinateur : N° · Tâche · Date · Échéance · Attributaire · Statut · Délai. Filtres en puces (Toutes, Mes tâches, En cours, Échues, Terminées, Bloquées, puis par attributaire), recherche, tri, **export Excel et PDF** de la liste filtrée. |
| **Changement de statut en un geste** | Glisser une carte **vers la droite** pour la marquer terminée (ou la rouvrir), **vers la gauche** pour choisir un statut. On peut aussi toucher la pastille de statut. Un bouton « Annuler » apparaît quelques secondes. |
| **Fiche tâche** | Détail, attributaires (avec appel direct), commentaires, historique (statut, échéance, attributions : qui, quand, avant/après). |
| **Ajout rapide** | Bouton **+** : intitulé, échéance (raccourcis Aujourd'hui / Demain / 7 j / 15 j / fin du mois), attributaires, puis Enregistrer. Moins de 10 secondes. |
| **Formulaire complet** | Description, date, statut, priorité, plusieurs attributaires. |
| **Calendrier** | Vue mensuelle des échéances (points bleu, rouge et vert). Toucher un jour affiche ses tâches. |
| **Mon compte** | Profil, changement du mot de passe, installation sur l'écran d'accueil, déconnexion. Pour le DG et les administrateurs : **gestion des membres** (inviter, changer le rôle, désactiver, réactiver, renvoyer le lien) et **import**. |

### Règles de calcul et d'affichage

- **Délai** (calculé automatiquement, fuseau Porto-Novo) : « Dans X j », « Aujourd'hui », « Échu depuis X j », « Terminé ».
- **Échue** : échéance passée et tâche non terminée. Elle est signalée en rouge discret (liseré et texte).
- **Terminée** : intitulé barré et grisé.
- **Bloquée** : pastille orange avec icône d'alerte.
- Compteur **En cours** et filtre « En cours » : toutes les tâches non terminées dont l'échéance n'est pas dépassée (à faire, en cours ou bloquées).
- Le **N°** est attribué automatiquement (1, 2, 3…). En cas d'import avec des N°, la numérotation reprend après le plus grand.

---

## 2. Structure du projet

```
agenda-crf-perfection/
├─ index.html                  Page HTML (méta PWA, iOS)
├─ package.json
├─ vite.config.js              Vite + PWA (manifest, service worker, cache)
├─ vercel.json                 Réécritures SPA + en-têtes de cache
├─ .env.example                Modèle des variables d'environnement
├─ public/
│  ├─ logo.png                 Logo source (à remplacer par le logo officiel)
│  ├─ logo-entete.png          Logo allégé (généré)
│  ├─ favicon.png              (généré)
│  ├─ sw-rappels.js            Réception des notifications push (inactif pour l'instant)
│  └─ icons/                   Icônes PWA 192, 512, maskable, apple-touch (générées)
├─ scripts/
│  └─ generer-icones.mjs       npm run icones : régénère toutes les icônes depuis logo.png
├─ supabase/
│  ├─ migrations/
│  │  ├─ 0001_schema.sql       Tables, triggers (profil auto, historique, numérotation)
│  │  ├─ 0002_rls.sql          Politiques de sécurité (Row Level Security)
│  │  └─ 0003_rappels.sql      Architecture des rappels (préparée, non planifiée)
│  └─ functions/
│     ├─ admin-membres/        Invitation, désactivation et réactivation des comptes (DG/admin)
│     └─ rappels-echeances/    Envoi des rappels (mode simulation tant que non activé)
└─ src/
   ├─ main.jsx, App.jsx        Démarrage, routes, garde de connexion
   ├─ styles/global.css        Charte graphique (mobile d'abord)
   ├─ assets/                  Police Inter (sous-ensemble latin, intégrée)
   ├─ lib/                     supabase, api, dates, statuts, droits, filtres,
   │                           export (Excel/PDF), import (CSV/Excel), notifications
   ├─ context/                 AuthContext, DonneesContext, ToastContext
   ├─ hooks/                   useMediaQuery, useInstallation, useChangementStatut
   ├─ components/              Disposition (en-tête + barre basse + bouton +), CarteTache,
   │                           TableauTaches, ListeTaches, AjoutRapide, FeuilleBas, MenuStatut,
   │                           PastilleStatut, SelecteurPersonnes, ChampEcheance, Icones…
   └─ pages/                   Connexion, DefinirMotDePasse, Accueil, Taches, FicheTache,
                               FormulaireTache, Calendrier, MonCompte, GestionMembres, Import…
```

### Base de données

| Table | Rôle |
|---|---|
| `profils` | id (lié à `auth.users`), nom_complet, email, role (`dg`, `admin`, `membre`), poste, telephone, actif |
| `taches` | id, **numero** (auto), intitule, description, date_creation (aujourd'hui par défaut), echeance, statut (`a_faire`, `en_cours`, `termine`, `bloque`), priorite (`normale`, `haute`), cree_par, date_terminee (automatique) |
| `attributions` | tache_id, profil_id (plusieurs attributaires par tâche) |
| `commentaires` | id, tache_id, auteur_id, texte, date |
| `historique` | tache_id, auteur_id, date, champ (`creation`, `statut`, `echeance`, `attribution`), ancienne_valeur, nouvelle_valeur. Rempli automatiquement par des triggers. |
| `preferences_rappels`, `abonnements_push`, `journal_rappels` | Rappels (voir §11) |

---

## 3. Créer le projet Supabase

1. Créez un compte sur <https://supabase.com>, puis **New project**.
   - Nom : `agenda-crf-perfection`
   - Région : **West EU (Paris)** ou **Central EU (Frankfurt)**, les plus proches de l'Afrique de l'Ouest
   - Notez le mot de passe de la base de données.
2. **Exécuter les migrations** : menu **SQL Editor**, puis **New query**. Copiez-collez le contenu de chaque fichier **dans cet ordre**, puis cliquez **Run** :
   1. `supabase/migrations/0001_schema.sql`
   2. `supabase/migrations/0002_rls.sql`
   3. `supabase/migrations/0003_rappels.sql`

   Chaque exécution doit afficher « Success. No rows returned ».
3. **Fermer l'inscription libre** : **Authentication**, puis **Sign In / Providers**. Désactivez **Allow new users to sign up**. Laissez le fournisseur **Email** activé.
4. **Adresses autorisées** : **Authentication**, puis **URL Configuration** :
   - **Site URL** : l'adresse Vercel (par ex. `https://agenda-crf-perfection.vercel.app`). En attendant, mettez `http://localhost:5173`.
   - **Redirect URLs** : ajoutez `http://localhost:5173/**` et `https://agenda-crf-perfection.vercel.app/**`.
5. **Emails en français** (conseillé) : **Authentication**, puis **Email Templates** :
   - *Invite user*, sujet : `Invitation à l'Agenda CRF Perfection`. Corps :
     ```html
     <h2>Agenda CRF Perfection</h2>
     <p>Bonjour,</p>
     <p>La Direction Générale vous invite à utiliser l'agenda de suivi des tâches.</p>
     <p><a href="{{ .ConfirmationURL }}">Activer mon compte et choisir mon mot de passe</a></p>
     ```
   - *Reset password*, sujet : `Réinitialisation de votre mot de passe`. Corps :
     ```html
     <p>Bonjour,</p>
     <p><a href="{{ .ConfirmationURL }}">Choisir un nouveau mot de passe</a></p>
     <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
     ```
6. **Envoi des emails (important)** : le service d'email intégré de Supabase est limité à quelques messages par heure et sert surtout aux tests. Pour inviter toute l'équipe, configurez un SMTP dans **Project Settings**, puis **Authentication**, puis **SMTP Settings** (Brevo, Mailjet, Gmail Workspace, etc.).
7. **Déployer la fonction `admin-membres`**, nécessaire pour inviter et désactiver des membres. Deux méthodes :
   - **Depuis le tableau de bord** (le plus simple) : **Edge Functions**, puis **Deploy a new function**, puis **Via Editor**. Nommez-la exactement `admin-membres`, collez le contenu de `supabase/functions/admin-membres/index.ts`, puis **Deploy**.
   - **En ligne de commande**, dans PowerShell, à la racine du projet :
     ```powershell
     npx supabase login
     npx supabase init
     npx supabase link --project-ref VOTRE_REF_PROJET
     npx supabase functions deploy admin-membres
     ```
     Le *project ref* est l'identifiant visible dans l'URL du tableau de bord (`https://supabase.com/dashboard/project/<ref>`). Si `supabase init` demande d'écraser des fichiers, répondez **non**.

   Les clés nécessaires (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) sont fournies automatiquement à la fonction. Vous n'avez rien à configurer.

---

## 4. Variables d'environnement

Récupérez les valeurs dans **Project Settings**, puis **API** (ou **Data API** et **API Keys**) :

| Variable | Valeur |
|---|---|
| `VITE_SUPABASE_URL` | Project URL, par ex. `https://abcdefghijkl.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Clé **anon / publishable** (publique) |
| `VITE_NOTIFICATIONS_ACTIVES` | `false` (voir §11) |

> ⚠️ Ne mettez **jamais** la clé `service_role` / `secret` dans `.env` ni dans Vercel : elle donne tous les droits sur la base de données.

---

## 5. Lancer en local (Windows / PowerShell / VS Code)

Prérequis : **Node.js 18 ou plus récent** (version LTS conseillée, <https://nodejs.org>) et VS Code.

Dans VS Code, ouvrez le dossier `agenda-crf-perfection`, puis le terminal (**Ctrl + `**) :

```powershell
npm install
Copy-Item .env.example .env
code .env
```

Renseignez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans `.env`, enregistrez, puis :

```powershell
npm run dev
```

Ouvrez <http://localhost:5173>.

**Tester sur votre téléphone (même Wi-Fi)** : `npm run dev` affiche aussi une adresse `Network: http://192.168.x.x:5173`. Ouvrez-la sur le téléphone. Si Windows le demande, autorisez Node.js dans le pare-feu. Pour vous connecter depuis cette adresse, ajoutez-la aussi dans les **Redirect URLs** de Supabase.

Autres commandes :

```powershell
npm run build     # compile la version de production dans dist/
npm run preview   # sert dist/ en local (test du mode PWA / hors ligne)
npm run icones    # régénère les icônes depuis public/logo.png
```

---

## 6. Créer le premier compte DG

L'inscription libre est fermée : le premier compte se crée dans Supabase.

1. **Authentication**, puis **Users**, puis **Add user** et **Create new user** :
   - Email du DG et mot de passe provisoire
   - Cochez **Auto Confirm User**
2. Le profil est créé automatiquement avec le rôle `membre`. Pour le passer en **DG**, allez dans **SQL Editor** et exécutez (remplacez l'email et le nom) :
   ```sql
   update public.profils
   set role = 'dg', nom_complet = 'Prénom NOM', poste = 'Directeur Général'
   where email = 'dg@exemple.com';
   ```
3. Connectez-vous à l'application avec cet email. Le DG peut changer son mot de passe dans **Mon compte**, puis inviter l'équipe (§8).

---

## 7. Déployer sur Vercel

1. Poussez le code sur GitHub. Ce dossier peut rester dans un dépôt plus large.
2. Sur <https://vercel.com>, choisissez **Add New**, puis **Project**, puis **Import** du dépôt.
3. Réglages :
   - **Root Directory** : `agenda-crf-perfection` (**indispensable** si le dossier n'est pas à la racine du dépôt)
   - **Framework Preset** : Vite (détecté automatiquement). Build : `npm run build`. Output : `dist`.
   - **Environment Variables** : `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_NOTIFICATIONS_ACTIVES=false`
4. **Deploy**. Reportez ensuite l'adresse obtenue dans Supabase, **Authentication**, puis **URL Configuration** : *Site URL* et *Redirect URLs* (§3.4).
5. Domaine personnalisé (facultatif, par ex. `agenda.crfperfection.com`) : **Settings**, puis **Domains** dans Vercel. Ajoutez-le aussi dans Supabase.

Toute modification d'une variable d'environnement sur Vercel nécessite un **Redeploy**.

### Installer l'application sur le téléphone

- **Android (Chrome)** : ouvrez l'adresse, puis **Mon compte** et **Installer sur l'écran d'accueil**, ou le menu ⋮ puis **Installer l'application**.
- **iPhone (Safari)** : bouton **Partager**, puis **Sur l'écran d'accueil**.

---

## 8. Inviter les membres

Dans **Mon compte**, puis **Gestion des membres**, puis **Inviter** : nom, email, rôle, poste, téléphone.
La personne reçoit un email, clique sur le lien et choisit son mot de passe.

- **Changer le rôle** : liste déroulante (seul le DG peut nommer ou retirer un DG).
- **Désactiver** : la personne ne peut plus se connecter. Ses tâches et commentaires sont conservés. Le compte peut être réactivé à tout moment.
- **Renvoyer le lien** : renvoie l'invitation, ou un lien de réinitialisation si le compte est déjà activé.
- On ne peut pas se désactiver soi-même, et il reste toujours au moins un DG actif.

---

## 9. Logo et icônes

Le logo officiel n'a pas pu être récupéré lors de la création du projet. `public/logo.png` contient pour l'instant un **logo provisoire** aux couleurs de la charte. Pour mettre le vrai logo :

1. Copiez le logo officiel (PNG, idéalement carré, fond transparent ou blanc, au moins 512 px) dans `public/logo.png` en remplaçant le fichier existant.
2. Lancez :
   ```powershell
   npm run icones
   ```
   Le script génère `icons/icon-192.png`, `icons/icon-512.png`, `icons/icon-maskable-512.png`, `icons/apple-touch-icon.png`, `favicon.png` et `logo-entete.png` (version légère pour l'en-tête).
3. Redéployez. Sur les téléphones où l'application est déjà installée, l'icône se met à jour après réinstallation.

---

## 10. Import d'une liste existante

Dans **Mon compte**, puis **Importer une liste de tâches** (DG et administrateurs) :

- Formats : **Excel `.xlsx`** ou **CSV** (séparateur `;` ou `,`, UTF-8 ou format « CSV » d'Excel). Pour un ancien fichier `.xls`, faites **Enregistrer sous**, puis **Classeur Excel (.xlsx)**.
- Première ligne : les titres **N°, Tâche, Date, Échéance, Attributaire**. Les colonnes **Statut** et **Description** sont facultatives. Les variantes courantes (« Intitulé », « Responsable », « Date limite »…) sont reconnues.
- Dates : `jj/mm/aaaa` (ou `jj/mm/aa`, ou une vraie date Excel).
- Attributaires : nom complet ou partiel (« Koffi », « K. Agbodjan »). Pour plusieurs personnes, séparez par `,` `;` `/` ou « et ». **Les membres doivent avoir été invités avant l'import.**
- Un **aperçu** signale chaque ligne : ✓ prête, ! avertissement (nom inconnu, N° déjà utilisé : numérotation automatique), ✕ ignorée (intitulé vide, échéance illisible).
- Un modèle CSV peut être téléchargé depuis cet écran.

---

## 11. Rappels (prévus, non activés)

L'architecture est en place, mais **aucune notification n'est envoyée** pour l'instant :

| Élément | Rôle |
|---|---|
| `0003_rappels.sql` | Tables `preferences_rappels`, `abonnements_push`, `journal_rappels`, et fonction `rappels_a_envoyer()` (échéance dans 48 h, tâche échue, une seule fois par personne) |
| `functions/rappels-echeances` | Lit les rappels dus. Fonctionne en **simulation** tant que le secret `RAPPELS_ACTIFS` ne vaut pas `true`. |
| `src/lib/notifications.js` | Abonnement Web Push de l'appareil (désactivé par `VITE_NOTIFICATIONS_ACTIVES=false`) |
| `public/sw-rappels.js` | Affichage de la notification et ouverture de la tâche au toucher |

**Pour activer plus tard :**

1. Générer des clés VAPID : `npx web-push generate-vapid-keys`
2. Secrets de la fonction : `npx supabase secrets set VAPID_PUBLIC_KEY=... VAPID_PRIVATE_KEY=... VAPID_SUJET=mailto:contact@votre-domaine RAPPELS_ACTIFS=true`
3. `npx supabase functions deploy rappels-echeances`
4. Activer les extensions **pg_cron** et **pg_net**, enregistrer la clé `service_role` dans **Vault** sous le nom `service_role_key`, puis décommenter la planification en bas de `0003_rappels.sql` (tous les jours à 08:00, heure de Porto-Novo).
5. Sur Vercel : `VITE_NOTIFICATIONS_ACTIVES=true` et `VITE_VAPID_PUBLIC_KEY=<clé publique>`, puis ajouter dans **Mon compte** un bouton qui appelle `activerRappelsSurCetAppareil()`.

Sur iPhone, les notifications web ne fonctionnent que si l'application est **installée sur l'écran d'accueil** (iOS 16.4 ou plus récent).

---

## 12. Droits et sécurité

La sécurité est assurée **dans la base de données** (Row Level Security et triggers), pas seulement dans l'interface :

| Action | DG / Admin | Membre |
|---|---|---|
| Voir toutes les tâches de l'équipe | ✅ | ✅ |
| Créer une tâche | ✅ | ✅ (il en devient le créateur) |
| Modifier une tâche (intitulé, échéance…) | ✅ toutes | ✅ seulement celles qu'il a créées |
| Changer le statut | ✅ toutes | ✅ tâches qui lui sont attribuées ou qu'il a créées |
| Commenter | ✅ toutes | ✅ tâches qui lui sont attribuées ou qu'il a créées |
| Assigner des attributaires | ✅ toutes | ✅ seulement sur ses propres tâches |
| Supprimer une tâche | ✅ | ❌ |
| Inviter, désactiver, changer un rôle | ✅ (seul le DG gère les DG) | ❌ |
| Compte désactivé | aucun accès aux données | aucun accès aux données |

- Sur une tâche qui lui est attribuée, un membre ne peut changer **que le statut** : toute autre modification est refusée par le trigger `regles_tache`.
- Le N°, la date de création et le créateur ne peuvent pas être modifiés par un membre.
- L'historique est en lecture seule : il n'est écrit que par les triggers.
- La clé publique (`anon`) ne permet de lire aucune donnée sans être connecté.

Ces règles ont été vérifiées sur PostgreSQL 16 avec des scénarios DG, admin, membre et compte désactivé.

---

## 13. Dépannage

| Problème | Solution |
|---|---|
| Écran « Configuration requise » | `.env` absent ou incomplet. Relancez `npm run dev` après l'avoir modifié (sur Vercel : variables d'environnement puis Redeploy). |
| « Email ou mot de passe incorrect » pour le premier DG | Vérifiez que **Auto Confirm User** était coché, ou confirmez l'utilisateur dans Authentication > Users. |
| Le DG ne voit pas « Gestion des membres » | Le rôle n'a pas été passé à `dg` : refaites l'étape 6.2. |
| « La fonction admin-membres n'est pas déployée » | Déployez la fonction (§3.7) avec exactement ce nom. |
| L'invitation n'arrive pas | Vérifiez les spams et la limite d'envoi du SMTP intégré (§3.6). Vérifiez aussi les Redirect URLs. |
| Le lien de l'email ouvre une page d'erreur | Ajoutez l'adresse de l'application dans les **Redirect URLs** (§3.4). Les liens expirent après 24 h : utilisez « Renvoyer le lien ». |
| Une nouvelle version n'apparaît pas | L'application se met à jour d'elle-même au lancement suivant. Fermez-la complètement puis rouvrez-la. |
| `npm install` échoue sur `sharp` | Mettez à jour Node.js (LTS), puis `npm install` à nouveau. `sharp` ne sert qu'à générer les icônes. |
