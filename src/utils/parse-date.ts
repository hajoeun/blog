// 2023-05-20T00:00:00.000Z
import { addHours } from 'date-fns';

/**
 * 문자열 형태의 날짜를 KST(한국 표준시) Date 객체로 변환합니다.
 * @param date 변환할 날짜 문자열 (예: "2023-05-20T00:00:00.000Z")
 * @returns KST로 변환된 Date 객체
 */
export const parseDate = (date: string): Date => {
  // ISO 문자열을 Date 객체로 파싱
  const parsedDate = new Date(date);
  // KST로 변환 (UTC+9)
  return convertToKST(parsedDate);
};

/**
 * Date 객체를 KST(한국 표준시)로 변환합니다.
 * @param date 변환할 Date 객체
 * @returns KST로 변환된 Date 객체
 */
export const convertToKST = (date: Date): Date => {
  // UTC 시간에 9시간을 더해 KST로 변환
  return addHours(date, 9);
};
