import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code, Download } from 'lucide-react';

// Hook Typewriter
const useTypewriter = (text, speed = 120, delay = 5000) => {
  const [displayed, setDisplayed] = useState('');
  const [loop, setLoop] = useState(0);

  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(interval);
        setTimeout(() => setLoop((prev) => prev + 1), delay);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, delay, loop]);

  return displayed;
};

const Header = () => {
  const [appsOpen, setAppsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const typewriterText = useTypewriter('Rénato TCHOBO', 100, 5000);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projets', path: '/projects' },
    { name: 'Formations', path: '/formation' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleDownloadCV = () => {
    window.open(
      'https://drive.google.com/file/d/1QCe5LURLEj85PAyQwtwBe4iag1reGtFs/view?usp=sharing',
      '_blank'
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      
      {/* Barre couleur du Bénin */}
      <div className="flex w-full h-1">
        <div className="flex-1 bg-[#009739]"></div>
        <div className="flex-1 bg-[#FCD116]"></div>
        <div className="flex-1 bg-[#EF3340]"></div>
      </div>

      {/* Header principal */}
      <div className="bg-primary-500 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between py-3">
            
            {/* Logo + Nom */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all duration-300">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold font-heading text-white">
                  {typewriterText}
                </h1>
                <p className="text-sm text-primary-100">Solutions Digitales</p>
              </div>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-white text-primary-500 shadow-md'
                      : 'text-white hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* CV Desktop + Google Apps Mobile */}
            <div className="flex items-center space-x-3">
              
              {/* CV Button */}
              <button
                onClick={handleDownloadCV}
                className="hidden sm:flex items-center space-x-2 bg-white text-primary-500 px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300 hover:scale-105"
              >
                <Download className="h-4 w-4" />
                <span className="font-medium">CV</span>
              </button>

              {/* Google Apps Launcher (mobile) */}
              <div className="relative lg:hidden">
                <button
                  onClick={() => setAppsOpen(!appsOpen)}
                  className="p-2 rounded-lg hover:bg-white/10 transition"
                >
                  <div className="grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                    ))}
                  </div>
                </button>

                {/* Menu Google Apps */}
                {appsOpen && (
                  <div className="absolute right-0 mt-3 bg-white w-64 rounded-2xl shadow-2xl p-4 animate-scale-in">

                    <div className="grid grid-cols-3 gap-4">
                      {navItems.map((item, index) => {
                        const googleColors = [
                          "#4285F4", "#EA4335", "#FBBC05",
                          "#34A853", "#A142F4", "#F45D22"
                        ];
                        const bg = googleColors[index % googleColors.length];

                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setAppsOpen(false)}
                            className="flex flex-col items-center"
                          >
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-semibold shadow-md"
                              style={{ backgroundColor: bg }}
                            >
                              {item.name[0]}
                            </div>
                            <span className="text-xs mt-2 font-medium text-gray-700 text-center">
                              {item.name}
                            </span>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="border-t pt-3 mt-3 text-center">
                      <button className="text-sm text-blue-600 font-medium hover:underline">
                        Voir plus
                      </button>
                    </div>

                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
