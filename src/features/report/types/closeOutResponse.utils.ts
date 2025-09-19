// src/utils/attendance.utils.ts

import { Attendance } from './closeOutResponse.ts';
// Dùng thư viện date-fns để xử lý ngày giờ một cách an toàn và hiệu quả
// Cài đặt bằng: npm install date-fns  hoặc  yarn add date-fns
import { format, parseISO } from 'date-fns';

/**
 * Lấy tên hiển thị đầy đủ của nhân viên.
 * @param attendance - Đối tượng Attendance.
 * @returns Tên đầy đủ, ví dụ: "BRYAN Nguyen1f gg".
 */
export const getDisplayName = (attendance: Attendance): string => {
  if (!attendance) return '';
  // Ghép tên và họ, trim() để xóa khoảng trắng thừa nếu có tên bị thiếu
  return `${attendance.firstName || ''} ${attendance.lastName || ''}`.trim();
};

/**
 * Parse và định dạng chuỗi ngày giờ thành thời gian dễ đọc.
 * @param dateTimeString - Chuỗi ISO date time, ví dụ: "2025-09-18T12:30:00Z".
 * @returns Thời gian đã định dạng, ví dụ: "12:30 PM", hoặc "N/A" nếu có lỗi.
 */
const parseClockTime = (dateTimeString: string | null): string => {
  if (!dateTimeString) {
    return "N/A";
  }
  try {
    // parseISO sẽ chuyển chuỗi ISO thành đối tượng Date của JavaScript
    const date = parseISO(dateTimeString);
    // format sẽ định dạng lại đối tượng Date theo ý muốn
    return format(date, 'hh:mm a'); // ví dụ: 05:30 PM
  } catch (error) {
    console.error(`Error parsing date: ${dateTimeString}`, error);
    return "N/A";
  }
};

/**
 * Lấy thời gian check-in đã được định dạng.
 * @param attendance - Đối tượng Attendance.
 * @returns Thời gian check-in, ví dụ: "12:30 PM".
 */
export const getClockInTime = (attendance: Attendance): string => {
  if (!attendance) return "N/A";
  return parseClockTime(attendance.clockInDt);
};

/**
 * Lấy thời gian check-out đã được định dạng.
 * @param attendance - Đối tượng Attendance.
 * @returns Thời gian check-out, ví dụ: "N/A" nếu chưa check-out.
 */
export const getClockOutTime = (attendance: Attendance): string => {
  if (!attendance) return "N/A";
  return parseClockTime(attendance.clockOutDt);
};