export function isValidAbbreviation(abbreviation: string) {
  const pattern = new RegExp('^[A-Z|-]+$', 'i');

  return pattern.test(abbreviation);
}

export function removeAccents(text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
