import { mkdir, copyFile } from 'node:fs/promises';
const files = ['index.html', 'styles.css', 'app.js', 'validation.js', '.nojekyll'];
for (const dir of ['dist', 'docs']) {
  await mkdir(dir, { recursive: true });
  for (const file of files) await copyFile(`src/${file}`, `${dir}/${file}`);
  console.log(`Build: ${dir}/ — ${files.length} arquivos estáticos, caminhos relativos para GitHub Pages.`);
}
