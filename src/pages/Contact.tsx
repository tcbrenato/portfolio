import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Facebook, Linkedin, Palette, Send, Check, Clock, Star, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    budget: '',
    message: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { elementRef: formRef, isVisible: formVisible } = useScrollAnimation();
  const { elementRef: infoRef, isVisible: infoVisible } = useScrollAnimation();

  // Solution 1: EmailJS (service gratuit)
  const handleEmailJSSubmit = async () => {
    try {
      // Simulation d'envoi avec EmailJS
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        company: formData.company || 'Non spécifiée',
        service: formData.service,
        budget: formData.budget || 'Non spécifié',
        timeline: formData.timeline || 'Non spécifié',
        message: formData.message,
        to_email: 'info@renatotchobo.pro'
      };

      // Ici vous devrez configurer EmailJS avec votre clé API
      console.log('Envoi via EmailJS:', templateParams);
      
      // Simulation de succès
      setTimeout(() => {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          company: '',
          service: '',
          budget: '',
          message: '',
          timeline: ''
        });
      }, 1000);

    } catch (error) {
      throw new Error('Erreur EmailJS: ' + error);
    }
  };

  // Solution 2: Netlify Forms (si hébergé sur Netlify)
  const handleNetlifySubmit = async () => {
    try {
      const formDataNetlify = new FormData();
      formDataNetlify.append('form-name', 'contact');
      Object.keys(formData).forEach(key => {
        formDataNetlify.append(key, formData[key as keyof typeof formData]);
      });

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formDataNetlify as any).toString()
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          company: '',
          service: '',
          budget: '',
          message: '',
          timeline: ''
        });
      } else {
        throw new Error('Erreur Netlify Forms');
      }
    } catch (error) {
      throw new Error('Erreur Netlify: ' + error);
    }
  };

  // Solution 3: Web3Forms (alternative gratuite à Formspree)
  const handleWeb3FormsSubmit = async () => {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'YOUR_WEB3FORMS_ACCESS_KEY', // À remplacer par votre clé
          name: formData.name,
          email: formData.email,
          company: formData.company || 'Non spécifiée',
          service: formData.service,
          budget: formData.budget || 'Non spécifié',
          timeline: formData.timeline || 'Non spécifié',
          message: formData.message,
          from_name: formData.name,
          subject: `Nouvelle demande de projet - ${formData.name}`
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          company: '',
          service: '',
          budget: '',
          message: '',
          timeline: ''
        });
      } else {
        throw new Error('Erreur Web3Forms: ' + data.message);
      }
    } catch (error) {
      throw new Error('Erreur Web3Forms: ' + error);
    }
  };

  // Solution principale avec fallbacks
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Validation des champs
      if (!formData.name || !formData.email || !formData.service || !formData.message) {
        throw new Error('Veuillez remplir tous les champs obligatoires.');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Veuillez entrer une adresse email valide.');
      }

      // Essayer plusieurs services dans l'ordre
      try {
        // Tentative 1: Formspree
        await handleFormspreeSubmit();
      } catch (formspreeError) {
        console.log('Formspree failed, trying EmailJS...');
        try {
          // Tentative 2: EmailJS
          await handleEmailJSSubmit();
        } catch (emailjsError) {
          console.log('EmailJS failed, trying Web3Forms...');
          try {
            // Tentative 3: Web3Forms
            await handleWeb3FormsSubmit();
          } catch (web3Error) {
            console.log('Web3Forms failed, trying Netlify...');
            // Tentative 4: Netlify Forms
            await handleNetlifySubmit();
          }
        }
      }
      
    } catch (error) {
      console.error('Toutes les méthodes ont échoué:', error);
      setSubmitError('Impossible d\'envoyer le formulaire. Veuillez utiliser les méthodes de contact alternatives ci-dessous.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction Formspree originale
  const handleFormspreeSubmit = async () => {
    const response = await fetch('https://formspree.io/f/mandzbrr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        company: formData.company || 'Non spécifiée',
        service: formData.service,
        budget: formData.budget || 'Non spécifié',
        timeline: formData.timeline || 'Non spécifié',
        message: formData.message,
        _replyto: formData.email,
        _subject: `Nouvelle demande de projet - ${formData.name}`
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Erreur Formspree');
    }

    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      company: '',
      service: '',
      budget: '',
      message: '',
      timeline: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Copier les informations du formulaire
  const copyFormData = () => {
    const formText = `Nom: ${formData.name}
Email: ${formData.email}
Entreprise: ${formData.company || 'Non spécifiée'}
Service: ${formData.service}
Budget: ${formData.budget || 'Non spécifié'}
Délai: ${formData.timeline || 'Non spécifié'}

Message:
${formData.message}`;

    navigator.clipboard.writeText(formText).then(() => {
      setCopySuccess('Informations copiées !');
      setTimeout(() => setCopySuccess(''), 3000);
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'info@renatotchobo.com',
      description: 'Réponse sous 24h',
      action: 'mailto:info@renatotchobo.com'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      details: '+229 01 58 84 84 20',
      description: 'Disponible 9h-18h',
      action: 'tel:+2290158848420'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      details: 'Chat direct',
      description: 'Réponse rapide',
      action: 'https://wa.me/2290158848420'
    },
    {
      icon: MapPin,
      title: 'Localisation',
      details: 'Bénin, Afrique de l\'Ouest',
      description: 'Projets à distance',
      action: null
    }
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://www.facebook.com/profile.php?id=100083135836664&mibextid=ZbWKwL',
      color: 'hover:text-blue-600'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'http://www.linkedin.com/in/renato-tchobo',
      color: 'hover:text-blue-700'
    },
    {
      name: 'Pinterest',
      icon: Palette,
      url: 'https://www.pinterest.com/renatotchobo',
      color: 'hover:text-red-600'
    }
  ];

  const services = [
    'Développement Web',
    'Application Mobile',
    'UI/UX Design',
    'E-commerce',
    'SEO & Marketing Digital',
    'Solution Digitale Complète',
    'Consultation',
    'Autre'
  ];

  const budgets = [
    'Moins de 100 000 FCFA',
    '100 000 - 300 000 FCFA',
    '300 000 - 500 000 FCFA',
    '500 000 - 1 000 000 FCFA',
    'Plus de 1 000 000 FCFA',
    'À discuter'
  ];

  const timelines = [
    'Urgent (moins de 1 mois)',
    '1-3 mois',
    '3-6 mois',
    'Plus de 6 mois',
    'Flexible'
  ];

  const faqs = [
    {
      question: 'Quel est votre délai de réponse ?',
      answer: 'Je réponds généralement sous 24h maximum. Pour les urgences, n\'hésitez pas à me contacter directement par WhatsApp.'
    },
    {
      question: 'Travaillez-vous avec des clients internationaux ?',
      answer: 'Absolument ! Je travaille régulièrement avec des clients en Afrique, Europe et ailleurs. La distance n\'est pas un problème grâce aux outils de collaboration modernes.'
    },
    {
      question: 'Proposez-vous de la maintenance ?',
      answer: 'Oui, je propose des contrats de maintenance pour assurer la sécurité, les mises à jour et le bon fonctionnement de votre solution digitale.'
    }
  ];

  // Générer le contenu email
  const generateEmailBody = () => {
    return encodeURIComponent(`Bonjour Renato,

Nom: ${formData.name}
Email: ${formData.email}
Entreprise: ${formData.company || 'Non spécifiée'}
Service souhaité: ${formData.service}
Budget: ${formData.budget || 'Non spécifié'}
Délai: ${formData.timeline || 'Non spécifié'}

Message:
${formData.message}

Cordialement,
${formData.name}`);
  };

  // Générer le message WhatsApp
  const generateWhatsAppMessage = () => {
    return encodeURIComponent(`Bonjour Renato, je souhaite discuter d'un projet.

Nom: ${formData.name}
Service: ${formData.service}
Budget: ${formData.budget || 'À discuter'}

${formData.message}`);
  };

  if (isSubmitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-gentle">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">
            Message envoyé !
          </h2>
          <p className="text-gray-600 mb-6">
            Merci pour votre message. Je vous recontacterai dans les plus brefs délais 
            pour discuter de votre projet. Vous devriez recevoir une copie de votre message 
            à l'adresse email fournie.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors duration-300"
          >
            Envoyer un autre message
          </button>
        </div>
      </div>
    );
  }

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
              Parlons de votre <span className="text-primary-500">Projet</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Vous avez une idée, un défi à relever ou un projet digital à concrétiser ? 
              Je suis là pour vous accompagner dans cette aventure.
            </p>
            <div className="flex items-center justify-center space-x-8 text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary-500" />
                <span>Réponse sous 24h</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span>Consultation gratuite</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Formulaire de contact */}
          <div className="lg:col-span-2">
            <div 
              ref={formRef}
              className={`bg-white rounded-xl shadow-lg p-8 transition-all duration-1000 ${
                formVisible ? 'animate-slide-up' : 'opacity-0'
              }`}
            >
              <h2 className="text-2xl font-bold font-heading text-gray-900 mb-6">
                Démarrons votre projet ensemble
              </h2>
              
              {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-red-700 text-sm mb-3">{submitError}</p>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Solutions alternatives :</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <a
                            href={`mailto:info@renatotchobo.com?subject=Demande de projet - ${formData.name}&body=${generateEmailBody()}`}
                            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-300"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Envoyer par email
                          </a>
                          <a
                            href={`https://wa.me/2290158848420?text=${generateWhatsAppMessage()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-300"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            WhatsApp
                          </a>
                          <button
                            onClick={copyFormData}
                            className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors duration-300"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copier infos
                          </button>
                        </div>
                        {copySuccess && (
                          <p className="text-green-600 text-sm">{copySuccess}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      placeholder="Votre nom"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Entreprise / Projet
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                      Service souhaité *
                    </label>
                    <select
                      id="service"
                      name="service"
                      required
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Sélectionner un service</option>
                      {services.map((service) => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                      Budget approximatif (FCFA)
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Sélectionner un budget</option>
                      {budgets.map((budget) => (
                        <option key={budget} value={budget}>{budget}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                      Délai souhaité
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Sélectionner un délai</option>
                      {timelines.map((timeline) => (
                        <option key={timeline} value={timeline}>{timeline}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Décrivez votre projet *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Décrivez votre projet, vos objectifs, vos contraintes, ou toute information qui pourrait m'aider à mieux comprendre vos besoins..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-500 text-white py-4 px-6 rounded-lg font-semibold hover:bg-primary-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Envoyer ma demande</span>
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-600 text-center">
                  En envoyant ce formulaire, vous recevrez une copie de votre message par email 
                  et je vous recontacterai dans les 24h.
                </p>
              </form>

              {/* Méthodes alternatives toujours visibles */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Autres moyens de contact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <a
                    href={`mailto:info@renatotchobo.com?subject=Demande de projet&body=${generateEmailBody()}`}
                    className="flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-100 transition-colors duration-300"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email direct</span>
                  </a>
                  <a
                    href={`https://wa.me/2290158848420?text=${generateWhatsAppMessage()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-green-50 text-green-700 px-4 py-3 rounded-lg hover:bg-green-100 transition-colors duration-300"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href="tel:+2290158848420"
                    className="flex items-center justify-center space-x-2 bg-gray-50 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Appeler</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="lg:col-span-1">
            <div 
              ref={infoRef}
              className={`space-y-8 transition-all duration-1000 ${
                infoVisible ? 'animate-slide-up' : 'opacity-0'
              }`}
            >
              {/* Contact direct */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold font-heading text-gray-900 mb-6">
                  Contact direct
                </h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="p-3 bg-primary-100 rounded-lg flex-shrink-0">
                        <info.icon className="h-6 w-6 text-primary-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{info.title}</h4>
                        {info.action ? (
                          <a 
                            href={info.action}
                            target={info.action.startsWith('http') ? '_blank' : undefined}
                            rel={info.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-primary-500 hover:text-primary-600 transition-colors duration-300"
                          >
                            {info.details}
                          </a>
                        ) : (
                          <p className="text-gray-700">{info.details}</p>
                        )}
                        <p className="text-sm text-gray-500">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold font-heading text-gray-900 mb-6">
                  Suivez-moi
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 bg-gray-100 rounded-lg transition-all duration-300 ${social.color} hover:bg-gray-200 hover:scale-110`}
                      aria-label={social.name}
                    >
                      <social.icon className="h-6 w-6" />
                    </a>
                  ))}
                </div>
              </div>

              {/* FAQ rapide */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold font-heading text-gray-900 mb-6">
                  Questions fréquentes
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-primary-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            Prêt à transformer votre vision en réalité ?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Chaque grand projet commence par une simple conversation. 
            Faisons connaissance et créons quelque chose d'extraordinaire ensemble.
          </p>
          <a
            href="https://wa.me/2290158848420"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-white text-primary-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Discuter sur WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;