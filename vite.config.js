import { defineConfig } from 'vite';

// Caminhos relativos ('./') funcionam em qualquer subcaminho do GitHub Pages
// (https://marcio-dalvi.github.io/preventicenio-formulario/). Saída em docs/.
export default defineConfig({
  root: 'src',
  base: './',
  publicDir: '../public',
  build: { outDir: '../docs', emptyOutDir: true },
});
