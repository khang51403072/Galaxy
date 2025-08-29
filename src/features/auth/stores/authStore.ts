import { create } from 'zustand/react';
import { Result, isSuccess } from '../../../shared/types/Result';
import { AuthError } from '../types/AuthErrors';
import { LoginResult, AuthUseCase, StoreItemEntity } from '../usecase/AuthUsecase';
import { appConfig } from '@/shared/utils/appConfig';


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
  switchStore: (store: StoreItemEntity) => Promise<Result<LoginResult, AuthError>>;
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
    set(loginResult);
    await appConfig.saveUser( loginResult);
    await appConfig.saveAutoLogin(true);
  },
  login: async (usename: string, password: string): Promise<Result<LoginResult, AuthError>> => {
    set({ isLoading: true,error: null });
    const request = { userName: usename, password: password };
    const loginResult = await authUseCase.loginUser(request);
    if (isSuccess(loginResult)) {
      const loginData = loginResult.value;
      loginData.fullNameDefault = loginData.firstName + ' ' +loginData.lastName
      await get().storeLogin(loginData);
      //register fcm 
      if (!firebase.messaging().isDeviceRegisteredForRemoteMessages) {
        await firebase.messaging().registerDeviceForRemoteMessages();
      }
      const deviceId = await appConfig.getPersistentDeviceId();
      const token = await getMessaging().getToken();
      const rq: RegisterFCMRequest = {
        deviceId: deviceId,
        deviceToken: token??"",
        platform: Platform.OS
      };
      await realAuthUseCase.registerFCM(rq);
      ////
    }
    set({ isLoading: false });
    return loginResult;
  },
  switchStore: async (store: StoreItemEntity): Promise<Result<LoginResult, AuthError>> =>{
    set({ isLoading: true,error: null });
    const request:LoginRequest = { 
      userName: store.empUser, 
      password: store.empPassword??"", 
      masterEmployeeId: store.masterEmployeeId,
      masterStoreId: store.masterStoreId
    };
    const loginResult = await authUseCase.loginUser(request);
    if (isSuccess(loginResult)) {
      const loginData:any = loginResult.value; 
      const currentUser = await appConfig.getUser()                   
      loginData.selectedStore = store;
      loginData.userName = currentUser.userName
      loginData.password = currentUser.password
      loginData.fullNameDefault = currentUser.fullNameDefault
      loginData.avatarUri = currentUser.avatarUri
      await get().storeLogin(loginData);
      
      //register fcm 
      if (!firebase.messaging().isDeviceRegisteredForRemoteMessages) {
        await firebase.messaging().registerDeviceForRemoteMessages();
      }
      const deviceId = await appConfig.getPersistentDeviceId();
      const token = await getMessaging().getToken();
      const rq: RegisterFCMRequest = {
        deviceId: deviceId,
        deviceToken: token??"",
        platform: Platform.OS
      };
      await realAuthUseCase.registerFCM(rq);
      ////
    }
    set({ isLoading: false });
    return loginResult;
  }
});

// Khởi tạo real usecase ở production
import { ApiAuthRepository } from '../repositories/ApiAuthRepository';
import { AuthApi } from '../services/AuthApi';
import { firebase, getMessaging } from '@react-native-firebase/messaging';
import { LoginRequest, RegisterFCMRequest } from '../types/AuthTypes';
import { Platform } from 'react-native';
const realAuthUseCase = new AuthUseCase(new ApiAuthRepository(AuthApi));
export const useAuthStore = create<AuthState>()(createAuthStore(realAuthUseCase));
