import { defineConfig } from 'vite'
import mpa from 'vite-plugin-mpa'

const deployPrefix = 'GPC/'

export default defineConfig({

  base: `/${deployPrefix}`,
  build: { outDir: `dist/${deployPrefix}` },
  
  plugins: [

    // This is some kind of bug with the module export.
    mpa.default({

      open: './source/tasks/practica3/index.html',

      scanDir: './source/tasks',
      scanFile: 'main.js'
    })
  ]
})