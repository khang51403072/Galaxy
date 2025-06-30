# Auth Feature - Repository Pattern Implementation

## 🎯 Mục tiêu

Implement Repository Pattern cho Auth feature để:
- Tách biệt data access logic
- Tăng testability
- Tuân thủ Clean Architecture
- Foundation cho caching strategy

## 📊 Architecture Mới

### **Flow trước:**
```
LoginScreen → authStore → AuthUseCase → AuthApi
```

### **Flow sau:**
```
LoginScreen → authStore → AuthUseCase → AuthRepository → AuthApi
```

### **File Structure:**
```
src/features/auth/
├── repositories/
│   ├── AuthRepository.ts          # Interface
│   ├── ApiAuthRepository.ts       # API implementation
│   └── index.ts                   # Repository exports
├── services/
│   └── AuthApi.ts                 # Existing API layer
├── usecase/
│   └── AuthUseCase.ts             # Updated to use repository
├── stores/
│   └── authStore.ts               # Existing store
└── screens/
    └── LoginScreen.tsx            # Updated to use new UseCase
```

## 🔄 Changes Made

### **1. Created Files:**
- ✅ `src/features/auth/repositories/AuthRepository.ts`
- ✅ `src/features/auth/repositories/ApiAuthRepository.ts`
- ✅ `src/features/auth/repositories/index.ts`

### **2. Updated Files:**
- ✅ `src/features/auth/usecase/AuthUseCase.ts`
- ✅ `src/features/auth/screens/LoginScreen.tsx`

## 📋 Repository Interface

```typescript
export interface AuthRepository {
  login(username: string, password: string): Promise<LoginEntity>;
  logout(): Promise<void>;
  refreshToken(): Promise<string>;
  validateToken(token: string): Promise<boolean>;
}
```

## 🏗️ Implementation Details

### **ApiAuthRepository:**
- Implements AuthRepository interface
- Wraps AuthApi calls
- Handles error transformation
- Ready for future caching implementation

### **AuthUseCase:**
- Now accepts AuthRepository in constructor
- Enhanced logging for all operations
- Better error handling
- Supports all auth operations (login, logout, refresh, validate)

### **LoginScreen:**
- Creates AuthUseCase instance with repository
- Uses dependency injection pattern
- Maintains same user experience

## 🎯 Benefits Achieved

### **1. Testability:**
```typescript
// Easy to mock for testing
const mockRepository = {
  login: jest.fn().mockResolvedValue(mockLoginData)
};
const useCase = new AuthUseCase(mockRepository);
```

### **2. Clean Architecture:**
- Dependency Inversion Principle
- Single Responsibility Principle
- Interface Segregation Principle

### **3. Flexibility:**
- Easy to switch implementations
- Ready for caching strategy
- Support for multiple data sources

### **4. Maintainability:**
- Clear separation of concerns
- Easy to locate and modify
- Better error handling

## 🚀 Future Enhancements

### **1. Caching Strategy:**
```typescript
class CachedAuthRepository implements AuthRepository {
  async login(username: string, password: string) {
    // Check cache first
    // Call API if needed
    // Save to cache
  }
}
```

### **2. Offline Support:**
```typescript
class OfflineAuthRepository implements AuthRepository {
  async login(username: string, password: string) {
    // Try API first
    // Fallback to local storage
  }
}
```

### **3. Retry Logic:**
```typescript
class ResilientAuthRepository implements AuthRepository {
  async login(username: string, password: string) {
    // Retry failed requests
    // Exponential backoff
  }
}
```

## 📊 Performance Impact

### **Current:**
- Direct API calls
- No caching
- Basic error handling

### **With Repository:**
- Same performance (no overhead)
- Ready for caching
- Enhanced error handling
- Better logging

## ✅ Testing Strategy

### **Unit Tests:**
```typescript
describe('AuthUseCase', () => {
  it('should login user successfully', async () => {
    const mockRepository = createMockRepository();
    const useCase = new AuthUseCase(mockRepository);
    
    await useCase.loginUser('test@example.com', 'password');
    
    expect(mockRepository.login).toHaveBeenCalledWith('test@example.com', 'password');
  });
});
```

### **Integration Tests:**
```typescript
describe('AuthRepository Integration', () => {
  it('should call API correctly', async () => {
    const repository = new ApiAuthRepository(AuthApi);
    const result = await repository.login('test', 'password');
    
    expect(result).toBeDefined();
  });
});
```

## 🎉 Result

Repository Pattern đã được implement thành công cho Auth feature với:
- ✅ Clean Architecture compliance
- ✅ Enhanced testability
- ✅ Better maintainability
- ✅ Foundation for future enhancements
- ✅ Zero performance impact 