import React from 'react';
import { Code, Palette, Globe, Award, Calendar, MapPin, Heart, Users, Target, TrendingUp } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const About = () => {
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { elementRef: storyRef, isVisible: storyVisible } = useScrollAnimation();
  const { elementRef: skillsRef, isVisible: skillsVisible } = useScrollAnimation();
  const { elementRef: valuesRef, isVisible: valuesVisible } = useScrollAnimation();
  const { elementRef: timelineRef, isVisible: timelineVisible } = useScrollAnimation();

  const skills = [
    {
      category: 'Développement',
      icon: Code,
      items: ['React', 'Node.js', 'PHP', 'JavaScript', 'TypeScript', 'Python'],
      color: 'bg-blue-500'
    },
    {
      category: 'Design',
      icon: Palette,
      items: ['UI/UX', 'Figma', 'Adobe Creative', 'Wireframing', 'Prototyping'],
      color: 'bg-purple-500'
    },
    {
      category: 'Marketing Digital',
      icon: TrendingUp,
      items: ['SEO', 'Google Ads', 'Analytics', 'Social Media', 'Content Strategy'],
      color: 'bg-green-500'
    },
    {
      category: 'Outils & Plateformes',
      icon: Globe,
      items: ['WordPress', 'Shopify', 'Git', 'Docker', 'AWS', 'Firebase'],
      color: 'bg-orange-500'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Passion',
      description: 'Chaque projet est abordé avec enthousiasme et dévouement pour créer des solutions exceptionnelles.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Je crois en la co-création avec mes clients pour des résultats qui dépassent les attentes.'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'Recherche constante de la perfection dans chaque détail, du code au design final.'
    },
    {
      icon: Globe,
      title: 'Innovation',
      description: 'Adoption des dernières technologies pour créer des solutions modernes et durables.'
    }
  ];

  const timeline = [
    {
      year: '2019',
      title: 'Débuts en Développement',
      description: 'Première immersion dans le monde du développement web avec HTML, CSS et JavaScript.'
    },
    {
      year: '2020',
      title: 'Formation Approfondie',
      description: 'Spécialisation en React et Node.js, premiers projets clients et freelance.'
    },
    {
      year: '2021',
      title: 'Expansion des Services',
      description: 'Intégration du design UI/UX et du marketing digital dans mon offre de services.'
    },
    {
      year: '2022',
      title: 'Solutions E-commerce',
      description: 'Développement d\'expertise en plateformes e-commerce et solutions pour PME.'
    },
    {
      year: '2023',
      title: 'Applications Mobiles',
      description: 'Extension vers le développement mobile et les solutions digitales complètes.'
    },
    {
      year: '2024',
      title: 'Leader Digital',
      description: 'Positionnement comme expert en transformation digitale au Bénin et en Afrique.'
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={heroRef}
            className={`max-w-6xl mx-auto transition-all duration-1000 ${
              heroVisible ? 'animate-slide-up' : 'opacity-0'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Photo principale */}
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-500 rounded-2xl transform rotate-6"></div>
                  <img 
                    src="https://i.ibb.co/jvLT2zHX/t-l-chargement-4.jpg" 
                    alt="Rénato TCHOBO - Créateur de solutions digitales"
                    className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl object-cover h-96 lg:h-[500px]"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">Disponible pour projets</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenu textuel */}
              <div className="order-1 lg:order-2 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6">
                  Salut, je suis <span className="text-primary-500">Rénato</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  Créateur de solutions digitales passionné, je transforme les idées en expériences 
                  numériques exceptionnelles depuis le cœur de l'Afrique de l'Ouest.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8 text-gray-600 mb-8">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary-500" />
                    <span>Bénin, Afrique</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary-500" />
                    <span>5+ années d'expérience</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a
                    href="/projects"
                    className="bg-primary-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Voir mes projets
                  </a>
                  <a
                    href="/contact"
                    className="border-2 border-primary-500 text-primary-500 px-8 py-4 rounded-lg font-semibold hover:bg-primary-500 hover:text-white transition-all duration-300"
                  >
                    Discutons ensemble
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section avec photos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={storyRef}
            className={`max-w-6xl mx-auto transition-all duration-1000 ${
              storyVisible ? 'animate-slide-up' : 'opacity-0'
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-12 text-center">
              Mon Histoire
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Photo au travail */}
              <div className="relative group">
                <img 
                  src="/ren4.jpg" 
                  alt="Rénato au travail"
                  className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                />
                <div className="absolute inset-0 bg-primary-500 bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">Dans mon élément</p>
                </div>
              </div>

              {/* Photo professionnelle */}
              <div className="relative group">
                <img 
                  src="/ren5.jpg" 
                  alt="Rénato professionnel"
                  className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                />
                <div className="absolute inset-0 bg-primary-500 bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">Professionnel</p>
                </div>
              </div>

              {/* Photo décontractée */}
              <div className="relative group">
                <img 
                  src="/ren6.jpg" 
                  alt="Rénato décontracté"
                  className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                />
                <div className="absolute inset-0 bg-primary-500 bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">Authenticité</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Né au Bénin, j'ai toujours été fasciné par la technologie et son pouvoir de transformation. 
                Mon parcours a commencé par une curiosité pour le code, qui s'est rapidement transformée 
                en passion pour la création de solutions digitales qui ont un impact réel.
              </p>
              <p>
                Ce qui me motive chaque jour, c'est la possibilité de contribuer à la transformation 
                digitale de l'Afrique. Chaque projet est une opportunité de créer quelque chose d'unique, 
                de résoudre un problème concret et d'aider mes clients à atteindre leurs objectifs.
              </p>
              <p>
                Au-delà de la technique, je crois profondément en l'importance du design et de l'expérience 
                utilisateur. Une solution digitale ne doit pas seulement fonctionner, elle doit être 
                intuitive, belle et créer une connexion émotionnelle avec ses utilisateurs.
              </p>
              <div className="bg-primary-50 p-6 rounded-xl border-l-4 border-primary-500">
                <p className="text-primary-700 font-semibold text-xl italic">
                  "Mon objectif est simple : transformer vos idées les plus ambitieuses en réalités 
                  digitales qui dépassent vos attentes."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
<section className="py-20 bg-gray-50">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div 
      ref={skillsRef}
      className={`text-center mb-16 transition-all duration-1000 ${
        skillsVisible ? 'animate-slide-up' : 'opacity-0'
      }`}
    >
      <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
        Mes Compétences
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Un ensemble de compétences techniques, créatives et stratégiques pour couvrir tous vos besoins digitaux
      </p>
    </div>

    <div 
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-300 ${
        skillsVisible ? 'animate-slide-up' : 'opacity-0'
      }`}
    >
      {[
        {
          category: "Développement Web",
          icon: Code,
          color: "bg-blue-500",
          items: [
            "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", 
            "Node.js", "PHP", "Python", "Bootstrap"
          ]
        },
        {
          category: "CMS & No-Code",
          icon: Globe,
          color: "bg-orange-500",
          items: [
            "WordPress", "Shopify", "Glide", "Adalo", "Bubble", "Bolt"
          ]
        },
        {
          category: "Design & UI/UX",
          icon: Palette,
          color: "bg-purple-500",
          items: [
            "UI/UX Design", "Figma", "Wireframing", "Prototypage", 
            "Adobe Creative Suite", "Canva"
          ]
        },
        {
          category: "Marketing Digital",
          icon: TrendingUp,
          color: "bg-green-500",
          items: [
            "SEO (stratégique & technique)", "Google Analytics", 
            "Google Ads", "Email Marketing", "Content Strategy", "Social Media"
          ]
        },
        {
          category: "Gestion & Méthodes",
          icon: Users,
          color: "bg-red-500",
          items: [
            "Gestion de projets numériques", "Stratégie digitale", 
            "Notion", "Trello", "Asana", "Scrum", "Kanban"
          ]
        },
        {
          category: "Outils & Automatisation",
          icon: Award,
          color: "bg-yellow-500",
          items: [
            "Zapier", "Make", "Git", "Docker", "AWS", "Firebase"
          ]
        },
        {
          category: "Création de Contenu",
          icon: Heart,
          color: "bg-pink-500",
          items: [
            "Rédaction", "Création de visuels", "Photographie", 
            "Montage vidéo", "Branding personnel"
          ]
        },
        {
          category: "E-commerce",
          icon: Target,
          color: "bg-indigo-500",
          items: [
            "Création de boutiques", "Optimisation SEO", 
            "Gestion produits & paiements", "Stratégie de vente"
          ]
        }
      ].map((skill, index) => (
        <div 
          key={index} 
          className="relative group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
        >
          {/* Bordure externe */}
          <div className="absolute inset-0 rounded-xl border-2 border-gray-200 group-hover:border-primary-400 transition-colors duration-300"></div>

          {/* Bordure interne */}
          <div className="absolute inset-1 rounded-lg border border-gray-100 group-hover:border-primary-300 transition-colors duration-300"></div>
          
          {/* Contenu */}
          <div className="relative p-6">
            <div className={`w-12 h-12 ${skill.color} rounded-lg flex items-center justify-center mb-4`}>
              <skill.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold font-heading text-gray-900 mb-4">
              {skill.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skill.items.map((item, itemIndex) => (
                <span 
                  key={itemIndex} 
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={valuesRef}
            className={`text-center mb-16 transition-all duration-1000 ${
              valuesVisible ? 'animate-slide-up' : 'opacity-0'
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
              Mes Valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Les principes qui guident mon travail et mes relations avec mes clients
            </p>
          </div>

          <div 
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 delay-300 ${
              valuesVisible ? 'animate-slide-up' : 'opacity-0'
            }`}
          >
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-primary-100 rounded-full group-hover:bg-primary-200 transition-colors duration-300 group-hover:scale-110">
                    <value.icon className="h-8 w-8 text-primary-500" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold font-heading text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={timelineRef}
            className={`text-center mb-16 transition-all duration-1000 ${
              timelineVisible ? 'animate-slide-up' : 'opacity-0'
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
              Mon Parcours
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              L'évolution de mon expertise et de mes services au fil des années
            </p>
          </div>

          <div 
            className={`max-w-4xl mx-auto transition-all duration-1000 delay-300 ${
              timelineVisible ? 'animate-slide-up' : 'opacity-0'
            }`}
          >
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary-200"></div>
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-full max-w-md ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="text-primary-500 font-bold text-lg mb-2">{item.year}</div>
                      <h3 className="text-xl font-semibold font-heading text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary-500 rounded-full border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            Collaborons ensemble
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Vous avez un projet en tête ? Discutons de la façon dont nous pouvons le transformer en succès digital.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-primary-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              Démarrer un projet
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

export default About;