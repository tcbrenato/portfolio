import PastilleStatut from './PastilleStatut'
import { nomsAttribues } from './CarteTache'
import { delai, estEchue, estTerminee } from '../lib/statuts'
import { formaterDate } from '../lib/dates'
import { peutChangerStatut } from '../lib/droits'

/** Vue tableau (ordinateur) : N° | Tâche | Date | Échéance | Attributaire | Statut | Délai */
export default function TableauTaches({ taches, profilsParId, jour, profil, onOuvrir, onMenu }) {
  return (
    <div className="carte tableau-conteneur">
      <table className="tableau">
        <thead>
          <tr>
            <th className="col-num">N°</th>
            <th>Tâche</th>
            <th>Date</th>
            <th>Échéance</th>
            <th>Attributaire</th>
            <th>Statut</th>
            <th>Délai</th>
          </tr>
        </thead>
        <tbody>
          {taches.map((t) => {
            const d = delai(t, jour)
            const classe = estTerminee(t) ? 'ligne--terminee' : estEchue(t, jour) ? 'ligne--echue' : ''
            return (
              <tr key={t.id} className={classe} onClick={() => onOuvrir(t)}>
                <td className="numero">{t.numero}</td>
                <td className="cellule-titre">
                  {t.intitule}
                  {t.priorite === 'haute' && !estTerminee(t) && <> <span className="badge-haute">Haute</span></>}
                </td>
                <td>{formaterDate(t.date_creation)}</td>
                <td>{formaterDate(t.echeance)}</td>
                <td>{nomsAttribues(t, profilsParId, false)}</td>
                <td>
                  <PastilleStatut statut={t.statut} onClick={peutChangerStatut(profil, t) ? () => onMenu(t) : undefined} />
                </td>
                <td><span className={`delai ${d.classe}`}>{d.texte}</span></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
