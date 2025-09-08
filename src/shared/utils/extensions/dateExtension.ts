/**
 * date.extensions.ts - Modern, flexible Date formatting for React Native
 *
 * Single `format` method inspired by libraries like date-fns.
 *
 * =================================================================
 *                        SUPPORTED FORMATS
 * =================================================================
 * Year:
 *   yyyy: 2025
 *   yy:   25
 *
 * Month:
 *   MMMM: September (Long name, locale-aware)
 *   MMM:  Sep (Short name, locale-aware)
 *   MM:   09 (2-digit number)
 *   M:    9 (Number)
 *
 * Day:
 *   dd:   06 (2-digit number)
 *   d:    6 (Number)
 *
 * Hour (12 & 24):
 *   HH:   09, 21 (24-hour, 2-digit)
 *   H:    9, 21 (24-hour)
 *   hh:   09, 09 (12-hour, 2-digit)
 *   h:    9, 9 (12-hour)
 *
 * Minute:
 *   mm:   05 (2-digit)
 *   m:    5
 *
 * Second:
 *   ss:   07 (2-digit)
 *   s:    7
 *
 * AM/PM:
 *   a:    am/pm
 *   A:    AM/PM
 *
 * =================================================================
 * USAGE EXAMPLES:
 *   const date = new Date('2025-09-06T21:05:07');
 *   date.format('MM/dd/yyyy')       // '09/06/2025'
 *   date.format('dd-MM-yyyy HH:mm') // '06-09-2025 21:05'
 *   date.format('hh:mm a, MMM d')   // '09:05 PM, Sep 6'
 *   date.format('MMMM yyyy', 'vi-VN') // 'Tháng Chín 2025'
 */

declare global {
  interface Date {
    /**
     * Formats the date according to the given format string.
     * @param formatString - The string of tokens.
     * @param locale - Optional locale for month names (e.g., 'vi-VN').
     * @returns The formatted date string.
     */
    format(formatString: string, locale?: string): string;
  }
}

/**
 * Validates the date object before formatting.
 * @param date - The Date object to validate.
 */
function validateDate(date: Date): void {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date object provided to format function.');
  }
}

Date.prototype.format = function(formatString: string, locale: string = 'en-US'): string {
  validateDate(this);

  const date = this;
  
  // --- Getters for all date parts ---
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours24 = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  let hours12 = hours24 % 12;
  hours12 = hours12 ? hours12 : 12; // Hour '0' should be '12'

  // --- Map of tokens to their values ---
  const tokens: { [key: string]: () => string | number } = {
    // Year
    yyyy: () => year,
    yy: () => String(year).slice(-2),
    
    // Month
    MMMM: () => new Intl.DateTimeFormat(locale, { month: 'long' }).format(date),
    MMM: () => new Intl.DateTimeFormat(locale, { month: 'short' }).format(date),
    MM: () => String(month).padStart(2, '0'),
    M: () => month,
    
    // Day
    dd: () => String(day).padStart(2, '0'),
    d: () => day,

    // Hour
    HH: () => String(hours24).padStart(2, '0'),
    H: () => hours24,
    hh: () => String(hours12).padStart(2, '0'),
    h: () => hours12,

    // Minute
    mm: () => String(minutes).padStart(2, '0'),
    m: () => minutes,

    // Second
    ss: () => String(seconds).padStart(2, '0'),
    s: () => seconds,

    // AM/PM
    A: () => (hours24 < 12 ? 'AM' : 'PM'),
    a: () => (hours24 < 12 ? 'am' : 'pm'),
  };

  // Create a regex from all supported tokens
  const regex = new RegExp(Object.keys(tokens).join('|'), 'g');

  // Replace each token in the format string with its corresponding value
  return formatString.replace(regex, (match) => String(tokens[match]()));
};

export {};