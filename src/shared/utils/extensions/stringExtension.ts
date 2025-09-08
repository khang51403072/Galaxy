declare global {
  interface String {
    /**
     * Formats a string of digits into a standard US phone number format (XXX) XXX-XXXX.
     * @returns The formatted phone number string.
     */
    formatPhoneNumber(): string;

    /**
     * Safely converts a date string into a Date object.
     * It tries to parse common formats and defaults to ISO 8601.
     * @returns A valid Date object, or null if the string cannot be parsed.
     */
    toDate(): Date | null;
  }
}

// --- BẮT ĐẦU HÀM MỚI ---

String.prototype.toDate = function(): Date | null {
  const dateString = this.toString();
  
  // 1. Ưu tiên hàng đầu: Chuẩn ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
  //    Đây là định dạng an toàn và nhất quán nhất.
  if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // 2. Xử lý các định dạng phổ biến khác bằng cách phân tích thủ công
  //    Ví dụ: MM/DD/YYYY, DD/MM/YYYY, YYYY/MM/DD
  const parts = dateString.match(/(\d+)/g);
  if (parts && parts.length >= 3) {
    const p = parts.map(part => parseInt(part, 10));
    let year = p[2], month = p[0], day = p[1]; // Giả định MM/DD/YYYY

    // Heuristic để đoán định dạng dựa trên giá trị
    // Nếu phần tử đầu > 12, nó có thể là ngày (DD/MM/YYYY)
    if (p[0] > 12 && p[1] <= 12) {
      day = p[0];
      month = p[1];
    }
    // Nếu phần tử thứ hai > 12, nó có thể là ngày (MM/DD/YYYY) - đã giả định
    // (Logic này có thể được mở rộng thêm nếu cần)

    // Đảm bảo năm có 4 chữ số
    if (year < 100) {
      year += 2000;
    }

    // Tháng trong JS là 0-11
    const date = new Date(Date.UTC(year, month - 1, day));
    
    // Kiểm tra xem ngày tháng có hợp lệ không
    if (!isNaN(date.getTime()) && date.getUTCFullYear() === year && date.getUTCMonth() === month - 1) {
      return date;
    }
  }

  // 3. Nếu tất cả các cách trên đều thất bại, trả về null
  console.warn(`Could not reliably parse date string: "${dateString}"`);
  return null;
};


// --- HÀM CŨ GIỮ NGUYÊN ---

String.prototype.formatPhoneNumber = function(): string {
  const cleaned = this.replace(/\D/g, '');
  const limited = cleaned.slice(0, 10);
  
  if (limited.length <= 3) return limited;
  if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
  return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
};

export {};