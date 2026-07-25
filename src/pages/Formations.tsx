import React, { useState } from 'react';

const formations = [
  {
    id: 1,
    number: '01',
    title: 'Stratégie digitale & Marketing',
    duration: '2 mois',
    price: '100 000 FCFA',
    color: '#4285F4',
    description: 'Maîtrisez les fondamentaux du marketing digital et élaborez des stratégies complètes pour propulser votre présence en ligne.',
    skills: [
      'Élaboration de stratégies digitales complètes',
      'Marketing digital (acquisition, conversion, fidélisation)',
      'Gestion des réseaux sociaux – community management',
      'Publicité en ligne (Facebook Ads, campagnes sponsorisées)',
    ],
    certification: true,
  },
  {
    id: 2,
    number: '02',
    title: 'Design & Création visuelle',
    duration: '1 mois',
    price: '50 000 FCFA',
    color: '#EA4335',
    description: 'Apprenez à créer des visuels percutants et des identités visuelles professionnelles avec les outils du marché.',
    skills: [
      'Graphisme (Canva, Photoshop)',
      "Création d'identités visuelles",
      'UI/UX Design (expérience et interface utilisateur)',
      'Visuels marketing : affiches, flyers, contenus réseaux',
    ],
    certification: true,
  },
  {
    id: 3,
    number: '03',
    title: 'Développement Web & Vibe Coding',
    duration: '3 mois',
    price: '150 000 FCFA',
    color: '#34A853',
    description: 'Créez des sites web modernes et apprenez le développement assisté par IA pour coder plus vite et plus intelligemment.',
    skills: [
      'HTML, CSS, JavaScript, Bootstrap',
      'React, Node.js, Next.js',
      'Création de sites web (vitrines, plateformes)',
      "Développement assisté par l'IA (Cursor, Copilot, Claude)",
      'Prototypage ultra-rapide de produits digitaux',
    ],
    certification: true,
  },
  {
    id: 4,
    number: '04',
    title: 'Gestion de projet & Organisation',
    duration: '3 mois',
    price: '150 000 FCFA',
    color: '#FBBC05',
    description: 'Pilotez vos projets numériques avec méthode et efficacité grâce aux outils et méthodes agiles.',
    skills: [
      'Gestion de projets numériques',
      'Outils : Notion, Trello, Asana',
      'Méthodes agiles (Scrum, Kanban)',
      'Organisation et suivi de tâches',
    ],
    certification: true,
  },
  {
    id: 5,
    number: '05',
    title: 'Bureautique & Outils numériques',
    duration: '1 mois',
    price: '50 000 FCFA',
    color: '#A142F4',
    description: 'Maîtrisez les outils bureautiques et numériques essentiels pour être efficace dans un environnement professionnel moderne.',
    skills: [
      'Microsoft Office (Word, Excel, PowerPoint)',
      'Google Workspace (Docs, Sheets, Drive)',
      'Outils de communication digitale',
      'Gestion et organisation numérique',
    ],
    certification: true,
  },
  {
    id: 6,
    number: '06',
    title: 'Marketing digital',
    duration: '2 semaines',
    price: '50 000 FCFA',
    color: '#F45D22',
    description: 'Une formation intensive pour maîtriser rapidement les essentiels du marketing digital et lancer vos premières campagnes.',
    skills: [
      'Fondamentaux du marketing digital',
      'Création et gestion de campagnes',
      'Réseaux sociaux et publicité en ligne',
      'Analyse des performances',
    ],
    certification: true,
  },
];

const Formations = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-[#0a1f3c] text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos Formations</h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
          Des formations pratiques, certifiantes et adaptées au marché africain du numérique.
        </p>
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {[['6', 'FORMATIONS'], ['2 sem – 6 mois', 'DURÉE'], ['Certifiante', 'CERTIFICATION'], ['Sur mesure', 'PRIX']].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{val}</div>
              <div className="text-xs text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-[#0a1f3c] mb-12">Choisissez votre formation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formations.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
            >
              <div className="h-2" style={{ backgroundColor: f.color }}></div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-bold text-lg" style={{ color: f.color }}>{f.number}</span>
                  <h3 className="text-[#0a1f3c] font-semibold text-lg leading-tight">{f.title}</h3>
                </div>
                <p className="text-gray-500 text-sm mb-4">{f.description}</p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">⏱ {f.duration}</span>
                  <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">🎓 Certifiante</span>
                </div>
                <div className="mt-auto">
                  <div className="text-2xl font-bold text-[#0a1f3c] mb-4">{f.price}</div>
                  <button
                    onClick={() => setSelected(f)}
                    className="w-full py-2 rounded-xl text-white font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: f.color }}
                  >
                    Voir les détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative shadow-2xl">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
            <div className="h-1 rounded-full mb-6" style={{ backgroundColor: selected.color }}></div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-bold text-xl" style={{ color: selected.color }}>{selected.number}</span>
              <h2 className="text-2xl font-bold text-[#0a1f3c]">{selected.title}</h2>
            </div>
            <p className="text-gray-500 mb-4">{selected.description}</p>
            <div className="flex gap-3 mb-5">
              <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">⏱ {selected.duration}</span>
              <span className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full">🎓 Certifiante</span>
            </div>
            <h4 className="font-semibold text-[#0a1f3c] mb-3">Ce que vous apprendrez :</h4>
            <ul className="space-y-2 mb-6">
              {selected.skills.map((skill, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                  <span className="mt-1" style={{ color: selected.color }}>✓</span>
                  {skill}
                </li>
              ))}
            </ul>
            <div className="text-3xl font-bold text-[#0a1f3c] mb-5">{selected.price}</div>
            <div className="flex gap-3">
              <a
                href="/contact"
                className="flex-1 text-center py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: selected.color }}
              >
                S'inscrire maintenant
              </a>
              <a
                href="https://wa.me/22901923777"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-3 rounded-xl border-2 font-semibold transition-all hover:bg-gray-50"
                style={{ borderColor: selected.color, color: selected.color }}
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-[#0a1f3c] text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à vous former ?</h2>
        <p className="text-gray-300 mb-8">Contactez-nous pour plus d'informations ou pour vous inscrire.</p>
        <a
          href="/contact"
          className="bg-yellow-400 text-[#0a1f3c] font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors"
        >
          Nous contacter
        </a>
      </div>

    </div>
  );
};

export default Formations;