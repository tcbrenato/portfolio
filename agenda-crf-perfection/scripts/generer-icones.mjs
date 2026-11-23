/**
 * Génère les icônes PWA à partir de public/logo.png
 *   npm run icones
 *
 * Produit :
 *   public/icons/icon-192.png           (icône standard 192 px)
 *   public/icons/icon-512.png           (icône standard 512 px)
 *   public/icons/icon-maskable-512.png  (icône Android « adaptative », marge de sécurité)
 *   public/icons/apple-touch-icon.png   (iPhone / iPad, 180 px)
 *   public/favicon.png                  (onglet du navigateur, 64 px)
 *   public/logo-entete.png              (logo allégé pour l'en-tête, 160 px de haut max)
 *
 * Remplacez simplement public/logo.png par le logo officiel puis relancez la commande.
 */
import sharp from 'sharp'
import { existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.join(racine, 'public', 'logo.png')
const dossierIcones = path.join(racine, 'public', 'icons')
const BLANC = { r: 255, g: 255, b: 255, alpha: 1 }

if (!existsSync(source)) {
  console.error('❌ Fichier introuvable : public/logo.png')
  process.exit(1)
}
mkdirSync(dossierIcones, { recursive: true })

/** Logo centré sur fond blanc carré, avec une marge (en % de la taille). */
async function iconeCarree(taille, margePourcent, destination) {
  const interieur = Math.round(taille * (1 - (2 * margePourcent) / 100))
  const logo = await sharp(source)
    .trim({ threshold: 10 }) // retire les bords vides éventuels
    .resize(interieur, interieur, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer()
  await sharp({ create: { width: taille, height: taille, channels: 4, background: BLANC } })
    .composite([{ input: logo, gravity: 'center' }])
    .png({ compressionLevel: 9, palette: true })
    .toFile(destination)
  console.log('✔', path.relative(racine, destination))
}

await iconeCarree(192, 8, path.join(dossierIcones, 'icon-192.png'))
await iconeCarree(512, 8, path.join(dossierIcones, 'icon-512.png'))
await iconeCarree(512, 20, path.join(dossierIcones, 'icon-maskable-512.png'))
await iconeCarree(180, 10, path.join(dossierIcones, 'apple-touch-icon.png'))
await iconeCarree(64, 4, path.join(racine, 'public', 'favicon.png'))

// Logo optimisé pour l'en-tête et l'écran de connexion (léger pour les connexions faibles)
await sharp(source)
  .trim({ threshold: 10 })
  .resize({ height: 160, width: 480, fit: 'inside', withoutEnlargement: true })
  .png({ compressionLevel: 9, palette: true })
  .toFile(path.join(racine, 'public', 'logo-entete.png'))
console.log('✔ public/logo-entete.png')
console.log('Icônes générées.')
