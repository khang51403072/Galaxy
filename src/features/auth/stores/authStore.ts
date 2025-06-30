import { create } from 'zustand/react'; // ✅ dùng đúng hook version
import * as Keychain from 'react-native-keychain';
import { StateCreator } from 'zustand/vanilla';
import { Result, isSuccess, isFailure } from '../../../shared/types/Result';
import { AuthError } from '../types/AuthErrors';

export type AuthState = {
  userName: string | null;
  token: string | null;
  secureKey: string | null;
  employeeId: string | null;
  firstName: string | null;
  lastName: string | null;
  isLoading: boolean;
  userId: string | null;
  isOwner: boolean | null;
  
  // Store actions
  storeLogin: (userName: string, token: string, secureKey: string, userId: string, firstName: string, lastName: string, employeeId: string, isOwner: boolean, isLoading: boolean) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  
  // Business actions with loading state
  login: (email: string, password: string) => Promise<void>;
  
  // Callbacks for UI
  onLoginSuccess?: () => void;
  onLoginError?: (error: string) => void;
};

const authStoreCreator: StateCreator<AuthState> = (set, get) => ({
  userName: null,
  token: null,
  secureKey: null,
  employeeId: null,
  firstName: null,
  lastName: null,
  isLoading: true,
  userId: null,
  isOwner: null,


  storeLogin: async (userName, token, secureKey, userId, firstName, lastName, employeeId, isOwner) => {
    await Keychain.setGenericPassword(userName, JSON.stringify({ token, secureKey }));
    set({ userName, token, secureKey, userId, firstName, lastName,employeeId ,isOwner, isLoading: false });
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

  // New business action with loading state and Result pattern
  login: async (email: string, password: string): Promise<void> => {
    try {
      set({ isLoading: true });
      
      // Import here to avoid circular dependency
      const { AuthUseCase } = await import('../usecase/AuthUsecase');
      const { authRepository } = await import('../repositories');
      
      const authUseCase = new AuthUseCase(authRepository);
      const loginResult = await authUseCase.loginUser(email, password);
      
      if (isSuccess(loginResult)) {
        const loginData = loginResult.value;
        
        // Update store with login data
        const storeLogin = get().storeLogin;
        await storeLogin(
          loginData.userName,
          loginData.token,
          password,
          loginData.userId,
          loginData.firstName,
          loginData.lastName,
          loginData.employeeId,
          loginData.isOwner,
          false
        );
        
        // Call success callback
        get().onLoginSuccess?.();
      } else {
        // Call error callback
        get().onLoginError?.(loginResult.error.message);
        throw loginResult.error;
      }
    } catch (error: any) {
      const authError = error instanceof AuthError ? error : new AuthError('Unexpected error occurred', 'UNKNOWN_ERROR', error);
      
      // Call error callback
      get().onLoginError?.(authError.message);
      throw authError;
    } finally {
      set({ isLoading: false });
    }
  },
});

export const useAuthStore = create<AuthState>()(authStoreCreator); // ✅ đúng cú pháp TS
