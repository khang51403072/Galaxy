import { create } from 'zustand';
import * as Keychain from 'react-native-keychain';

type AuthState = {
  userName: string | null;
  token: string | null;
  secureKey: string | null;
  isLoading: boolean;

  login: (userName: string, token: string, secureKey: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  userName: null,
  token: null,
  secureKey: null,
  isLoading: true,

  login: async (userName, token, secureKey) => {
    await Keychain.setGenericPassword(userName, JSON.stringify({ token, secureKey }));
    set({ userName, token, secureKey });
  },

  logout: async () => {
    await Keychain.resetGenericPassword();
    set({ userName: null, token: null, secureKey: null });
  },

  restoreSession: async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      const { token, secureKey } = JSON.parse(credentials.password);
      set({ userName: credentials.username, token, secureKey, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
}));
