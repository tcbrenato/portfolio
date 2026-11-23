import { useMemo, useState } from 'react'
import ListeTaches from '../components/ListeTaches'
import { IconeRetour, IconeSuivant } from '../components/Icones'
import { useAuth } from '../context/AuthContext'
import { useDonnees } from '../context/DonneesContext'
import { ajouterJours, formaterDateLongue, formaterMois, jourSemaine } from '../lib/dates'
import { estEchue, estTerminee, trierParEcheance } from '../lib/statuts'
import { majuscule, pluriel } from '../lib/texte'

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function premierDuMois(iso) {
  return iso.slice(0, 8) + '01'
}
function moisSuivant(iso, n) {
  const [a, m] = iso.split('-').map(Number)
  const d = new Date(Date.UTC(a, m - 1 + n, 1))
  return d.toISOString().slice(0, 10)
}

export default function Calendrier() {
  const { profil } = useAuth()
  const { taches, jour } = useDonnees()
  const [mois, setMois] = useState(premierDuMois(jour))
  const [selection, setSelection] = useState(jour)
  const [miennes, setMiennes] = useState(false)

  const parJour = useMemo(() => {
    const index = {}
    for (const t of taches) {
      if (!t.echeance) continue
      if (miennes && !t.attribues.includes(profil.id)) continue
      ;(index[t.echeance] ||= []).push(t)
    }
    return index
  }, [taches, miennes, profil.id])

  // 6 semaines affichées, du lundi précédant le 1er du mois
  const cases = useMemo(() => {
    const debut = ajouterJours(mois, -jourSemaine(mois))
    return Array.from({ length: 42 }, (_, i) => ajouterJours(debut, i))
  }, [mois])
  // on retire la dernière semaine si elle est entièrement hors du mois
  const casesAffichees = cases[35].slice(0, 7) !== mois.slice(0, 7) ? cases.slice(0, 35) : cases

  const tachesDuJour = (parJour[selection] || []).slice().sort(trierParEcheance)

  const changerMois = (n) => {
    const nouveau = moisSuivant(mois, n)
    setMois(nouveau)
    setSelection(nouveau.slice(0, 7) === jour.slice(0, 7) ? jour : nouveau)
  }

  const resume = (liste) => {
    const echues = liste.filter((t) => estEchue(t, jour)).length
    const faites = liste.filter(estTerminee).length
    return [...Array(Math.min(echues, 3)).fill('echu'), ...Array(Math.min(liste.length - echues - faites, 3)).fill(''), ...Array(Math.min(faites, 3)).fill('fait')].slice(0, 3)
  }

  return (
    <>
      <div className="ligne ligne--espace" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
        <h1 className="titre-page">Calendrier</h1>
        <div className="segment" role="group" aria-label="Tâches affichées">
          <button type="button" aria-pressed={!miennes} onClick={() => setMiennes(false)}>Équipe</button>
          <button type="button" aria-pressed={miennes} onClick={() => setMiennes(true)}>Mes tâches</button>
        </div>
      </div>

      <div className="cal-disposition">
        <div className="carte carte--padding" style={{ padding: 12 }}>
          <div className="cal-entete">
            <button type="button" className="btn-icone" onClick={() => changerMois(-1)} aria-label="Mois précédent"><IconeRetour /></button>
            <h2>{formaterMois(mois)}</h2>
            <button type="button" className="btn-icone" onClick={() => changerMois(1)} aria-label="Mois suivant"><IconeSuivant /></button>
          </div>
          <div className="cal-grille" role="grid">
            {JOURS.map((j) => <div key={j} className="cal-jour-semaine">{j}</div>)}
            {casesAffichees.map((iso) => {
              const liste = parJour[iso] || []
              const classes = ['cal-case']
              if (iso.slice(0, 7) !== mois.slice(0, 7)) classes.push('cal-case--hors')
              if (iso === jour) classes.push('cal-case--aujourdhui')
              return (
                <button
                  key={iso}
                  type="button"
                  className={classes.join(' ')}
                  aria-pressed={iso === selection}
                  aria-label={`${formaterDateLongue(iso)} : ${pluriel(liste.length, 'échéance')}`}
                  onClick={() => setSelection(iso)}
                >
                  {Number(iso.slice(8))}
                  <span className="cal-points">
                    {resume(liste).map((c, i) => <i key={i} className={c} />)}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="cal-legende">
            <span><i style={{ background: 'var(--st-encours-texte)' }} /> À venir</span>
            <span><i style={{ background: 'var(--rouge)' }} /> Échue</span>
            <span><i style={{ background: '#3c9a66' }} /> Terminée</span>
            <button type="button" className="btn btn--fantome" style={{ minHeight: 32, padding: '0 6px', marginLeft: 'auto', fontSize: '0.8125rem' }} onClick={() => { setMois(premierDuMois(jour)); setSelection(jour) }}>
              Aujourd'hui
            </button>
          </div>
        </div>

        <section>
          <h2 className="titre-section">
            {majuscule(formaterDateLongue(selection))} <span className="compte">({tachesDuJour.length})</span>
          </h2>
          <ListeTaches taches={tachesDuJour} vide="Aucune échéance ce jour-là." />
        </section>
      </div>
    </>
  )
}
