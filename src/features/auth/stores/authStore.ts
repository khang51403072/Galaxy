import { create } from 'zustand/react';
import * as Keychain from 'react-native-keychain';
import { Result, isSuccess } from '../../../shared/types/Result';
import { AuthError } from '../types/AuthErrors';
import { LoginResult, AuthUseCase } from '../usecase/AuthUsecase';


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
  storeLogin: (loginResult: LoginResult) => Promise<void>;
  login: (email: string, password: string) => Promise<Result<LoginResult, AuthError>>;
};

// Refactor: nhận authUseCase từ ngoài vào
export const createAuthStore = (authUseCase: AuthUseCase) => (set: any, get: any) => ({
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
    await Keychain.setGenericPassword(
      loginResult.userName,
      JSON.stringify({
        token: loginResult.token,
        password: loginResult.password,
        firstName: loginResult.firstName,
        lastName: loginResult.lastName,
        employeeId: loginResult.employeeId,
        isOwner: loginResult.isOwner,
        userName: loginResult.userName,
      })
    );
    set({
      userName: loginResult.userName,
      token: loginResult.token,
      secureKey: loginResult.password,
      userId: loginResult.userId,
      firstName: loginResult.firstName,
      lastName: loginResult.lastName,
      employeeId: loginResult.employeeId,
      isOwner: loginResult.isOwner,
    });
  },
  login: async (email: string, password: string): Promise<Result<LoginResult, AuthError>> => {
    set({ isLoading: true });
    set({ error: null });
    const loginResult = await authUseCase.loginUser(email, password);
    if (isSuccess(loginResult)) {
      const loginData = loginResult.value;
      const storeLogin = get().storeLogin;
      await storeLogin(loginData);
      const deviceId = await getPersistentDeviceId()
      if (!firebase.messaging().isDeviceRegisteredForRemoteMessages) {
        await firebase.messaging().registerDeviceForRemoteMessages();
      }

      const token = await getMessaging().getToken();
      const rq: RegisterFCMRequest = {
        deviceId: deviceId,
        deviceToken: token??"",
        platform: Platform.OS
      };
      await realAuthUseCase.registerFCM(rq);
    }
    set({ isLoading: false });
    return loginResult;
  },
});

// Khởi tạo real usecase ở production
import { ApiAuthRepository } from '../repositories/ApiAuthRepository';
import { AuthApi } from '../services/AuthApi';
import { getPersistentDeviceId } from '@/shared/utils/appConfig';
import { firebase, getMessaging } from '@react-native-firebase/messaging';
import { RegisterFCMRequest } from '../types/AuthTypes';
import { Platform } from 'react-native';
const realAuthUseCase = new AuthUseCase(new ApiAuthRepository(AuthApi));
export const useAuthStore = create<AuthState>()(createAuthStore(realAuthUseCase));
