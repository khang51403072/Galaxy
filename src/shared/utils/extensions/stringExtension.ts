declare global {
  interface String {
    dateOfMonth(): number;
  }
}

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

// Export for TypeScript to recognize the extension
export {}; 