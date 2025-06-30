# Services Refactor - Tách HomeApi thành ProfileApi và DashboardApi

## 🎯 Mục tiêu

Tách `HomeApi` thành 2 services riêng biệt:
- **`ProfileApi`**: Xử lý profile operations
- **`DashboardApi`**: Xử lý dashboard data & actions

## 📁 File Structure Mới

```
src/features/home/
├── services/
│   ├── ProfileApi.ts      # Profile operations
│   └── DashboardApi.ts    # Dashboard data & actions
├── usecase/
│   ├── ProfileUseCase.ts  # Profile business logic
│   ├── DashboardUseCase.ts # Dashboard business logic
│   └── HomeUseCase.ts     # Updated to use ProfileApi
└── screens/
    ├── ProfileScreen.tsx  # Uses ProfileUseCase
    └── DashBoardScreen.tsx # Uses DashboardUseCase
```

## 🔄 Changes Made

### **1. Deleted Files:**
- ❌ `src/features/home/services/HomeApi.ts`
- ❌ `src/features/home/services/SERVICES_ARCHITECTURE.md`

### **2. Created Files:**
- ✅ `src/features/home/services/ProfileApi.ts`
- ✅ `src/features/home/services/DashboardApi.ts`
- ✅ `src/features/home/usecase/ProfileUseCase.ts`
- ✅ `src/features/home/usecase/DashboardUseCase.ts`

### **3. Updated Files:**
- ✅ `src/features/home/usecase/HomeUseCase.ts` - Now uses ProfileApi
- ✅ `src/features/home/screens/DashBoardScreen.tsx` - Now uses DashboardUseCase

## 📋 API Endpoints

### **ProfileApi Endpoints:**
```
GET    /galaxy-me/profile
PUT    /galaxy-me/profile
POST   /galaxy-me/change-password
POST   /galaxy-me/upload-avatar
```

### **DashboardApi Endpoints:**
```
GET    /galaxy-me/dashboard/stats
GET    /galaxy-me/dashboard/activities
GET    /galaxy-me/dashboard/schedule
GET    /galaxy-me/dashboard/notifications
PUT    /galaxy-me/dashboard/notifications/:id/read
POST   /galaxy-me/dashboard/checkin
POST   /galaxy-me/dashboard/checkout
```

## 🎯 Benefits

### **1. Separation of Concerns:**
- **ProfileApi**: Chỉ xử lý user profile data
- **DashboardApi**: Chỉ xử lý dashboard statistics và actions

### **2. Better Organization:**
- Clear file structure
- Easy to locate specific functionality
- Reduced coupling between features

### **3. Improved Maintainability:**
- Each service has single responsibility
- Easier to test and debug
- Independent versioning

### **4. Performance:**
- Granular API calls
- Optimized caching strategies
- Reduced bundle size

## 🔧 Migration Guide

### **From Old HomeApi:**
```typescript
// OLD
import { HomeApi } from '../services/HomeApi';
const profile = await HomeApi.getProfile();

// NEW
import { ProfileApi } from '../services/ProfileApi';
const profile = await ProfileApi.getProfile();
```

### **Update UseCase Imports:**
```typescript
// OLD
import { HomeApi } from '../services/HomeApi';

// NEW
import { ProfileApi } from '../services/ProfileApi';
import { DashboardApi } from '../services/DashboardApi';
```

## 📊 Data Flow

### **Profile Flow:**
```
ProfileScreen → ProfileUseCase → ProfileApi
```

### **Dashboard Flow:**
```
DashBoardScreen → DashboardUseCase → DashboardApi
```

## 🚀 Next Steps

1. **Update remaining screens** to use new APIs
2. **Implement caching strategy** for each service
3. **Add error handling** per service
4. **Create unit tests** for each API service
5. **Add TypeScript interfaces** for all API responses

## ✅ Completed

- [x] Tách HomeApi thành ProfileApi và DashboardApi
- [x] Tạo ProfileUseCase và DashboardUseCase
- [x] Cập nhật HomeUseCase để sử dụng ProfileApi
- [x] Cập nhật DashBoardScreen để sử dụng DashboardUseCase
- [x] Xóa HomeApi và documentation cũ
- [x] Tạo documentation mới

## 🎉 Result

Architecture mới đã được implement thành công với:
- **Clear separation** giữa Profile và Dashboard operations
- **Better maintainability** và **scalability**
- **Improved performance** và **user experience** 