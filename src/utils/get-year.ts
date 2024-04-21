import { parseDate } from './parse-date';

export const getYear = (date: string) => {
  return parseDate(date).getFullYear();
};
