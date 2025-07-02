import { create } from 'zustand/react';
import * as Keychain from 'react-native-keychain';
import { StateCreator } from 'zustand/vanilla';

// ===== TYPES (Redux-like) =====
export interface AvatarState {
  avatarUri: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AvatarActions {
  // Actions (Redux-like)
  updateAvatar: (uri: string) => Promise<void>;
  clearAvatar: () => Promise<void>;
  restoreAvatar: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export type AvatarStore = AvatarState & AvatarActions;

// ===== ACTION TYPES (Redux-like) =====
export const AVATAR_ACTIONS = {
  UPDATE_AVATAR: 'UPDATE_AVATAR',
  CLEAR_AVATAR: 'CLEAR_AVATAR',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
} as const;

// ===== INITIAL STATE (Redux-like) =====
const initialState: AvatarState = {
  avatarUri: null,
  isLoading: false,
  error: null,
};

// ===== STORE CREATOR (Redux-like pattern) =====
const avatarStoreCreator: StateCreator<AvatarStore> = (set, get) => ({
  // Initial state
  ...initialState,

  // Actions (Redux-like)
  updateAvatar: async (uri: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Lưu avatar URI vào Keychain (secure storage)
      await Keychain.setGenericPassword('avatar', JSON.stringify({ avatarUri: uri }));
      
      set({ 
        avatarUri: uri, 
        isLoading: false, 
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ 
        isLoading: false, 
        error: errorMessage 
      });
      console.error('Error saving avatar:', error);
    }
  },

  clearAvatar: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Xóa avatar URI khỏi Keychain
      await Keychain.resetGenericPassword();
      
      set({ 
        avatarUri: null, 
        isLoading: false, 
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ 
        isLoading: false, 
        error: errorMessage 
      });
      console.error('Error clearing avatar:', error);
    }
  },

  restoreAvatar: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const credentials = await Keychain.getGenericPassword();
      if (credentials && credentials.username === 'avatar') {
        const { avatarUri } = JSON.parse(credentials.password);
        set({ 
          avatarUri, 
          isLoading: false, 
          error: null 
        });
      } else {
        set({ 
          isLoading: false, 
          error: null 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ 
        isLoading: false, 
        error: errorMessage 
      });
      console.error('Error restoring avatar:', error);
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
});

// ===== STORE INSTANCE (Redux-like) =====
export const useAvatarStore = create<AvatarStore>()(avatarStoreCreator);

// ===== SELECTORS (Redux-like) =====
export const avatarSelectors = {
  selectAvatarUri: (state: AvatarStore) => state.avatarUri,
  selectIsLoading: (state: AvatarStore) => state.isLoading,
  selectError: (state: AvatarStore) => state.error,
  selectHasAvatar: (state: AvatarStore) => !!state.avatarUri,
}; 