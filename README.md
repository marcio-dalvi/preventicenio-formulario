# Preventicênio — atualização cadastral

Formulário estático responsivo para pessoa jurídica e física. Identidade visual neutra, sem logo oficial fornecido. Dados preenchidos permanecem no navegador, sem armazenamento persistente, analytics ou backend. O botão **Salvar cadastro** valida e baixa `preventicenio-cadastro.json`; não registra nem envia cadastro. Somente o CEP é enviado ao ViaCEP (https://viacep.com.br/), com timeout e opção de preenchimento manual em falha de rede.

## Executar

Requer Node.js moderno, sem dependências externas.

```sh
node scripts/build.mjs
node --test
node scripts/serve.mjs
```

Abra http://127.0.0.1:3000. O build gera `dist/` e `docs/` com os mesmos arquivos e caminhos relativos, compatíveis com subdiretórios do GitHub Pages. Scripts equivalentes estão no package.json. O cadastro exporta CPF/CNPJ numéricos; Inscrição Estadual/RG são opcionais. CPF/CNPJ usam dígitos verificadores; essa validação não consulta situação cadastral. Exportação disponível em JSON (PDF não implementado).

## Publicação pendente de autorização

Nenhuma publicação ou push é executado pelos testes ou pelo build. O repositório Git local é o entregável desta etapa. Após autorização explícita do Marcio e decisão do Diretor sobre branch, criar/associar o repositório no GitHub com `gh`, enviar o commit e configurar Pages para o branch aprovado, pasta `/docs`. Não existe URL publicada nesta entrega.

## Verificação

`node --test` verifica os algoritmos e máscaras com dados sintéticos. Evidências da tarefa em `C:/Users/marci/AppData/Local/hermes/kanban/evidencias/t_3cecbd2e.md`. Capturas e teste de navegador usam somente dados sintéticos.
