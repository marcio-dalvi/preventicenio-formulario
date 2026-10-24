import { digits, validCPF, validCNPJ, validEmail, validPhone, phoneMask, documentMask } from './validation.js';
const form = document.querySelector('form');
const field = name => form.elements.namedItem(name);
const result = document.querySelector('#result');
const cepStatus = document.querySelector('#cep-status');
let cepRequest;
let cepTimer;
let invalidCep = '';
let cepPending = false;
let cepVersion = 0;
for (const uf of 'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ')) field('uf').add(new Option(uf, uf));
function error(input, message) {
  input.setAttribute('aria-invalid', String(Boolean(message)));
  const element = input.parentElement.querySelector('.error');
  if (element) {
    element.id = `error-${input.name}`;
    element.textContent = message;
    input.setAttribute('aria-describedby', [input.name === 'cep' ? 'cep-status' : '', input.name === 'documento' ? 'document-help' : '', element.id].filter(Boolean).join(' '));
  }
  return !message;
}
function validate(input) {
  if (!input.name || input.type === 'radio' || input.type === 'submit') return true;
  const value = input.value.trim();
  let message = input.required && !value ? 'Preencha este campo.' : '';
  if (value && !message) {
    if (input.name === 'documento' && !(field('tipo').value === 'pj' ? validCNPJ(value) : validCPF(value))) message = 'Documento inválido. Confira os dígitos.';
    if (input.type === 'email' && !validEmail(value)) message = 'Informe um e-mail válido.';
    if (input.type === 'tel' && !validPhone(value)) message = 'Informe DDD e telefone com 10 ou 11 dígitos.';
    if (input.name === 'cep' && (digits(value).length !== 8 || invalidCep === digits(value))) message = 'Informe um CEP válido e existente.';
  }
  return error(input, message);
}
for (const input of form.querySelectorAll('input:not([type=radio]), select')) {
  input.addEventListener('blur', () => validate(input));
  input.addEventListener('input', () => {
    result.textContent = '';
    if (input.type === 'tel') input.value = phoneMask(input.value);
    if (input.name === 'documento') input.value = documentMask(input.value, field('tipo').value);
    if (input.getAttribute('aria-invalid') === 'true') validate(input);
  });
}
form.querySelectorAll('[name=tipo]').forEach(input => input.addEventListener('change', () => {
  const pj = field('tipo').value === 'pj';
  document.querySelector('#name-label').textContent = pj ? 'Razão social *' : 'Nome completo *';
  document.querySelector('#document-label').textContent = pj ? 'CNPJ *' : 'CPF *';
  document.querySelector('#registration-label').textContent = pj ? 'Inscrição estadual' : 'RG';
  field('nome').autocomplete = pj ? 'organization' : 'name';
  field('documento').value = '';
  field('documento').placeholder = pj ? '00.000.000/0000-00' : '000.000.000-00';
  field('documento').maxLength = pj ? 18 : 14;
  field('registro').value = '';
  field('registro').placeholder = pj ? 'Número ou Isento' : 'Número do RG';
  error(field('documento'), '');
  result.textContent = '';
}));
field('cep').addEventListener('input', () => {
  const version = ++cepVersion;
  cepPending = false;
  clearTimeout(cepTimer);
  cepRequest?.abort();
  const cep = digits(field('cep').value).slice(0, 8);
  field('cep').value = cep.replace(/^(\d{5})(\d)/, '$1-$2');
  invalidCep = '';
  error(field('cep'), '');
  cepStatus.textContent = 'Digite o CEP para preencher o endereço.';
  if (cep.length !== 8) return;
  cepPending = true;
  cepTimer = setTimeout(async () => {
    const controller = new AbortController();
    cepRequest = controller;
    const timeout = setTimeout(() => controller.abort(), 8000);
    cepStatus.textContent = 'Consultando CEP…';
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal: controller.signal, referrerPolicy: 'no-referrer' });
      if (!response.ok) throw new Error('Serviço indisponível');
      const data = await response.json();
      if (digits(field('cep').value) !== cep) return;
      if (data.erro) { invalidCep = cep; validate(field('cep')); cepStatus.textContent = 'CEP não encontrado. Confira os números.'; return; }
      for (const [name, key] of Object.entries({ logradouro: 'logradouro', bairro: 'bairro', cidade: 'localidade', uf: 'uf' })) {
        field(name).value = data[key] || '';
        error(field(name), '');
      }
      cepStatus.textContent = 'Endereço encontrado. Confira os dados e informe o número.';
    } catch {
      if (digits(field('cep').value) === cep) cepStatus.textContent = 'Consulta indisponível. Preencha o endereço manualmente.';
    } finally { clearTimeout(timeout); if (version === cepVersion) cepPending = false; }
  }, 350);
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const inputs = [...form.querySelectorAll('input:not([type=radio]), select')];
  const valid = inputs.map(validate).every(Boolean);
  if (!valid) { result.textContent = 'Revise os campos indicados antes de salvar.'; form.querySelector('[aria-invalid=true]').focus(); return; }
  if (cepPending) { result.textContent = 'Aguarde a consulta do CEP antes de salvar.'; field('cep').focus(); return; }
  const values = Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, value.trim()]));
  const contact = prefix => ({ nome: values[`${prefix}Nome`], email: values[`${prefix}Email`], telefone: digits(values[`${prefix}Telefone`]) });
  const data = { versao: 1, geradoEm: new Date().toISOString(), simulacao: true, tipoPessoa: values.tipo, nome: values.nome, documento: digits(values.documento), registro: values.registro, endereco: { cep: digits(values.cep), logradouro: values.logradouro, numero: values.numero, complemento: values.complemento, bairro: values.bairro, cidade: values.cidade, uf: values.uf }, telefone: digits(values.telefone), email: values.email, responsavelLegal: contact('responsavel'), contatoFinanceiro: contact('financeiro'), contatoTecnico: contact('tecnico') };
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' }));
  const link = Object.assign(document.createElement('a'), { href: url, download: 'preventicenio-cadastro.json' });
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  result.textContent = 'Arquivo JSON gerado. Confira o download no navegador. Nenhum cadastro foi enviado.';
  result.focus();
});
