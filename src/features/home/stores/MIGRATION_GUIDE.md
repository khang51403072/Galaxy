# Migration Guide: Zustand → Redux

## 🎯 Current Zustand Structure (Redux-like)

```typescript
// Current: src/features/home/stores/avatarStore.ts
export interface AvatarState {
  avatarUri: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AvatarActions {
  updateAvatar: (uri: string) => Promise<void>;
  clearAvatar: () => Promise<void>;
  restoreAvatar: () => Promise<void>;
}

export const useAvatarStore = create<AvatarStore>()(avatarStoreCreator);
```

## 🔄 Migration to Redux

### 1. Create Redux Slice

```typescript
// New: src/features/home/slices/avatarSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';

// Async thunks (replaces Zustand actions)
export const updateAvatar = createAsyncThunk(
  'avatar/updateAvatar',
  async (uri: string) => {
    await Keychain.setGenericPassword('avatar', JSON.stringify({ avatarUri: uri }));
    return uri;
  }
);

export const clearAvatar = createAsyncThunk(
  'avatar/clearAvatar',
  async () => {
    await Keychain.resetGenericPassword();
  }
);

export const restoreAvatar = createAsyncThunk(
  'avatar/restoreAvatar',
  async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials && credentials.username === 'avatar') {
      const { avatarUri } = JSON.parse(credentials.password);
      return avatarUri;
    }
    return null;
  }
);

// Slice (replaces Zustand store)
const avatarSlice = createSlice({
  name: 'avatar',
  initialState: {
    avatarUri: null,
    isLoading: true,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.avatarUri = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Unknown error';
      })
      // Similar for clearAvatar and restoreAvatar...
  },
});

export const { setLoading, setError } = avatarSlice.actions;
export default avatarSlice.reducer;
```

### 2. Update Store Configuration

```typescript
// New: src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import avatarReducer from '../features/home/slices/avatarSlice';

export const store = configureStore({
  reducer: {
    avatar: avatarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 3. Update Component Usage

```typescript
// Current: Zustand usage
const { avatarUri, updateAvatar } = useAvatarStore(useShallow((state) => ({
  avatarUri: avatarSelectors.selectAvatarUri(state),
  updateAvatar: state.updateAvatar,
})));

// New: Redux usage
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { updateAvatar } from '../slices/avatarSlice';

const avatarUri = useSelector((state: RootState) => state.avatar.avatarUri);
const dispatch = useDispatch();

const handleUpdateAvatar = (uri: string) => {
  dispatch(updateAvatar(uri));
};
```

### 4. Selectors Migration

```typescript
// Current: Zustand selectors
export const avatarSelectors = {
  selectAvatarUri: (state: AvatarStore) => state.avatarUri,
  selectIsLoading: (state: AvatarStore) => state.isLoading,
  selectError: (state: AvatarStore) => state.error,
};

// New: Redux selectors
import { createSelector } from '@reduxjs/toolkit';

export const selectAvatarUri = (state: RootState) => state.avatar.avatarUri;
export const selectIsLoading = (state: RootState) => state.avatar.isLoading;
export const selectError = (state: RootState) => state.avatar.error;
export const selectHasAvatar = createSelector(
  selectAvatarUri,
  (avatarUri) => !!avatarUri
);
```

## 🚀 Migration Steps

1. **Install Redux Toolkit**
   ```bash
   npm install @reduxjs/toolkit react-redux
   ```

2. **Create Redux store structure**
   - Copy slice code above
   - Set up store configuration

3. **Update components**
   - Replace `useAvatarStore` with `useSelector` + `useDispatch`
   - Update action calls

4. **Test thoroughly**
   - Ensure all functionality works
   - Check error handling

5. **Remove Zustand**
   - Delete avatar store
   - Remove Zustand dependencies if not used elsewhere

## ✅ Benefits of Migration

- **Better DevTools**: Redux DevTools support
- **Middleware**: Redux middleware ecosystem
- **Predictable**: Standard Redux patterns
- **Scalable**: Better for large apps
- **Community**: Larger Redux community

## ⚠️ Considerations

- **Bundle size**: Redux adds more to bundle
- **Boilerplate**: More code required
- **Learning curve**: Team needs Redux knowledge
- **Migration effort**: Time to migrate all stores 