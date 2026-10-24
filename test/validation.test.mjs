import test from 'node:test';
import assert from 'node:assert/strict';
import { validCPF, validCNPJ, validEmail, validPhone, phoneMask, documentMask } from '../src/validation.js';
test('CPF: aceita dígitos verificadores e rejeita alteração e sequências', () => {
  assert.ok(validCPF('529.982.247-25'));
  for (const n of ['52998224726', '11111111111', '00000000000', '', '123']) assert.equal(validCPF(n), false, n);
});
test('CNPJ: aceita dígitos verificadores e rejeita alteração e sequências', () => {
  assert.ok(validCNPJ('11.222.333/0001-81'));
  assert.ok(validCNPJ('04.252.011/0001-10'));
  for (const n of ['11222333000182', '11111111111111', '00000000000000', '', '123']) assert.equal(validCNPJ(n), false, n);
});
test('E-mail e telefone: entradas válidas e inválidas', () => {
  assert.ok(validEmail('financeiro@exemplo.com.br'));
  for (const n of ['a@b', 'a b@exemplo.com', 'a@@b.com', '']) assert.equal(validEmail(n), false);
  assert.ok(validPhone('(11) 99999-9999'));
  assert.ok(validPhone('(11) 3333-4444'));
  assert.equal(validPhone('123'), false);
  assert.equal(validPhone('(00) 99999-9999'), false);
});
test('Máscaras de CPF, CNPJ e telefone', () => {
  assert.equal(documentMask('52998224725', 'pf'), '529.982.247-25');
  assert.equal(documentMask('11222333000181', 'pj'), '11.222.333/0001-81');
  assert.equal(phoneMask('11999999999'), '(11) 99999-9999');
  assert.equal(phoneMask('1133334444'), '(11) 3333-4444');
  assert.equal(phoneMask(''), '');
});
