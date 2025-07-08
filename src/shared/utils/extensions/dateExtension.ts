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
 *   new Date(2025, 5, 13).toDDMMYYYY('/') // '13/06/2025'
 *   new Date(2025, 5, 13).toMMDDYYYY('-') // '06-13-2025'
 *   new Date(2025, 5, 13).toYYYYMMDD('')  // '20250613'
 *   new Date(2025, 5, 13).toYYYYDDMM('/') // '2025/13/06'
 */

declare global {
  interface Date {
    toDDMMYYYY(divider?: string): string;
    toMMDDYYYY(divider?: string): string;
    toYYYYMMDD(divider?: string): string;
    toYYYYDDMM(divider?: string): string;
  }
}

Date.prototype.toDDMMYYYY = function (divider: string = ''): string {
  const dd = String(this.getDate()).padStart(2, '0');
  const mm = String(this.getMonth() + 1).padStart(2, '0');
  const yyyy = this.getFullYear();
  return [dd, mm, yyyy].join(divider);
};

Date.prototype.toMMDDYYYY = function (divider: string = ''): string {
  const dd = String(this.getDate()).padStart(2, '0');
  const mm = String(this.getMonth() + 1).padStart(2, '0');
  const yyyy = this.getFullYear();
  return [mm, dd, yyyy].join(divider);
};

Date.prototype.toYYYYMMDD = function (divider: string = ''): string {
  const dd = String(this.getDate()).padStart(2, '0');
  const mm = String(this.getMonth() + 1).padStart(2, '0');
  const yyyy = this.getFullYear();
  return [yyyy, mm, dd].join(divider);
};

Date.prototype.toYYYYDDMM = function (divider: string = ''): string {
  const dd = String(this.getDate()).padStart(2, '0');
  const mm = String(this.getMonth() + 1).padStart(2, '0');
  const yyyy = this.getFullYear();
  return [yyyy, dd, mm].join(divider);
};

export {}; 