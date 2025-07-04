export class HomeError extends Error {
  constructor(
    message: string,
    public code: string = 'HOME_ERROR',
    public originalError?: any
  ) {
    super(message);
    this.name = 'HomeError';
  }
}

