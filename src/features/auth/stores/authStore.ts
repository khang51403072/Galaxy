import { create } from 'zustand/react'; // ✅ dùng đúng hook version
import * as Keychain from 'react-native-keychain';
import { StateCreator } from 'zustand/vanilla';

export type AuthState = {
  userName: string | null;
  token: string | null;
  secureKey: string | null;
  isLoading: boolean;

  login: (userName: string, token: string, secureKey: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

const authStoreCreator: StateCreator<AuthState> = (set) => ({
  userName: null,
  token: null,
  secureKey: null,
  isLoading: true,

  login: async (userName, token, secureKey) => {
    await Keychain.setGenericPassword(userName, JSON.stringify({ token, secureKey }));
    set({ userName, token, secureKey, isLoading: false });
  },

  logout: async () => {
    await Keychain.resetGenericPassword();
    set({
      userName: null,
      token: null,
      secureKey: null,
      isLoading: false,
    });
  },

  restoreSession: async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const { token, secureKey } = JSON.parse(credentials.password);
        set({
          userName: credentials.username,
          token,
          secureKey,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      console.error('Error restoring session:', err);
      set({ isLoading: false });
    }
  },
});

export const useAuthStore = create<AuthState>()(authStoreCreator); // ✅ đúng cú pháp TS
