# Prevent Senior — atualização cadastral

Formulário estático responsivo PJ/PF, com validação de CPF/CNPJ numéricos, CEP, e-mail e telefone. Salvar baixa `preventsenior-cadastro.json`; dados cadastrais não são enviados ou persistidos. Apenas o CEP é consultado no ViaCEP, com preenchimento manual em falhas de rede.

Ambiente de demonstração. Identidade baseada no site oficial; fontes, cores e origem do logo em [BRAND.md](BRAND.md).

## Executar e compilar

Requer Node.js compatível com Vite 8 e dependências do package-lock.json instaladas.

```sh
npm ci
npm run build
node --test
node scripts/serve.mjs
```

O build também pode ser executado com `node scripts/build.mjs`. Usa a API de produção do Vite para gerar docs/ e dist/, com caminhos relativos, fontes locais e .nojekyll. Servidor local: http://127.0.0.1:3000 (dist/). Build e testes não publicam.

## GitHub Pages

URL existente: https://marcio-dalvi.github.io/preventicenio-formulario/ (master, /docs). Nova identidade preparada localmente; o mandato t_4002d2a4 também contém uma proibição final explícita de push/PR no checkout compartilhado, portanto a republicação depende de resolver essa restrição.

## Verificação

`node --test` verifica documentos, e-mail, telefone e máscaras com dados sintéticos. `scripts/browser-check.mjs` recebe o módulo Playwright e, opcionalmente, o executável Chromium como argumentos; cobre validações, CEP, downloads PJ/PF, marca e responsividade em 390/320 px. Artefatos ficam em test-results/ (ignorado pelo Git).
