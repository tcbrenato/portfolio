import React, { useState } from 'react';
import { Code, Smartphone, Palette, TrendingUp, ShoppingCart, Globe, ArrowRight, Check, Star } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Services = () => {
  const [activeService, setActiveService] = useState(0);
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { elementRef: servicesRef, isVisible: servicesVisible } = useScrollAnimation();
  const { elementRef: processRef, isVisible: processVisible } = useScrollAnimation();
  const { elementRef: pricingRef, isVisible: pricingVisible } = useScrollAnimation();

  const services = [
    {
      icon: Code,
      title: 'Développement Web',
      shortDescription: 'Sites web modernes et applications sur mesure',
      fullDescription: 'Création de sites web responsive, applications web progressives et plateformes digitales performantes utilisant les dernières technologies.',
      features: [
        'Sites vitrine professionnels',
        'Applications web complexes',
        'Intégration API et services tiers',
        'Optimisation performance',
        'Sécurité et maintenance'
      ],
      technologies: ['React', 'Node.js', 'PHP', 'WordPress'],
      color: 'bg-blue-500',
      price: 'À partir de 150 000 FCFA'
    },
    {
      icon: Smartphone,
      title: 'Applications Mobiles',
      shortDescription: 'Apps iOS et Android natives et hybrides',
      fullDescription: 'Développement d\'applications mobiles innovantes pour iOS et Android, offrant une expérience utilisateur exceptionnelle.',
      features: [
        'Applications natives iOS/Android',
        'Apps hybrides cross-platform',
        'Interface utilisateur intuitive',
        'Intégration services mobiles',
        'Publication sur les stores'
      ],
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
      color: 'bg-green-500',
      price: 'À partir de 350 000 FCFA'
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      shortDescription: 'Design d\'interface et expérience utilisateur',
      fullDescription: 'Création d\'interfaces utilisateur intuitives et d\'expériences digitales engageantes qui convertissent vos visiteurs en clients.',
      features: [
        'Recherche utilisateur (UX Research)',
        'Wireframing et prototypage',
        'Design d\'interface moderne',
        'Tests d\'utilisabilité',
        'Guide de style et design système'
      ],
      technologies: ['Figma', 'Adobe XD', 'Sketch', 'Principle'],
      color: 'bg-purple-500',
      price: 'À partir de 200 000 FCFA'
    },
    {
      icon: TrendingUp,
      title: 'SEO & Marketing Digital',
      shortDescription: 'Stratégies pour booster votre visibilité en ligne',
      fullDescription: 'Optimisation de votre présence digitale pour améliorer votre visibilité, générer du trafic qualifié et augmenter vos conversions.',
      features: [
        'Audit SEO complet',
        'Optimisation on-page et technique',
        'Stratégie de contenu',
        'Campagnes publicitaires',
        'Analytics et reporting'
      ],
      technologies: ['Google Analytics', 'Search Console', 'SEMrush', 'Google Ads'],
      color: 'bg-orange-500',
      price: 'À partir de 75 000 FCFA/mois'
    },
    {
      icon: ShoppingCart,
      title: 'E-commerce',
      shortDescription: 'Boutiques en ligne performantes',
      fullDescription: 'Création de plateformes e-commerce complètes pour développer vos ventes en ligne avec des fonctionnalités avancées.',
      features: [
        'Boutique en ligne complète',
        'Gestion des commandes',
        'Paiements sécurisés',
        'Gestion des stocks',
        'Analytics de vente'
      ],
      technologies: ['Shopify', 'WooCommerce', 'Magento', 'Custom'],
      color: 'bg-red-500',
      price: 'À partir de 250 000 FCFA'
    },
    {
      icon: Globe,
      title: 'Solutions Digitales',
      shortDescription: 'Transformation digitale complète',
      fullDescription: 'Accompagnement global dans votre transformation digitale avec des solutions sur mesure adaptées à vos besoins spécifiques.',
      features: [
        'Audit digital complet',
        'Stratégie de transformation',
        'Outils de gestion personnalisés',
        'Formation et accompagnement',
        'Maintenance et évolution'
      ],
      technologies: ['Cloud', 'API', 'Automation', 'Integration'],
      color: 'bg-indigo-500',
      price: 'Sur devis'
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Découverte',
      description: 'Analyse de vos besoins, objectifs et contraintes pour définir la stratégie optimale.'
    },
    {
      step: '02',
      title: 'Planification',
      description: 'Création d\'un plan détaillé avec timeline, ressources et livrables définis.'
    },
    {
      step: '03',
      title: 'Développement',
      description: 'Mise en œuvre de la solution avec communication régulière et validation d\'étapes.'
    },
    {
      step: '04',
      title: 'Lancement',
      description: 'Déploiement, tests finaux et formation pour une mise en production réussie.'
    }
  ];

  const packs = [
    {
      name: 'Starter',
      price: '125 000 FCFA',
      description: 'Parfait pour débuter votre présence digitale',
      features: [
        'Site vitrine 5 pages',
        'Design responsive',
        'Optimisation SEO de base',
        'Formulaire de contact',
        '3 mois de support'
      ],
      popular: false
    },
    {
      name: 'Business',
      price: '300 000 FCFA',
      description: 'Solution complète pour entreprises',
      features: [
        'Site web avancé',
        'Espace administrateur',
        'Intégrations API',
        'SEO avancé',
        'Formation incluse',
        '6 mois de support'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Sur devis',
      description: 'Solutions sur mesure pour grands projets',
      features: [
        'Application complexe',
        'Architecture sur mesure',
        'Intégrations avancées',
        'Support prioritaire',
        'Évolutions continues'
      ],
      popular: false
    }
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
              Mes <span className="text-primary-500">Services</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Des solutions digitales complètes pour transformer votre présence en ligne 
              et accélérer votre croissance business.
            </p>
            <div className="flex items-center justify-center space-x-8 text-gray-600">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span>50+ Projets réalisés</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Satisfaction garantie</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image visuelle */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <img
              src="https://i.ibb.co/Nn1R8zMQ/bd8cbb74-bba3-4f5a-a04f-b8b65328b124.jpg"
              alt="Services Visuels"
              className="rounded-xl shadow-lg w-full max-w-4xl h-auto"
            />
          </div>
        </div>
      </section>

      {/* Services Détaillés */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={servicesRef}
            className={`transition-all duration-1000 ${
              servicesVisible ? 'animate-slide-up' : 'opacity-0'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Liste des services */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  {services.map((service, index) => (
                    <div
                      key={index}
                      onClick={() => setActiveService(index)}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-300 mb-4 ${
                        activeService === index
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${
                          activeService === index ? 'bg-white/20' : service.color
                        }`}>
                          <service.icon className={`h-6 w-6 ${
                            activeService === index ? 'text-white' : 'text-white'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold font-heading">{service.title}</h3>
                          <p className={`text-sm ${
                            activeService === index ? 'text-primary-100' : 'text-gray-600'
                          }`}>
                            {service.shortDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Détail du service actif */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 p-8 rounded-xl">
                  {(() => {
                    const IconComponent = services[activeService].icon;
                    return (
                      <div className="flex items-center space-x-4 mb-6">
                        <div className={`p-4 ${services[activeService].color} rounded-lg`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold font-heading text-gray-900">
                            {services[activeService].title}
                          </h2>
                          <p className="text-primary-500 font-semibold">
                            {services[activeService].price}
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                    {services[activeService].fullDescription}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold font-heading text-gray-900 mb-4">
                        Ce qui est inclus :
                      </h3>
                      <ul className="space-y-3">
                        {services[activeService].features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-3">
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold font-heading text-gray-900 mb-4">
                        Technologies utilisées :
                      </h3>
                      <div className="space-y-2">
                        {services[activeService].technologies.map((tech, index) => (
                          <span key={index} className="inline-block bg-white text-gray-700 px-3 py-2 rounded-lg mr-2 mb-2 font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <a
                      href="/contact"
                      className="inline-flex items-center space-x-2 bg-primary-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition-all duration-300 hover:scale-105"
                    >
                      <span>Demander un devis</span>
                      <ArrowRight className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={processRef}
            className={`text-center mb-16 transition-all duration-1000 ${
              processVisible ? 'animate-slide-up' : 'opacity-0'
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
              Mon Processus de Travail
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une méthodologie éprouvée pour garantir le succès de votre projet
            </p>
          </div>

          <div 
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 delay-300 ${
              processVisible ? 'animate-slide-up' : 'opacity-0'
            }`}
          >
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold font-heading">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold font-heading text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Packs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={pricingRef}
            className={`text-center mb-16 transition-all duration-1000 ${
              pricingVisible ? 'animate-slide-up' : 'opacity-0'
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
              Forfaits Populaires
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des solutions packagées pour répondre à différents besoins et budgets
            </p>
          </div>

          <div 
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto transition-all duration-1000 delay-300 ${
              pricingVisible ? 'animate-slide-up' : 'opacity-0'
            }`}
          >
            {packs.map((pack, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                pack.popular ? 'ring-2 ring-primary-500 scale-105' : ''
              }`}>
                {pack.popular && (
                  <div className="bg-primary-500 text-white text-center py-2 rounded-t-xl font-semibold">
                    Le plus populaire
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold font-heading text-gray-900 mb-2">
                    {pack.name}
                  </h3>
                  <div className="text-4xl font-bold text-primary-500 mb-4">
                    {pack.price}
                  </div>
                  <p className="text-gray-600 mb-6">
                    {pack.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {pack.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/contact"
                    className={`block text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      pack.popular
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Choisir ce forfait
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Discutons de vos besoins et trouvons ensemble la solution parfaite pour votre business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-primary-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              Obtenir un devis gratuit
            </a>
            <a
              href="/projects"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-500 transition-all duration-300"
            >
              Voir mes réalisations
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
