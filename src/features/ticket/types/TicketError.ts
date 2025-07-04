export class TicketError extends Error {
  constructor(
    message: string,
    public code: string = 'TICKET_ERROR',
    public originalError?: any
  ) {
    super(message);
    this.name = 'TicketError';
  }
} 