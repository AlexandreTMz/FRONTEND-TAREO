export const getDateYYYMMDD = (): string => {
  const dateLocal = new Date().toLocaleString('en-US', {
    timeZone: 'America/Lima',
  });
  const date = new Date(dateLocal);

  return `${date.getFullYear()}-${
    date.getMonth() + 1 < 10
      ? '0' + String(date.getMonth() + 1)
      : date.getMonth() + 1
  }-${date.getDate() < 10 ? '0' + String(date.getDate()) : date.getDate()}`;
};

export function parseStringToDate(str: string): Date {
  const mdy: Array<string> = str.split('-'); 
  return new Date(Number(mdy[0]), Number(mdy[1]) - 1, Number(mdy[2]));
}

export function dateDiffGetDays(first: Date, second: Date): number {
  return Math.round(
    (second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)
  );
}