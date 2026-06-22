// Generate web-optimized derivatives for source images.
//
// For every .jpg/.jpeg/.png directly inside a configured collection folder,
// this writes two WebP files into sibling folders:
//   thumbnails/<name>.webp  — small, for in-page display (carousels, grids)
//   full/<name>.webp        — larger, served on click / in the lightbox
//
// Originals are left untouched as the archival source. Re-runnable: existing
// outputs are skipped unless the source is newer (pass --force to rebuild all).
//
// Usage:  npm run thumbs            (process the configured collections)
//         npm run thumbs -- --force (rebuild everything)

import sharp from 'sharp'
import { readdir, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGES_ROOT = path.resolve(__dirname, '..', 'public', 'assets', 'images')

// Collection folders to process, relative to IMAGES_ROOT.
const COLLECTIONS = [
  'Texture Book',
  'Fidget Series/5 ways to fidget',
  'Fidget Series/Furry Fidgets',
  'Feed Me Chef!/ice cave',
  'Feed Me Chef!/kitchen',
  'Feed Me Chef!/route 66',
]

const THUMB = { dir: 'thumbnails', maxEdge: 1000, quality: 78 }
const FULL = { dir: 'full', maxEdge: 2400, quality: 86 }

const SOURCE_RE = /\.(jpe?g|png)$/i
const force = process.argv.includes('--force')

async function newerThanSource(srcPath, outPath) {
  try {
    const [src, out] = await Promise.all([stat(srcPath), stat(outPath)])
    return out.mtimeMs >= src.mtimeMs
  } catch {
    return false // output missing
  }
}

async function render(srcPath, outPath, { maxEdge, quality }) {
  await sharp(srcPath)
    .resize({ width: maxEdge, height: maxEdge, fit: 'inside', withoutEnlargement: true })
    .webp({ quality })
    .toFile(outPath)
  const { size } = await stat(outPath)
  return size
}

let made = 0
let skipped = 0

for (const collection of COLLECTIONS) {
  const dir = path.join(IMAGES_ROOT, collection)
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    console.warn(`! skip (not found): ${collection}`)
    continue
  }

  const files = entries.filter(e => e.isFile() && SOURCE_RE.test(e.name))
  if (!files.length) continue

  await mkdir(path.join(dir, THUMB.dir), { recursive: true })
  await mkdir(path.join(dir, FULL.dir), { recursive: true })

  console.log(`\n${collection}  (${files.length} image${files.length === 1 ? '' : 's'})`)

  for (const file of files) {
    const srcPath = path.join(dir, file.name)
    const base = file.name.replace(SOURCE_RE, '')

    for (const variant of [THUMB, FULL]) {
      const outPath = path.join(dir, variant.dir, `${base}.webp`)
      if (!force && (await newerThanSource(srcPath, outPath))) {
        skipped++
        continue
      }
      const size = await render(srcPath, outPath, variant)
      made++
      console.log(`  ${variant.dir.padEnd(10)} ${base}.webp  ${(size / 1024).toFixed(0)} KB`)
    }
  }
}

console.log(`\nDone — ${made} written, ${skipped} up-to-date.`)
