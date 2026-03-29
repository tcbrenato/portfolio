import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Linkedin, MessageCircle, Palette, Code, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/profile.php?id=100083135836664&mibextid=ZbWKwL', color: 'hover:text-blue-600' },
    { name: 'LinkedIn', icon: Linkedin, url: 'http://www.linkedin.com/in/renato-tchobo', color: 'hover:text-blue-700' },
    { name: 'Pinterest', icon: Palette, url: 'https://www.pinterest.com/renatotchobo', color: 'hover:text-red-600' },
    { name: 'WhatsApp', icon: MessageCircle, url: 'https://wa.me/2290158848420', color: 'hover:text-green-600' }
  ];

  const quickLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projets', path: '/projects' },
    { name: 'Contact', path: '/contact' }
  ];

  const services = [
    'Développement Web', 'Applications Mobiles', 'UI/UX Design', 'SEO & Marketing Digital', 'Plateformes E-commerce', 'Solutions Digitales'
  ];

  return (
    <>
      {/* Barre drapeau Bénin avant le footer */}
      <div className="w-full flex h-2">
        <div className="flex-1 bg-green-500"></div>
        <div className="flex-1 bg-yellow-500"></div>
        <div className="flex-1 bg-red-500"></div>
      </div>

      <footer className="bg-gray-900 text-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
            {/* À propos */}
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <div className="p-2 bg-primary-500 rounded-lg">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading">Rénato TCHOBO</h3>
                  <p className="text-gray-400 text-sm">Solutions Digitales</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Créateur de solutions digitales passionné, basé au Bénin. Expert en développement web, design et stratégies numériques.
              </p>
              <div className="flex justify-center md:justify-start space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 bg-gray-800 rounded-lg transition-all duration-300 ${social.color} hover:bg-gray-700 hover:scale-110`}
                    aria-label={social.name}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Liens rapides */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold font-heading">Navigation</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold font-heading">Services</h4>
              <ul className="space-y-2">
                {services.map((service) => (
                  <li key={service}>
                    <span className="text-gray-300 text-sm">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold font-heading">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <MapPin className="h-4 w-4 text-primary-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">Bénin, Afrique de l'Ouest</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <Phone className="h-4 w-4 text-primary-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">+229 01 58 84 84 20 / 01 92 37 77 77</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <Mail className="h-4 w-4 text-primary-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">info@renatotchobo.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Séparateur et copyright */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-center md:justify-between items-center text-center md:text-left space-y-2 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Rénato TCHOBO. Tous droits réservés.
            </p>
            <p className="text-gray-400 text-sm flex items-center justify-center md:justify-start">
              Conçu avec <Heart className="h-4 w-4 text-red-500 mx-1" /> au Bénin
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
