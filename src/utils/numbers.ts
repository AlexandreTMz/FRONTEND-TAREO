export function isValidNumber(value: string | number) {
  return isFinite(Number(value));
}
