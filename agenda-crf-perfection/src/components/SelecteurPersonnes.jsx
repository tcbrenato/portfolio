import { initiales, nomCourt } from '../lib/texte'

/** Choix multiple d'attributaires sous forme de puces tactiles. */
export default function SelecteurPersonnes({ profils, selection, onChange, moiId }) {
  const basculer = (id) =>
    onChange(selection.includes(id) ? selection.filter((x) => x !== id) : [...selection, id])

  // « Moi » en premier, puis ordre alphabétique
  const tries = [...profils].sort((a, b) => (b.id === moiId) - (a.id === moiId) || a.nom_complet.localeCompare(b.nom_complet, 'fr'))

  if (!tries.length) return <p className="texte-doux texte-petit">Aucun membre actif.</p>
  return (
    <div className="selecteur-personnes" role="group" aria-label="Attributaires">
      {tries.map((p) => (
        <button
          key={p.id}
          type="button"
          className="personne-choix"
          aria-pressed={selection.includes(p.id)}
          onClick={() => basculer(p.id)}
          title={p.nom_complet}
        >
          <span className="avatar">{initiales(p.nom_complet)}</span>
          {p.id === moiId ? 'Moi' : nomCourt(p.nom_complet)}
        </button>
      ))}
    </div>
  )
}
