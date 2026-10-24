import { mkdir, copyFile } from 'node:fs/promises';
for (const dir of ['dist', 'docs']) {
  await mkdir(dir, { recursive: true });
  for (const file of ['index.html', 'styles.css', 'app.js', 'validation.js', '.nojekyll']) await copyFile(`src/${file}`, `${dir}/${file}`);
  console.log(`Build: ${dir}/ — 6 arquivos estáticos, caminhos relativos para GitHub Pages.`);
}
