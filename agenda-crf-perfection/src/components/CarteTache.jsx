import { useRef, useState } from 'react'
import PastilleStatut from './PastilleStatut'
import { IconeCalendrier, IconeCoche, IconePersonne, IconeActualiser, IconeTaches } from './Icones'
import { delai, estEchue, estTerminee } from '../lib/statuts'
import { formaterDate } from '../lib/dates'
import { nomCourt } from '../lib/texte'
import { peutChangerStatut } from '../lib/droits'

const SEUIL = 84 // px à glisser pour déclencher l'action

export function nomsAttribues(tache, profilsParId, court = true) {
  const noms = (tache.attribues || [])
    .map((id) => profilsParId[id]?.nom_complet)
    .filter(Boolean)
    .map((n) => (court ? nomCourt(n) : n))
  return noms.length ? noms.join(', ') : 'Non attribuée'
}

/**
 * Carte d'une tâche (liste mobile).
 * Glisser vers la droite : marquer terminée (ou rouvrir) ; vers la gauche : choisir le statut.
 */
export default function CarteTache({ tache, profilsParId, jour, profil, onOuvrir, onStatut, onMenu }) {
  const [decalage, setDecalage] = useState(0)
  const [glisse, setGlisse] = useState(false)
  const geste = useRef(null)
  const vientDeGlisser = useRef(false)

  const modifiable = peutChangerStatut(profil, tache)
  const terminee = estTerminee(tache)
  const echue = estEchue(tache, jour)
  const d = delai(tache, jour)

  const classes = ['carte-tache']
  if (echue) classes.push('carte-tache--echue')
  else if (tache.statut === 'bloque') classes.push('carte-tache--bloquee')
  if (terminee) classes.push('carte-tache--terminee')
  if (glisse) classes.push('glisse')

  const debut = (e) => {
    if (!modifiable || (e.pointerType === 'mouse' && e.button !== 0)) return
    geste.current = { x: e.clientX, y: e.clientY, id: e.pointerId, actif: false }
  }
  const mouvement = (e) => {
    const g = geste.current
    if (!g || g.id !== e.pointerId) return
    const dx = e.clientX - g.x
    const dy = e.clientY - g.y
    if (!g.actif) {
      if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
        geste.current = null // défilement vertical : on laisse faire
        return
      }
      if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        g.actif = true
        setGlisse(true)
        e.currentTarget.setPointerCapture?.(e.pointerId)
      } else return
    }
    setDecalage(Math.max(-130, Math.min(130, dx)))
  }
  const fin = () => {
    const g = geste.current
    geste.current = null
    if (!g || !g.actif) return
    vientDeGlisser.current = true
    setTimeout(() => (vientDeGlisser.current = false), 50)
    const valeur = decalage
    setGlisse(false)
    setDecalage(0)
    if (valeur >= SEUIL) {
      if (navigator.vibrate) navigator.vibrate(15)
      onStatut(tache, terminee ? 'en_cours' : 'termine')
    } else if (valeur <= -SEUIL) {
      onMenu(tache)
    }
  }

  return (
    <div className="carte-tache-zone">
      {decalage > 0 && (
        <div className="carte-tache-zone__action carte-tache-zone__action--droite" aria-hidden="true">
          {terminee ? <IconeActualiser /> : <IconeCoche />}
          {terminee ? 'Rouvrir' : 'Terminée'}
        </div>
      )}
      {decalage < 0 && (
        <div className="carte-tache-zone__action carte-tache-zone__action--gauche" aria-hidden="true">
          Statut… <IconeTaches />
        </div>
      )}
      <article
        className={classes.join(' ')}
        style={{ transform: decalage ? `translateX(${decalage}px)` : undefined }}
        onPointerDown={debut}
        onPointerMove={mouvement}
        onPointerUp={fin}
        onPointerCancel={fin}
        onClick={() => !vientDeGlisser.current && onOuvrir(tache)}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onOuvrir(tache)}
        aria-label={`Tâche N° ${tache.numero} : ${tache.intitule}`}
      >
        <div className="carte-tache__corps">
          <div className="carte-tache__haut">
            <span className="numero">N° {tache.numero}</span>
            {tache.priorite === 'haute' && !terminee && <span className="badge-haute">Priorité haute</span>}
          </div>
          <h3 className="carte-tache__titre">{tache.intitule}</h3>
          <div className="carte-tache__infos">
            <span className="info">
              <IconeCalendrier />
              {formaterDate(tache.echeance)}
            </span>
            <span className="info carte-tache__personnes">
              <IconePersonne />
              {nomsAttribues(tache, profilsParId)}
            </span>
          </div>
          <div className="carte-tache__bas">
            <PastilleStatut statut={tache.statut} onClick={modifiable ? () => onMenu(tache) : undefined} />
            <span className={`delai ${d.classe}`}>{d.texte}</span>
          </div>
        </div>
      </article>
    </div>
  )
}
