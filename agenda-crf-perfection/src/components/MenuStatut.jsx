import FeuilleBas from './FeuilleBas'
import PastilleStatut from './PastilleStatut'
import { IconeCoche } from './Icones'
import { ORDRE_STATUTS } from '../lib/statuts'

/** Choix du statut en un geste. */
export default function MenuStatut({ tache, onChoisir, onFermer }) {
  return (
    <FeuilleBas ouvert={Boolean(tache)} titre={tache ? `N° ${tache.numero} — statut` : ''} onFermer={onFermer}>
      {tache && (
        <>
          <p className="texte-doux texte-petit" style={{ marginBottom: 12 }}>{tache.intitule}</p>
          <div className="choix-statut">
            {ORDRE_STATUTS.map((s) => (
              <button key={s} type="button" aria-current={tache.statut === s} onClick={() => onChoisir(tache, s)}>
                <PastilleStatut statut={s} />
                {tache.statut === s && <IconeCoche className="coche" />}
              </button>
            ))}
          </div>
        </>
      )}
    </FeuilleBas>
  )
}
