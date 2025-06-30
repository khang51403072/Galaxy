// Result type for functional error handling
export type Result<T, E = Error> = Success<T> | Failure<E>;

// Success variant
export class Success<T> {
  readonly _tag = 'Success' as const;
  readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  isSuccess(): this is Success<T> {
    return true;
  }

  isFailure(): this is Failure<never> {
    return false;
  }

  map<U>(fn: (value: T) => U): Result<U, never> {
    return new Success(fn(this.value));
  }

  flatMap<U, F>(fn: (value: T) => Result<U, F>): Result<U, F> {
    return fn(this.value);
  }

  getOrElse<U>(defaultValue: U): T | U {
    return this.value;
  }

  getOrThrow(): T {
    return this.value;
  }
}

// Failure variant
export class Failure<E> {
  readonly _tag = 'Failure' as const;
  readonly error: E;

  constructor(error: E) {
    this.error = error;
  }

  isSuccess(): this is Success<never> {
    return false;
  }

  isFailure(): this is Failure<E> {
    return true;
  }

  map<U>(_fn: (value: never) => U): Result<U, E> {
    return new Failure(this.error);
  }

  flatMap<U, F>(_fn: (value: never) => Result<U, F>): Result<U, E | F> {
    return new Failure(this.error);
  }

  getOrElse<U>(defaultValue: U): U {
    return defaultValue;
  }

  getOrThrow(): never {
    throw this.error;
  }
}

// Factory functions
export const success = <T>(value: T): Result<T, never> => new Success(value);
export const failure = <E>(error: E): Result<never, E> => new Failure(error);

// Utility functions
export const isSuccess = <T, E>(result: Result<T, E>): result is Success<T> => {
  return result.isSuccess();
};

export const isFailure = <T, E>(result: Result<T, E>): result is Failure<E> => {
  return result.isFailure();
};

// Pattern matching
export const match = <T, E, R>(
  result: Result<T, E>,
  onSuccess: (value: T) => R,
  onFailure: (error: E) => R
): R => {
  if (result.isSuccess()) {
    return onSuccess(result.value);
  } else {
    return onFailure(result.error);
  }
};

// Async Result utilities
export const asyncResult = async <T, E>(
  promise: Promise<T>
): Promise<Result<T, E>> => {
  try {
    const value = await promise;
    return success(value);
  } catch (error) {
    return failure(error as E);
  }
};

// Result from nullable
export const fromNullable = <T>(value: T | null | undefined): Result<T, Error> => {
  if (value == null) {
    return failure(new Error('Value is null or undefined'));
  }
  return success(value);
};

// Result from predicate
export const fromPredicate = <T>(
  value: T,
  predicate: (value: T) => boolean,
  errorMessage: string
): Result<T, Error> => {
  if (predicate(value)) {
    return success(value);
  }
  return failure(new Error(errorMessage));
}; 