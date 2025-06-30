# Result Pattern Implementation - Auth Feature

## 🎯 Mục tiêu

Implement **Result Pattern** để cải thiện error handling trong Auth feature với:
- Type-safe error handling
- No more try/catch everywhere
- Explicit error types
- Better error recovery
- Functional programming approach

## 📊 Architecture Overview

### **Before vs After:**

#### **Before (Traditional Error Handling):**
```
Repository → throw Error → UseCase → try/catch → throw Error → Store → try/catch → UI
```

#### **After (Result Pattern):**
```
Repository → Result<T, E> → UseCase → Result<T, E> → Store → Result<T, E> → UI
```

### **Data Flow:**
```
UI → Store.login() → UseCase.loginUser() → Repository.login() → API
                ↓
            Result<LoginResult, AuthError> → Pattern Matching → Success/Failure
```

## 🔄 Implementation Details

### **1. Result Type System (src/shared/types/Result.ts):**

#### **Core Types:**
```typescript
export type Result<T, E = Error> = Success<T> | Failure<E>;

export class Success<T> {
  readonly _tag = 'Success' as const;
  readonly value: T;
  
  isSuccess(): this is Success<T> { return true; }
  isFailure(): this is Failure<never> { return false; }
  map<U>(fn: (value: T) => U): Result<U, never> { ... }
  flatMap<U, F>(fn: (value: T) => Result<U, F>): Result<U, F> { ... }
}

export class Failure<E> {
  readonly _tag = 'Failure' as const;
  readonly error: E;
  
  isSuccess(): this is Success<never> { return false; }
  isFailure(): this is Failure<E> { return true; }
  map<U>(_fn: (value: never) => U): Result<U, E> { ... }
  flatMap<U, F>(_fn: (value: never) => Result<U, F>): Result<U, E | F> { ... }
}
```

#### **Utility Functions:**
```typescript
export const success = <T>(value: T): Result<T, never> => new Success(value);
export const failure = <E>(error: E): Result<never, E> => new Failure(error);
export const isSuccess = <T, E>(result: Result<T, E>): result is Success<T> => result.isSuccess();
export const isFailure = <T, E>(result: Result<T, E>): result is Failure<E> => result.isFailure();
```

#### **Benefits:**
- ✅ **Type Safety**: Compile-time error checking
- ✅ **Functional**: Immutable and composable
- ✅ **Explicit**: Clear success/failure states
- ✅ **Composable**: Easy to chain operations

### **2. Auth Error Types (src/features/auth/types/AuthErrors.ts):**

#### **Error Hierarchy:**
```typescript
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

export class InvalidCredentialsError extends AuthError { ... }
export class NetworkError extends AuthError { ... }
export class ServerError extends AuthError { ... }
export class ValidationError extends AuthError { ... }
export class TokenExpiredError extends AuthError { ... }
export class UnauthorizedError extends AuthError { ... }
```

#### **Error Factory:**
```typescript
export const createAuthError = (error: any): AuthError => {
  if (error instanceof AuthError) return error;
  
  if (error.message?.includes('Network request failed')) {
    return new NetworkError();
  }
  
  if (error.status >= 500) {
    return new ServerError(error.message || 'Server error');
  }
  
  // ... more error mapping logic
  
  return new AuthError('Authentication failed', 'UNKNOWN_ERROR', error);
};
```

#### **Benefits:**
- ✅ **Specific Errors**: Different error types for different scenarios
- ✅ **Error Codes**: Machine-readable error codes
- ✅ **Error Mapping**: Automatic error type detection
- ✅ **Consistent**: Standardized error handling

### **3. Repository Layer (Result Pattern):**

#### **Interface:**
```typescript
export interface AuthRepository {
  login(email: string, password: string): Promise<Result<LoginEntity, AuthError>>;
  logout(): Promise<Result<void, AuthError>>;
  refreshToken(): Promise<Result<string, AuthError>>;
  validateToken(token: string): Promise<Result<boolean, AuthError>>;
}
```

#### **Implementation:**
```typescript
async login(email: string, password: string): Promise<Result<LoginEntity, AuthError>> {
  try {
    const response = await this.authApi.login(email, password);
    
    if (!response.data) {
      return failure(new AuthError('Invalid response from server', 'SERVER_ERROR'));
    }

    const loginData: LoginEntity = { /* ... */ };
    return success(loginData);
  } catch (error: any) {
    return failure(createAuthError(error));
  }
}
```

#### **Benefits:**
- ✅ **No Throws**: Repository never throws, always returns Result
- ✅ **Error Transformation**: Raw errors converted to AuthError types
- ✅ **Validation**: Response validation with proper error handling
- ✅ **Consistent**: All methods return Result<T, AuthError>

### **4. UseCase Layer (Result Pattern):**

#### **Business Logic with Validation:**
```typescript
async loginUser(email: string, password: string): Promise<Result<LoginResult, AuthError>> {
  try {
    // Input validation
    const validationResult = this.validateLoginInput(email, password);
    if (isFailure(validationResult)) {
      return validationResult;
    }

    // Repository call
    const loginResult = await this.authRepository.login(email, password);
    
    // Pattern matching
    if (isSuccess(loginResult)) {
      const loginData = loginResult.value;
      const result: LoginResult = { /* transform data */ };
      return success(result);
    } else {
      return failure(loginResult.error);
    }
  } catch (error: any) {
    return failure(new AuthError('Unexpected error occurred', 'UNKNOWN_ERROR', error));
  }
}

// Private validation method
private validateLoginInput(email: string, password: string): Result<void, AuthError> {
  if (!email || !email.trim()) {
    return failure(new ValidationError('Email is required'));
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return failure(new ValidationError('Invalid email format'));
  }
  
  return success(undefined);
}
```

