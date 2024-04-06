export const parseDate = (date: string) => {
  // iOS에서 .으로 구분된 날짜를 NaN으로 인식하는 문제가 있어서 -로 치환
  const dateFormatted = date.replaceAll('.', '-');
  return new Date(dateFormatted);
};
