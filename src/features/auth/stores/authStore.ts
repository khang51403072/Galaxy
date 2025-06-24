import { create } from 'zustand/react'; // ✅ dùng đúng hook version
import * as Keychain from 'react-native-keychain';
import { StateCreator } from 'zustand/vanilla';

export type AuthState = {
  userName: string | null;
  token: string | null;
  secureKey: string | null;
  employeeId: string | null;
  firstName: string | null;
  lastName: string | null;
  isLoading: boolean;
  storeLogin: (userName: string, token: string, secureKey: string, employeeId: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

const authStoreCreator: StateCreator<AuthState> = (set) => ({
  userName: null,
  token: null,
  secureKey: null,
  employeeId: null,
  firstName: null,
  lastName: null,
  isLoading: true,

  storeLogin: async (userName, token, secureKey, employeeId, firstName, lastName) => {
    await Keychain.setGenericPassword(userName, JSON.stringify({ token, secureKey }));
    set({ userName, token, secureKey, employeeId, firstName, lastName, isLoading: false });
  },

  logout: async () => {
    await Keychain.resetGenericPassword();
    set({
      userName: null,
      token: null,
      secureKey: null,
      employeeId: null,
      firstName: null,
      lastName: null,
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
          employeeId: null,
          firstName: null,
          lastName: null,
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
