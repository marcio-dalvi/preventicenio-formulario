import { build } from 'vite';
await build();
await build({ build: { outDir: '../dist' } });
console.log('Build Vite: docs/ atualizado e espelhado em dist/; .nojekyll e marca local incluídos.');
