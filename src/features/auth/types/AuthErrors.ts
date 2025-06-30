// Auth-specific error types
export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// Specific auth error types
export class InvalidCredentialsError extends AuthError {
  constructor(message = 'Invalid email or password') {
    super(message, 'INVALID_CREDENTIALS');
  }
}

export class NetworkError extends AuthError {
  constructor(message = 'Network connection failed') {
    super(message, 'NETWORK_ERROR');
  }
}

export class ServerError extends AuthError {
  constructor(message = 'Server error occurred') {
    super(message, 'SERVER_ERROR');
  }
}

export class ValidationError extends AuthError {
  constructor(message = 'Validation failed', details?: any) {
    super(message, 'VALIDATION_ERROR', details);
  }
}

export class TokenExpiredError extends AuthError {
  constructor(message = 'Token has expired') {
    super(message, 'TOKEN_EXPIRED');
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = 'Unauthorized access') {
    super(message, 'UNAUTHORIZED');
  }
}

// Error factory functions
export const createAuthError = (error: any): AuthError => {
  if (error instanceof AuthError) {
    return error;
  }

  // Handle network errors
  if (error.message?.includes('Network request failed')) {
    return new NetworkError();
  }

  // Handle server errors
  if (error.status >= 500) {
    return new ServerError(error.message || 'Server error');
  }

  // Handle unauthorized errors
  if (error.status === 401) {
    return new UnauthorizedError();
  }

  // Handle validation errors
  if (error.status === 400) {
    return new ValidationError(error.message || 'Invalid request');
  }

  // Default to generic auth error
  return new AuthError(
    error.message || 'Authentication failed',
    'UNKNOWN_ERROR',
    error
  );
};

// Error code constants
export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type AuthErrorCode = typeof AUTH_ERROR_CODES[keyof typeof AUTH_ERROR_CODES]; 