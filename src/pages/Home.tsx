import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Code, Palette, Smartphone, TrendingUp, Users, Award, ArrowRight, Star } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Home = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const heroRef = React.useRef<HTMLDivElement>(null);

  const titles = [
    "Créateur de solutions digitales",
    "Développeur web polyvalent",
    "Expert en UI/UX Design",
    "Spécialiste SEO & Marketing",
    "Chef de Projet Digital",
    "Product Manager / Product Owner",
    "Growth Hacker / Spécialiste en Acquisition",
    "Consultant en Transformation Digitale",
    "Spécialiste en Automatisation Marketing"
  ];

  const { elementRef: statsRef, isVisible: statsVisible } = useScrollAnimation();
  const { elementRef: servicesRef, isVisible: servicesVisible } = useScrollAnimation();
  const { elementRef: testimonialRef, isVisible: testimonialVisible } = useScrollAnimation();

  // Typewriter pour les titres du hero
  useEffect(() => {
    const currentTitle = titles[currentIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex <= currentTitle.length) {
        setDisplayedText(currentTitle.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % titles.length);
        }, 5000);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [currentIndex]);

  // Carousel
  const [currentIndexSlide, setCurrentIndexSlide] = useState(0);
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIndexSlide(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  // Typewriter effect pour le bloc code du carousel
  const codeLines = [
    "import React from 'react';",
    "",
    "export default function App() {",
    "  return (",
    "    <div className='hero'>",
    "      <h1>Bienvenue sur mon site, je suis Rénato TCHOBO...🚀</h1>",
    "    </div>",
    "  );",
    "}"
  ];

  const [displayedCode, setDisplayedCode] = useState('');
  const [currentCodeLine, setCurrentCodeLine] = useState(0);

  useEffect(() => {
    if (currentIndexSlide === 2) { // slide "code"
      let charIndex = 0;
      setDisplayedCode('');
      const typeLine = () => {
        const interval = setInterval(() => {
          if (charIndex <= codeLines[currentCodeLine].length) {
            setDisplayedCode(prev => prev + codeLines[currentCodeLine][charIndex] || '');
            charIndex++;
          } else {
            clearInterval(interval);
            setDisplayedCode(prev => prev + '\n');
            setCurrentCodeLine(prev => prev + 1);
          }
        }, 30);
      };
      if (currentCodeLine < codeLines.length) typeLine();
    } else {
      setCurrentCodeLine(0);
      setDisplayedCode('');
    }
  }, [currentIndexSlide, currentCodeLine]);

  const stats = [
    { number: '50+', label: 'Projets Réalisés', icon: Code },
    { number: '30+', label: 'Clients Satisfaits', icon: Users },
    { number: '5+', label: 'Années d\'Expérience', icon: Award },
    { number: '99%', label: 'Taux de Satisfaction', icon: Star },
  ];

  const services = [
    { icon: Code, title: 'Développement Web', description: 'Sites web modernes, applications web performantes et plateformes e-commerce sur mesure.', color: 'bg-blue-500' },
    { icon: Smartphone, title: 'Applications Mobiles', description: 'Applications iOS et Android natives ou hybrides pour votre business mobile.', color: 'bg-green-500' },
    { icon: Palette, title: 'UI/UX Design', description: 'Interfaces utilisateur intuitives et expériences digitales exceptionnelles.', color: 'bg-purple-500' },
    { icon: TrendingUp, title: 'SEO & Marketing Digital', description: 'Stratégies digitales pour améliorer votre visibilité et générer plus de leads.', color: 'bg-orange-500' }
  ];

  const testimonials = [
    { name: "Marie Kouassi", role: "Directrice Marketing, TechCorp", content: "Rénato a transformé notre vision en une plateforme digitale exceptionnelle. Son expertise technique et sa créativité ont dépassé nos attentes.", rating: 5 },
    { name: "Jean-Baptiste Adé", role: "Founder, StartupBénin", content: "Un professionnel remarquable ! Il a su comprendre nos besoins et livrer une solution parfaitement adaptée à notre marché local.", rating: 5 },
    { name: "Fatou Diallo", role: "Propriétaire, BoutiqueMode", content: "Grâce à Rénato, notre boutique en ligne génère maintenant 70% de notre chiffre d'affaires. Une collaboration extraordinaire !", rating: 5 }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23195885%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texte + boutons avec double contour animé */}
<div className="relative flex flex-col items-center lg:items-start text-center lg:text-left">
  <div className="relative p-8 rounded-2xl overflow-hidden">
    {/* Double contour animé */}
    <div className="absolute inset-0 border-2 border-primary-500 rounded-2xl pointer-events-none animate-border-slide"></div>
    <div className="absolute inset-2 border-2 border-primary-300 rounded-2xl pointer-events-none animate-border-slide-reverse"></div>

    {/* Contenu réel */}
    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 relative z-10">
      Salut, je suis <span className="text-primary-500">Rénato</span>
    </h1>
    <div className="h-16 mb-6 relative z-10">
      <h2 className="text-xl md:text-2xl text-gray-600 font-medium">
        {displayedText}
        <span className="animate-pulse">|</span>
      </h2>
    </div>
    <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed relative z-10">
      Basé au Bénin, je transforme vos idées en solutions digitales innovantes. 
      Passionné par la technologie, le design et l'impact positif du numérique.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 relative z-10">
      <Link
        to="/projects"
        className="bg-primary-500 text-white px-6 sm:px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
      >
        <span>Voir mes projets</span>
        <ArrowRight className="h-5 w-5" />
      </Link>
      <Link
        to="/contact"
        className="border-2 border-primary-500 text-primary-500 px-6 sm:px-8 py-4 rounded-lg font-semibold hover:bg-primary-500 hover:text-white transition-all duration-300 hover:scale-105"
      >
        Discutons de votre projet
      </Link>
    </div>
  </div>
</div>


            {/* Carousel */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-80 h-96 lg:w-96 lg:h-[500px] rounded-2xl shadow-2xl overflow-hidden">
                {["https://i.ibb.co/YBD7MDH9/TCB-RENATO-2.png","/ren4.jpg","code"].map((slide, index) => {
                  const isActive = index === currentIndexSlide;
                  return (
                    <div key={index} className={`absolute w-full h-full transition-opacity duration-700 ${isActive ? "opacity-100 z-20" : "opacity-0 z-10"}`}>
                      {slide === "code" ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-900 p-4">
                          <pre className="text-green-400 font-mono text-sm rounded-lg w-[80%] max-w-md whitespace-pre-wrap">
                            {displayedCode}
                            <span className="animate-pulse">|</span>
                          </pre>
                        </div>
                      ) : (
                        <img src={slide} alt={`Slide ${index + 2}`} className="w-full h-full object-cover rounded-2xl" />
                      )}
                    </div>
                  )
                })}
                {/* Navigation */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                  {["0","1","2"].map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentIndexSlide(idx)} className={`w-3 h-3 rounded-full ${currentIndexSlide === idx ? "bg-white" : "bg-gray-500"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-primary-500" />
        </div>
      </section>


      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={statsRef}
            className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 ${
              statsVisible ? 'animate-slide-up' : 'opacity-0'
            }`}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="mb-4 flex justify-center">
                  <div className="p-4 bg-primary-100 rounded-full group-hover:bg-primary-200 transition-colors duration-300">
                    <stat.icon className="h-8 w-8 text-primary-500" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold font-heading text-primary-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Aperçu */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={servicesRef}
            className={`text-center mb-16 transition-all duration-1000 ${
              servicesVisible ? 'animate-slide-up' : 'opacity-0'
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
              Services de Développement Web & Digital
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Je vous accompagne dans tous vos projets digitaux avec expertise et passion
            </p>
          </div>

          <div 
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 delay-300 ${
              servicesVisible ? 'animate-slide-up' : 'opacity-0'
            }`}
          >
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold font-heading text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center space-x-2 bg-primary-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition-all duration-300 hover:scale-105"
            >
              <span>Voir tous les services</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section À propos avec photo */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-6">
                Pourquoi choisir mes services ?
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Avec plus de 5 années d'expérience dans le développement web et le design, 
                je combine expertise technique et créativité pour créer des solutions qui font la différence.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Approche personnalisée pour chaque projet</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Technologies modernes et performantes</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Support et maintenance continue</span>
                </li>
              </ul>
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-all duration-300"
              >
                <span>En savoir plus</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src="/ren4.jpg" 
                  alt="Rénato TCHOBO en plein travail sur un projet digital"
                  className="w-full max-w-md rounded-2xl shadow-xl object-cover h-96"
                />
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-500 rounded-full opacity-20"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary-300 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={testimonialRef}
            className={`text-center mb-16 transition-all duration-1000 ${
              testimonialVisible ? 'animate-slide-up' : 'opacity-0'
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
              Avis & Témoignages Clients
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La satisfaction client est au cœur de mes priorités
            </p>
          </div>

          <div 
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-300 ${
              testimonialVisible ? 'animate-slide-up' : 'opacity-0'
            }`}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl relative hover:shadow-lg transition-shadow duration-300 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold font-heading text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {testimonial.role}
                  </div>
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
            Prêt à transformer votre idée en réalité ?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Discutons de votre projet et créons ensemble une solution digitale qui fera la différence
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 bg-white text-primary-500 px-6 sm:px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
          >
            <span>Commencer maintenant</span>
            <ArrowRight className="h-5 w-5" />
          </Link>

        </div>
      </section>
    </div>
  );
};

export default Home;
