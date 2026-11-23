// Icônes SVG intégrées (aucune librairie externe à télécharger)
function Icone({ children, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
      {children}
    </svg>
  )
}

export const IconeAccueil = (p) => <Icone {...p}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20h5v-6h4v6h5V9.5" /></Icone>
export const IconeTaches = (p) => <Icone {...p}><path d="M9 6h11M9 12h11M9 18h11" /><path d="m3.5 6 1.5 1.5L7.5 5M3.5 12l1.5 1.5L7.5 11M3.5 18l1.5 1.5L7.5 17" /></Icone>
export const IconeCalendrier = (p) => <Icone {...p}><rect x="3" y="4.5" width="18" height="16.5" rx="2.5" /><path d="M3 9.5h18M8 2.5v4M16 2.5v4" /></Icone>
export const IconeCompte = (p) => <Icone {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></Icone>
export const IconePlus = (p) => <Icone {...p}><path d="M12 5v14M5 12h14" /></Icone>
export const IconeRecherche = (p) => <Icone {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icone>
export const IconeRetour = (p) => <Icone {...p}><path d="M15 18 9 12l6-6" /></Icone>
export const IconeSuivant = (p) => <Icone {...p}><path d="m9 18 6-6-6-6" /></Icone>
export const IconeFermer = (p) => <Icone {...p}><path d="M18 6 6 18M6 6l12 12" /></Icone>
export const IconeCoche = (p) => <Icone {...p}><path d="M20 6 9 17l-5-5" /></Icone>
export const IconeAlerte = (p) => <Icone {...p}><path d="M12 3 2 20h20L12 3z" /><path d="M12 10v4M12 17.5v.01" /></Icone>
export const IconeHorloge = (p) => <Icone {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icone>
export const IconePersonne = (p) => <Icone {...p}><circle cx="12" cy="8" r="3.5" /><path d="M5 20c1.2-3.3 3.8-5 7-5s5.8 1.7 7 5" /></Icone>
export const IconeGroupe = (p) => <Icone {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c1-3.2 3.4-5 6.5-5s5.5 1.8 6.5 5" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 15.2c1.6.7 2.8 2.3 3.5 4.8" /></Icone>
export const IconePlusOptions = (p) => <Icone {...p}><circle cx="12" cy="5" r="1.3" fill="currentColor" /><circle cx="12" cy="12" r="1.3" fill="currentColor" /><circle cx="12" cy="19" r="1.3" fill="currentColor" /></Icone>
export const IconeCrayon = (p) => <Icone {...p}><path d="M4 20h4L19 9l-4-4L4 16v4z" /><path d="m13.5 6.5 4 4" /></Icone>
export const IconePoubelle = (p) => <Icone {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></Icone>
export const IconeEnvoyer = (p) => <Icone {...p}><path d="M21 3 10 14" /><path d="m21 3-7 18-4-7-7-4 18-7z" /></Icone>
export const IconeTelecharger = (p) => <Icone {...p}><path d="M12 3v12M7 10l5 5 5-5M4 20h16" /></Icone>
export const IconeImporter = (p) => <Icone {...p}><path d="M12 15V3M7 8l5-5 5 5M4 20h16" /></Icone>
export const IconeSortie = (p) => <Icone {...p}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 17l-5-5 5-5M5 12h11" /></Icone>
export const IconeCle = (p) => <Icone {...p}><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9M17 6l3 3M15 8l2 2" /></Icone>
export const IconeOeil = (p) => <Icone {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Icone>
export const IconeOeilBarre = (p) => <Icone {...p}><path d="M3 3l18 18" /><path d="M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.6 9.6 0 0 0 5.4-1.6" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></Icone>
export const IconeTelephone = (p) => <Icone {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></Icone>
export const IconeInstaller = (p) => <Icone {...p}><rect x="6" y="2.5" width="12" height="19" rx="2.5" /><path d="M12 7v7M9 11l3 3 3-3M10 18.5h4" /></Icone>
export const IconeDrapeau = (p) => <Icone {...p}><path d="M5 21V4M5 4h11l-2 4 2 4H5" /></Icone>
export const IconeActualiser = (p) => <Icone {...p}><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 4v7h-7" /></Icone>
export const IconeFichier = (p) => <Icone {...p}><path d="M14 3H6v18h12V7l-4-4z" /><path d="M14 3v4h4M9 13h6M9 17h6" /></Icone>
