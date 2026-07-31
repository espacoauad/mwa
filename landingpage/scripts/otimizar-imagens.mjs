import sharp from 'sharp'
import { readdir } from 'node:fs/promises'
import path from 'node:path'

const dir = path.resolve('src/assets')
const targets = ['foto-wanessa-story-final.jpg', 'foto-wanessa-final.jpg']
const widths = [480, 800, 1200]

for (const file of targets) {
  const base = path.parse(file).name
  for (const w of widths) {
    await sharp(path.join(dir, file))
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(path.join(dir, `${base}-${w}.webp`))
    console.log(`${base}-${w}.webp ok`)
  }
}