#### **Benefits:**
- ✅ **Business Validation**: Input validation with specific error types
- ✅ **Pattern Matching**: Clean success/failure handling
- ✅ **Data Transformation**: Business logic transformation
- ✅ **Error Propagation**: Errors bubble up with context

### **5. Store Layer (Result Pattern):**

#### **Enhanced Store:**
```typescript
login: async (email: string, password: string): Promise<void> => {
  try {
    set({ isLoading: true });
    
    const authUseCase = new AuthUseCase(authRepository);
    const loginResult = await authUseCase.loginUser(email, password);
    
    if (isSuccess(loginResult)) {
      const loginData = loginResult.value;
      
      // Update store
      await storeLogin(/* ... */);
      
      // Call success callback
      get().onLoginSuccess?.();
    } else {
      // Call error callback
      get().onLoginError?.(loginResult.error.message);
      throw loginResult.error;
    }
  } catch (error: any) {
    const authError = error instanceof AuthError ? error : new AuthError('Unexpected error', 'UNKNOWN_ERROR', error);
    get().onLoginError?.(authError.message);
    throw authError;
  } finally {
    set({ isLoading: false });
  }
}
```

#### **Benefits:**
- ✅ **Result Handling**: Pattern matching for success/failure
- ✅ **Callback Pattern**: UI events handled by callbacks
- ✅ **Error Propagation**: Errors thrown for UI handling
- ✅ **Loading State**: Centralized loading management

### **6. UI Layer (Result Pattern):**

#### **Clean UI with Enhanced Error Handling:**
```typescript
const handleLogin = async (data: { email: string; password: string }) => {
  try {
    await login(data.email, data.password);
    // Success handled by callback
  } catch (error) {
    // Enhanced error logging
    if (error instanceof AuthError) {
      console.error('Auth error:', error.message, error.code);
    } else {
      console.error('Unexpected login error:', error);
    }
  }
};

// Callback setup
useEffect(() => {
  useAuthStore.setState({
    onLoginSuccess: () => navigation.reset({...}),
    onLoginError: (error: string) => Alert.alert('Đăng nhập thất bại', error),
  });
}, [navigation]);
```

#### **Benefits:**
- ✅ **Clean UI**: Minimal error handling in UI
- ✅ **Callback Pattern**: Navigation and alerts handled by callbacks
- ✅ **Error Logging**: Enhanced error logging with types
- ✅ **Separation**: UI logic separated from business logic

## 🎯 Benefits Achieved

### **1. Type Safety:**
- ✅ **Compile-time Errors**: TypeScript catches error handling issues
- ✅ **Explicit Types**: Clear success/failure types
- ✅ **No Runtime Errors**: No unexpected error types

### **2. Functional Programming:**
- ✅ **Immutable**: Result objects are immutable
- ✅ **Composable**: Easy to chain operations
- ✅ **Predictable**: Same input always produces same output

### **3. Error Handling:**
- ✅ **No Try/Catch Everywhere**: Pattern matching instead
- ✅ **Specific Errors**: Different error types for different scenarios
- ✅ **Error Recovery**: Easy to handle specific error types
- ✅ **Error Propagation**: Errors bubble up with context

### **4. Maintainability:**
- ✅ **Clear Data Flow**: Result pattern makes data flow explicit
- ✅ **Easy Testing**: Each layer can be tested independently
- ✅ **Easy Debugging**: Clear error boundaries and types
- ✅ **Easy Extension**: Easy to add new error types or operations

### **5. User Experience:**
- ✅ **Better Error Messages**: Specific error messages for different scenarios
- ✅ **Error Recovery**: App can handle different error types differently
- ✅ **Consistent Behavior**: Same error handling across the app

## 📊 Performance Impact

### **Before:**
- Try/catch blocks everywhere
- Generic error handling
- Runtime error type checking

### **After:**
- Pattern matching (faster than try/catch)
- Compile-time error checking
- Specific error types (better performance)

## 🚀 Future Enhancements

### **Level 2 Improvements:**
1. **Error Recovery**: Add retry logic for network errors
2. **Error Analytics**: Track error types and frequencies
3. **Offline Support**: Handle offline scenarios with Result pattern

### **Level 3 Improvements:**
1. **Error Boundaries**: React error boundaries with Result pattern
2. **Error Caching**: Cache error responses for better UX
3. **Error Reporting**: Send error reports to analytics

## ✅ Testing Strategy

### **Unit Tests:**
```typescript
describe('AuthUseCase with Result Pattern', () => {
  it('should return success for valid credentials', async () => {
    const mockRepository = createMockRepository();
    const useCase = new AuthUseCase(mockRepository);
    
    const result = await useCase.loginUser('test@example.com', 'password');
    
    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.userName).toBe('testuser');
    }
  });

  it('should return validation error for invalid email', async () => {
    const mockRepository = createMockRepository();
    const useCase = new AuthUseCase(mockRepository);
    
    const result = await useCase.loginUser('invalid-email', 'password');
    
    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error.message).toBe('Invalid email format');
    }
  });
});
```

## 🎉 Result

**Result Pattern** đã được implement thành công với:
- ✅ **Type-safe Error Handling**: Compile-time error checking
- ✅ **Functional Approach**: Immutable and composable operations
- ✅ **Specific Error Types**: Different error types for different scenarios
- ✅ **Clean Architecture**: Clear separation of concerns
- ✅ **Better User Experience**: Specific error messages and recovery
- ✅ **Improved Maintainability**: Easy to test, debug, and extend

**Ready for advanced error handling patterns!** 🚀 