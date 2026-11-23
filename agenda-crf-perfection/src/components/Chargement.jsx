export function SqueletteCartes({ nombre = 4 }) {
  return (
    <div className="liste-cartes" aria-busy="true" aria-label="Chargement">
      {Array.from({ length: nombre }).map((_, i) => (
        <div key={i} className="squelette" style={{ height: 104 }} />
      ))}
    </div>
  )
}

export function ChargementPleinEcran() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <img src="/logo-entete.png" alt="CRF Perfection" width="120" style={{ height: 'auto', opacity: 0.9 }} />
    </div>
  )
}
