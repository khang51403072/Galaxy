declare global {
  interface String {
    dateOfMonth(): number;
    formatPhoneNumber(): string
    toDDMMYYYY(divider?: string): string;
  }
}
String.prototype.toDDMMYYYY = function(divider?: string): string {
  const date = new Date(this.toString());
  return date.toDDMMYYYY(divider);
};
// Extend String prototype
String.prototype.dateOfMonth = function(): number {
  try {
    // Parse ISO date string like "2025-06-12T00:00:00+00:00"
    const date = new Date(this.toString());
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }
    
    // Return day of month (1-31)
    return date.getDate();
  } catch (error) {
    console.error('Error parsing date:', error);
    return 0; // Return 0 if parsing fails
  }
};
// Phone number formatting function
String.prototype.formatPhoneNumber = function(): string {
  // Remove all non-digit characters
  const cleaned = this.replace(/\D/g, '');
  
  // Limit to 10 digits
  const limited = cleaned.slice(0, 10);
  
  // Format based on length
  if (limited.length === 0) return '';
  if (limited.length <= 3) return `(${limited}`;
  if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
  return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
};
// Export for TypeScript to recognize the extension
export {}; 