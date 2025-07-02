import { create } from 'zustand/react'; // ✅ dùng đúng hook version
import * as Keychain from 'react-native-keychain';
import { StateCreator } from 'zustand/vanilla';
import { Result, isSuccess, isFailure } from '../../../shared/types/Result';
import { AuthError } from '../types/AuthErrors';
import { LoginResult } from '../usecase/AuthUsecase';

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
  error: string | null;
  // Store actions
  storeLogin: (loginResult: LoginResult) => Promise<void>;
  restoreSession: () => Promise<void>;
  
  // Business actions with loading state
  login: (email: string, password: string) => Promise<Result<LoginResult, AuthError>>;
  

};

const authStoreCreator: StateCreator<AuthState> = (set, get) => ({
  userName: null,
  token: null,
  secureKey: null,
  employeeId: null,
  firstName: null,
  lastName: null,
  isLoading: false,
  userId: null,
  isOwner: null,
  error: null,

  storeLogin: async (loginResult: LoginResult) => {
    await Keychain.setGenericPassword(loginResult.userName, JSON.stringify({ token: loginResult.token, password: loginResult.password, firstName: loginResult.firstName, lastName: loginResult.lastName, employeeId: loginResult.employeeId, isOwner: loginResult.isOwner, userName: loginResult.userName  }));
    set({ userName: loginResult.userName, token: loginResult.token, secureKey: loginResult.password, userId: loginResult.userId, firstName: loginResult.firstName, lastName: loginResult.lastName,employeeId : loginResult.employeeId ,isOwner: loginResult.isOwner, });
  },

 

  restoreSession: async () => {
    // try {
    //   const credentials = await Keychain.getGenericPassword();
    //   if (credentials) {
    //     const { token, secureKey, employeeId, firstName, lastName, userId, isOwner } = JSON.parse(credentials.password);
    //     set({
    //       userName: credentials.username,
    //       token,
    //       secureKey,
    //       employeeId,
    //       firstName,
    //       lastName,
    //       userId,
    //       isOwner,
    //       isLoading: false,
    //     });
    //   } else {
    //     set({ isLoading: false });
    //   }
    // } catch (err) {
    //   console.error('Error restoring session:', err);
    //   set({ isLoading: false });
    // }
  },

  // New business action with loading state and Result pattern
  login: async (email: string, password: string): Promise<Result<LoginResult, AuthError>> => {
    set({isLoading: true})
    set({error: null})
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
        loginData
      );
      
      // Call success callback
    }
    set({isLoading: false})
    return loginResult;
  },
});

export const useAuthStore = create<AuthState>()(authStoreCreator); // ✅ đúng cú pháp TS
