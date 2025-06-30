export function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isPhoneValid(phone: string): boolean {
  return /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,}$/.test(phone);
} 