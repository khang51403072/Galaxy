/**
 * dateExtension.ts
 *
 * Các hàm chuyển đổi đối tượng Date sang chuỗi theo nhiều định dạng khác nhau.
 *
 * Hỗ trợ các định dạng:
 * - ddmmyyyy
 * - mmddyyyy
 * - yyyymmdd
 * - yyyyddmm
 *
 * Có thể truyền divider ('/', '-', '') để định dạng chuỗi ngày.
 *
 * Ví dụ:
 *   toDDMMYYYY(new Date(2025, 5, 13), '/') // '13/06/2025'
 *   toMMDDYYYY(new Date(2025, 5, 13), '-') // '06-13-2025'
 *   toYYYYMMDD(new Date(2025, 5, 13), '')  // '20250613'
 *   toYYYYDDMM(new Date(2025, 5, 13), '/') // '2025/13/06'
 */

export function toDDMMYYYY(date: Date, divider: string = ''): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return [dd, mm, yyyy].join(divider);
}

/**
 * Chuyển Date sang chuỗi mmddyyyy
 * @example toMMDDYYYY(new Date(2025, 5, 13), '-') // '06-13-2025'
 */
export function toMMDDYYYY(date: Date, divider: string = ''): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return [mm, dd, yyyy].join(divider);
}

/**
 * Chuyển Date sang chuỗi yyyymmdd
 * @example toYYYYMMDD(new Date(2025, 5, 13), '-') // '2025-06-13'
 */
export function toYYYYMMDD(date: Date, divider: string = ''): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return [yyyy, mm, dd].join(divider);
}

/**
 * Chuyển Date sang chuỗi yyyyddmm
 * @example toYYYYDDMM(new Date(2025, 5, 13), '/') // '2025/13/06'
 */
export function toYYYYDDMM(date: Date, divider: string = ''): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return [yyyy, dd, mm].join(divider);
} 