import { ajouterJours, aujourdhui, finDuMois, formaterDate, jourSemaine } from '../lib/dates'

const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

/** Sélecteur de date natif (adapté au mobile) + raccourcis en un tap. */
export default function ChampEcheance({ id = 'echeance', valeur, onChange, requis = true }) {
  const jour = aujourdhui()
  const raccourcis = [
    { libelle: "Aujourd'hui", date: jour },
    { libelle: 'Demain', date: ajouterJours(jour, 1) },
    { libelle: 'Dans 7 j', date: ajouterJours(jour, 7) },
    { libelle: 'Dans 15 j', date: ajouterJours(jour, 15) },
    { libelle: 'Fin du mois', date: finDuMois(jour) }
  ]
  return (
    <div className="champ">
      <label htmlFor={id}>Échéance{requis && ' *'}</label>
      <input
        id={id}
        className="saisie"
        type="date"
        value={valeur || ''}
        onChange={(e) => onChange(e.target.value)}
        required={requis}
        lang="fr"
      />
      {valeur && (
        <span className="aide" aria-live="polite">
          → {JOURS[jourSemaine(valeur)]} {formaterDate(valeur)}
        </span>
      )}
      <div className="raccourcis-date">
        {raccourcis.map((r) => (
          <button key={r.libelle} type="button" className="puce" aria-pressed={valeur === r.date} onClick={() => onChange(r.date)}>
            {r.libelle}
          </button>
        ))}
      </div>
    </div>
  )
}
