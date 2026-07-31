// Config do demo do Monte Seu Prato — servidor separado, sem tocar no app real.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const stubAppContext = fileURLToPath(new URL('./stubs/AppContext.jsx', import.meta.url))

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [
    {
      name: 'demo-stub-appcontext',
      enforce: 'pre',
      resolveId(source, importer) {
        if (source.endsWith('context/AppContext.jsx') && !importer?.includes('stubs')) return stubAppContext
        return null
      },
    },
    react(),
    tailwindcss(),
  ],
})
