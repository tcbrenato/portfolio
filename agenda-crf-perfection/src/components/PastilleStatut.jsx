import { STATUTS } from '../lib/statuts'
import { IconeAlerte } from './Icones'

export default function PastilleStatut({ statut, onClick }) {
  const contenu = (
    <>
      {statut === 'bloque' && <IconeAlerte />}
      {STATUTS[statut]?.libelle ?? statut}
    </>
  )
  if (onClick) {
    return (
      <button
        type="button"
        className={`statut statut--${statut}`}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        aria-label={`Statut : ${STATUTS[statut]?.libelle}. Changer le statut`}
      >
        {contenu}
      </button>
    )
  }
  return <span className={`statut statut--${statut}`}>{contenu}</span>
}
