import React, { useState } from 'react';
import { ExternalLink, Github, Filter, Code, Smartphone, Globe, ShoppingCart, Palette, TrendingUp } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { elementRef: projectsRef, isVisible: projectsVisible } = useScrollAnimation();

  const filters = [
    { id: 'all', name: 'Tous les projets', icon: Filter },
    { id: 'web', name: 'Sites Web', icon: Globe },
    { id: 'mobile', name: 'Applications Mobiles', icon: Smartphone },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart },
    { id: 'design', name: 'UI/UX Design', icon: Palette },
    { id: 'marketing', name: 'Marketing Digital', icon: TrendingUp }
  ];

  const projects = [
    {
      id: 14,
      title: 'COPAF 2026 – Plateforme Officielle de la Conférence des Ports Africains',
      description: 'Plateforme complète pour la Conférence des Ports Africains 2026 (Casablanca) : inscription des participants, paiement, génération de badges et documents, tableau de bord administrateur.',
      image: '/copaf.png',
      category: 'web',
      technologies: ['React', 'Vite', 'Supabase', 'GitHub Actions', 'Hostinger'],
      features: ['Inscription et vérification de dossier en ligne', 'Génération automatique de badges et PDF officiels', 'Tableau de bord admin sécurisé', 'Interface bilingue français/anglais'],
      liveUrl: 'https://copaf-ports.com',
      githubUrl: 'https://github.com/tcbrenato',
      status: 'En cours'
    },
    {
      id: 15,
      title: 'CINÉ LIFESTYLE + – Abonnements Films & Séries via Mobile Money',
      description: 'Plateforme d\'abonnement à des catalogues Films/Séries avec paiement Mobile Money et accès automatisé à des canaux Telegram privés via bot dédié.',
      image: '/cinelifestyle.png',
      category: 'web',
      technologies: ['React', 'Node.js', 'Supabase', 'KKiaPay', 'Telegram Bot'],
      features: ['Abonnement et paiement Mobile Money (KKiaPay/FeexPay)', 'Accès et retrait automatique des canaux Telegram', 'Chat intégré client/admin', 'Gestion des expirations d\'abonnement'],
      liveUrl: 'https://cine-lifestyle-frontend.vercel.app/',
      githubUrl: 'https://github.com/tcbrenato/cine-lifestyle-frontend',
      status: 'En cours'
    },
    {
      id: 16,
      title: 'Coordonnées CRF Perfection – Page de Liens Officiels',
      description: 'Page web interactive regroupant tous les canaux officiels de CRF Perfection (site, COPAF, réseaux sociaux, WhatsApp, e-mails) avec un design premium.',
      image: '/coordonnees.png',
      category: 'web',
      technologies: ['React', 'Vite', 'Hostinger', 'SEO'],
      features: ['Tous les liens officiels regroupés en un seul endroit', 'Design premium marine et or', 'Déploiement automatisé (CI/CD)', 'SEO complet (sitemap, Open Graph, JSON-LD)'],
      liveUrl: 'https://coordonnees.crfperfection.pro',
      githubUrl: 'https://github.com/tcbrenato/coordonnees-crf-perfection',
      status: 'Terminé'
    },
    {
      id: 17,
      title: 'RC PRO WASH – Plateforme de Commande de Lavage Auto',
      description: 'Plateforme de commande en ligne pour un service de lavage automobile à domicile, avec calcul de prix par zone, espace client et tableau de bord admin.',
      image: '/rcprowash.png',
      category: 'ecommerce',
      technologies: ['React', 'Supabase', 'EmailJS'],
      features: ['Commande en ligne avec calcul de prix par quartier', 'Espace client avec historique des commandes', 'Tableau de bord admin (statistiques, statuts)', 'Notifications par e-mail'],
      liveUrl: 'https://rcprowash.vercel.app',
      githubUrl: 'https://github.com/tcbrenato',
      status: 'En cours'
    },
    {
      id: 18,
      title: 'RenatoAgenda – Agenda Personnel Intelligent',
      description: 'Outil d\'agenda personnel pour gérer programmes, tâches, lieux et contacts, avec un tableau de bord visuel et un assistant IA de résumé à venir.',
      image: '/renatoagenda.png',
      category: 'web',
      technologies: ['React', 'Vite', 'Supabase', 'Vercel'],
      features: ['Gestion de tâches et programmes avec lieu et contact', 'Calendrier visuel interactif', 'Tableau de bord par catégories (urgent, à venir, terminé)', 'Assistant IA de résumé et rappels (à venir)'],
      liveUrl: '#',
      githubUrl: 'https://github.com/tcbrenato/renatoagenda',
      status: 'En cours'
    },
    {
      id: 1,
      title: 'MyProforma – Générateur de Proforma',
      description: 'Plateforme web de génération de factures proforma professionnelles, pensée pour les entrepreneurs et PME qui veulent aller vite et bien.',
      image: '/proforma.png',
      category: 'web',
      technologies: ['React', 'Vite', 'Tailwind CSS', 'Netlify'],
      features: ['Génération de proforma en ligne', 'Interface simple et rapide', 'Export et impression'],
      liveUrl: 'https://myproforma.netlify.app/',
      githubUrl: 'https://github.com/tcbrenato',
      status: 'Terminé'
    },
    {
      id: 2,
      title: 'Liste Invités – Gestion d\'événement',
      description: 'Plateforme de gestion et recherche des invités pour un événement, permettant un contrôle d\'accès fluide et une liste organisée en temps réel.',
      image: '/listeinvite.png',
      category: 'web',
      technologies: ['React', 'Tailwind CSS', 'Netlify'],
      features: ['Recherche rapide des invités', 'Gestion de la liste en temps réel', 'Interface mobile-friendly'],
      liveUrl: 'https://listeinvite.netlify.app/recherche',
      githubUrl: 'https://github.com/tcbrenato',
      status: 'Terminé'
    },
    {
      id: 3,
      title: 'Cours Numériques – Apprentissage Digital',
      description: 'Plateforme d\'apprentissage des compétences numériques pour accompagner les apprenants béninois vers la maîtrise des outils digitaux.',
      image: '/cours.png',
      category: 'web',
      technologies: ['React', 'Tailwind CSS', 'Netlify'],
      features: ['Catalogue de cours numériques', 'Interface pédagogique intuitive', 'Accès mobile optimisé'],
      liveUrl: 'https://cours-numeriques.netlify.app/',
      githubUrl: 'https://github.com/tcbrenato',
      status: 'En cours'
    },
    {
      id: 4,
      title: 'Portfolio – Merveille Kodja',
      description: 'Portfolio professionnel d\'une chargée de communication officinale, mettant en valeur ses compétences, expériences et réalisations.',
      image: '/merveille.png',
      category: 'design',
      technologies: ['React', 'Tailwind CSS', 'Netlify'],
      features: ['Design élégant et professionnel', 'Présentation des compétences', 'Formulaire de contact intégré'],
      liveUrl: 'https://merveillekodja.netlify.app/',
      githubUrl: 'https://github.com/tcbrenato',
      status: 'Terminé'
    },
    {
      id: 5,
      title: 'JeRévise – Plateforme de Révision DSLC (UAC)',
      description: 'Plateforme de révision en ligne pour les étudiants de la filière DSLC de l\'Université d\'Abomey-Calavi, avec exercices et fiches de cours.',
      image: '/jerevise.png',
      category: 'web',
      technologies: ['React', 'Tailwind CSS', 'Netlify'],
      features: ['Fiches de révision par matière', 'Exercices interactifs', 'Interface adaptée aux étudiants'],
      liveUrl: 'https://jerevise.netlify.app/',
      githubUrl: 'https://github.com/tcbrenato',
      status: 'Terminé'
    },
    {
      id: 6,
      title: 'KouKaMC – Gestion Factures & Bons de Commande',
      description: 'Plateforme de gestion de factures express, proforma et bons de commande pour un restaurant, facilitant la gestion administrative au quotidien.',
      image: '/koukamc.png',
      category: 'web',
      technologies: ['React', 'Tailwind CSS', 'Netlify'],
      features: ['Factures & proforma express', 'Gestion des bons de commande', 'Interface adaptée restauration'],
      liveUrl: 'https://koukamc.netlify.app/',
      githubUrl: 'https://github.com/tcbrenato',
      status: 'Terminé'
    },
    {
      id: 7,
      title: 'JEUD Bénin – Plateforme de Mobilisation',
      description: 'Site web de mobilisation pour le mouvement JEUD (Jeunesse Unie pour le Développement), favorisant l\'engagement citoyen et la communication du mouvement.',
      image: '/jeud.png',
      category: 'web',
      technologies: ['React', 'Tailwind CSS', 'Netlify'],
      features: ['Présentation du mouvement', 'Mobilisation et adhésion en ligne', 'Communication institutionnelle'],
      liveUrl: 'https://jeudbenin.netlify.app/',
      githubUrl: 'https://github.com/tcbrenato',
      status: 'Terminé'
    },
    {
      id: 8,
      title: 'Ankara By K – Boutique de Tissus en Ligne',
      description: 'Plateforme de vente en ligne de tissus ankara, batik et adiré, valorisant le textile africain auprès d\'une clientèle locale et internationale.',
      image: '/ankara.png',
      category: 'ecommerce',
      technologies: ['React', 'Tailwind CSS', 'Netlify'],
      features: ['Catalogue de tissus', 'Vente en ligne', 'Valorisation du textile africain'],
      liveUrl: 'https://ankara-by-k.netlify.app/',
      githubUrl: 'https://github.com/tcbrenato',
      status: 'Terminé'
    },
    {
      id: 9,
      title: 'Marketing & Communication Digitale – La Roche Bénin',
      description: 'Gestion de la stratégie de marketing digital visant à renforcer la visibilité de l\'entreprise, promouvoir les offres et développer l\'engagement en ligne.',
      image: 'https://i.ibb.co/VWZsSStH/images.png',
      category: 'marketing',
      technologies: ['Stratégie digitale', 'Réseaux sociaux', 'Campagnes promotionnelles', 'Branding'],
      features: ['Création de contenus promotionnels', 'Gestion de la visibilité digitale', 'Campagnes marketing & offres commerciales', 'Communication institutionnelle'],
      liveUrl: '#',
      githubUrl: '#',
      status: 'En cours'
    },
    {
      id: 10,
      title: 'Refonte UI/UX & Image Digitale – CRF PERFECTION',
      description: 'Refonte graphique et amélioration de l\'interface utilisateur du site web afin d\'optimiser l\'expérience utilisateur et valoriser l\'image de marque.',
      image: 'https://i.ibb.co/0j9NPpzK/image.png',
      category: 'design',
      technologies: ['UI/UX Design', 'Figma', 'Identité visuelle', 'Web design'],
      features: ['Refonte visuelle du site web', 'Amélioration de l\'ergonomie', 'Cohérence graphique', 'Valorisation de l\'image digitale'],
      liveUrl: '#',
      githubUrl: '#',
      status: 'Terminé'
    },
    {
      id: 11,
      title: 'Campagne Visuelle – White Party (Paouignan)',
      description: 'Création de supports graphiques pour la promotion d\'un événement festif et l\'augmentation de la participation.',
      image: 'https://i.ibb.co/wh5M0t6W/1a1d1117-7192-40a4-b3d8-12424dc48ce6.jpg',
      category: 'marketing',
      technologies: ['Design graphique', 'Canva', 'Communication événementielle'],
      features: ['Affiches promotionnelles', 'Visuels pour réseaux sociaux', 'Communication événementielle'],
      liveUrl: '#',
      githubUrl: '#',
      status: 'Terminé'
    },
    {
      id: 12,
      title: 'Communication Visuelle – Restaurant Hakuna Matata (EKPE)',
      description: 'Création d\'affiches et visuels promotionnels pour valoriser les menus et renforcer la visibilité locale du restaurant.',
      image: 'https://i.ibb.co/DPDQfx3g/208ab9caff3f638918f22588b8bcbc9a.jpg',
      category: 'marketing',
      technologies: ['Design graphique', 'Branding', 'Communication locale'],
      features: ['Affiches de menus', 'Visuels promotionnels', 'Valorisation de l\'offre culinaire'],
      liveUrl: '#',
      githubUrl: '#',
      status: 'Terminé'
    },
    {
      id: 13,
      title: 'Créations Graphiques – Entrepreneurs & Artisans',
      description: 'Réalisation d\'affiches publicitaires pour des couturières, stylistes, services de rédaction professionnelle et pâtissières.',
      image: 'https://i.ibb.co/1fQfh1FX/87926c4a-842a-438c-b88a-e91c851e44d4.jpg',
      category: 'marketing',
      technologies: ['Canva', 'Design graphique', 'Marketing visuel'],
      features: ['Affiches publicitaires', 'Communication visuelle', 'Promotion de services'],
      liveUrl: '#',
      githubUrl: '#',
      status: 'Terminé'
    }
  ];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  const stats = [
    { number: '18+', label: 'Projets Réalisés' },
    { number: '12+', label: 'Clients Satisfaits' },
    { number: '98%', label: 'Projets Livrés à Temps' },
    { number: '5★', label: 'Note Moyenne' }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={heroRef}
            className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
              heroVisible ? 'animate-slide-up' : 'opacity-0'
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6">
              Mes <span className="text-primary-500">Réalisations</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Découvrez une sélection de mes réalisations récentes — des solutions digitales
              concrètes qui ont transformé l'activité de mes clients au Bénin et ailleurs.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold font-heading text-primary-500 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white sticky top-16 z-40 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <filter.icon className="h-4 w-4" />
                <span>{filter.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={projectsRef}
            className={`transition-all duration-1000 ${
              projectsVisible ? 'animate-slide-up' : 'opacity-0'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'Terminé'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-3">
                        {project.liveUrl !== '#' && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white rounded-full hover:bg-primary-500 hover:text-white transition-colors duration-300"
                            aria-label="Voir le projet"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        )}
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white rounded-full hover:bg-primary-500 hover:text-white transition-colors duration-300"
                          aria-label="Voir le code"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold font-heading text-gray-900 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Fonctionnalités clés :</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {project.features.slice(0, 3).map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      {project.liveUrl !== '#' ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-primary-500 text-white text-center py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors duration-300 text-sm font-medium"
                        >
                          Voir le projet
                        </a>
                      ) : (
                        <span className="flex-1 bg-gray-200 text-gray-400 text-center py-2 px-4 rounded-lg text-sm font-medium cursor-not-allowed">
                          Bientôt en ligne
                        </span>
                      )}
                      <a
                        href="https://github.com/tcbrenato"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 border border-gray-300 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm font-medium"
                      >
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Aucun projet trouvé
                </h3>
                <p className="text-gray-500">
                  Essayez un autre filtre pour voir d'autres projets.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
              Comment je travaille
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chaque projet suit une méthodologie rigoureuse pour garantir des résultats exceptionnels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Analyse',
                description: 'Étude approfondie de vos besoins et de votre marché cible.'
              },
              {
                step: '02',
                title: 'Conception',
                description: 'Création des maquettes et définition de l\'architecture technique.'
              },
              {
                step: '03',
                title: 'Développement',
                description: 'Codage et intégration avec feedback régulier et tests continus.'
              },
              {
                step: '04',
                title: 'Déploiement',
                description: 'Mise en ligne, formation et accompagnement post-lancement.'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold font-heading">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold font-heading text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            Votre projet mérite le même niveau d'excellence
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Discutons de votre vision et créons ensemble une solution digitale qui marquera la différence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-primary-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              Démarrer un projet
            </a>
            <a
              href="/services"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-500 transition-all duration-300"
            >
              Voir mes services
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;