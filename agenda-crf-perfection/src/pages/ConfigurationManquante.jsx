export default function ConfigurationManquante() {
  return (
    <div className="contenu" style={{ maxWidth: 560, paddingTop: 48 }}>
      <img src="/logo-entete.png" alt="CRF Perfection" width="110" style={{ height: 'auto', marginBottom: 20 }} />
      <h1 className="titre-page">Configuration requise</h1>
      <p className="texte-doux" style={{ margin: '12px 0' }}>
        Les variables <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_ANON_KEY</code> ne sont pas définies.
      </p>
      <p className="message-info">
        Copiez <code>.env.example</code> en <code>.env</code>, renseignez les valeurs de votre projet Supabase
        (Project Settings &gt; API), puis relancez <code>npm run dev</code>. Sur Vercel, ajoutez-les dans
        Settings &gt; Environment Variables puis redéployez.
      </p>
    </div>
  )
}
