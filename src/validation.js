export const digits = value => value.replace(/\D/g, '');
export function validCPF(value) {
  const n = digits(value);
  if (!/^\d{11}$/.test(n) || /^(\d)\1+$/.test(n)) return false;
  return [9, 10].every(len => {
    const sum = [...n.slice(0, len)].reduce((s, d, i) => s + Number(d) * (len + 1 - i), 0);
    return Number(n[len]) === (sum * 10 % 11) % 10;
  });
}
export function validCNPJ(value) {
  const n = digits(value);
  if (!/^\d{14}$/.test(n) || /^(\d)\1+$/.test(n)) return false;
  return [12, 13].every(len => {
    let weight = len - 7;
    const sum = [...n.slice(0, len)].reduce((s, d) => { const result = s + Number(d) * weight; weight = weight === 2 ? 9 : weight - 1; return result; }, 0);
    const rest = sum % 11;
    return Number(n[len]) === (rest < 2 ? 0 : 11 - rest);
  });
}
export const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const validPhone = value => /^[1-9]{2}\d{8,9}$/.test(digits(value));
export function phoneMask(value) {
  const n = digits(value).slice(0, 11);
  if (!n) return '';
  if (n.length < 3) return `(${n}`;
  const split = n.length > 10 ? 7 : 6;
  return `(${n.slice(0, 2)}) ${n.slice(2, split)}${n.length > split ? '-' + n.slice(split) : ''}`;
}
export function documentMask(value, type) {
  const n = digits(value).slice(0, type === 'pj' ? 14 : 11);
  return type === 'pj' ? n.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2') : n.replace(/^(\d{3})(\d)/, '$1.$2').replace(/(\.\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
