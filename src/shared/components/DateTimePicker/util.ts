// --- PHẦN LOGIC XỬ LÝ NGÀY THÁNG ---

import dayjs from "dayjs";
import memoize from 'lodash/memoize';
/**
 * Hàm này tạo ra một mảng 2 chiều đại diện cho các tuần trong tháng.
 * Ví dụ: getMonthMatrix(dayjs('2024-08-10'))
 */
export const getMonthMatrix = (date: dayjs.Dayjs) => {
    const firstDayOfMonth = date.startOf('month');
    const firstDayOfWeek = firstDayOfMonth.day(); // 0=Chủ nhật, 1=Thứ 2, ...

    const monthMatrix: (dayjs.Dayjs | null)[][] = [];
    let currentDay = firstDayOfMonth.subtract(firstDayOfWeek, 'day');

    // Tạo 6 tuần để đảm bảo bao phủ hết các ngày
    for (let i = 0; i < 6; i++) {
        const week: (dayjs.Dayjs | null)[] = [];
        for (let j = 0; j < 7; j++) {
            // Chỉ thêm ngày nếu nó thuộc tháng hiện tại
            if (currentDay.month() === date.month()) {
                week.push(currentDay);
            } else {
                week.push(null); // Ngày ngoài tháng sẽ là ô trống
            }
            currentDay = currentDay.add(1, 'day');
        }
        monthMatrix.push(week);

        // Nếu tuần cuối cùng không có ngày nào của tháng hiện tại, bỏ qua
        if (week.every(day => day === null)) {
            monthMatrix.pop();
            break;
        }
    }
    return monthMatrix;
};


/**
 * Hàm này tạo ra một mảng 2 chiều (4x3) chứa 12 năm
 * dựa trên một năm bất kỳ.
 */
export const getYearMatrix = memoize((date: dayjs.Dayjs): number[][] => {
  const currentYear = date.year();
  const startYear = Math.floor((currentYear - 1) / 12) * 12 + 1;
  const yearMatrix: number[][] = [];
  let year = startYear;
  for (let i = 0; i < 4; i++) {
    const row: number[] = [];
    for (let j = 0; j < 3; j++) {
      row.push(year);
      year++;
    }
    yearMatrix.push(row);
  }
  return yearMatrix;
}, (date) => Math.floor(date.year() / 12)); // Key dựa trên khoảng 12 năm
