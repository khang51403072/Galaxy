import { create } from 'zustand/react';
import { Result, isSuccess, isFailure, failure, Failure } from '../../../shared/types/Result';
import { ProfileEntity } from '../types/ProfileResponse';
import { ChangePasswordRequest, UpdateProfileRequest } from '../types/ProfileRequest';
import { UserError } from '../types/UserError';
import { keychainHelper } from '../../../shared/utils/keychainHelper';
import { useHomeStore } from './homeStore';
import { ProfileUseCase } from '../usecase/ProfileUseCase';

export type UserState = {
  profile: ProfileEntity | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  isUseFaceId: boolean;
  showTooltip: boolean;
  setIsUseFaceId: (isUseFaceId: boolean) => void;
  getProfile: () => Promise<Result<ProfileEntity, UserError>>;
  updateProfile: (request: UpdateProfileRequest) => Promise<Result<ProfileEntity, UserError>>;
  changePassword: (request: ChangePasswordRequest) => Promise<Result<void, UserError>>;
  logout: () => Promise<void>;
  uploadAvatar: (imageData: Asset) => Promise<Result<string, UserError>>;
  setShowTooltip: (value:boolean) => void;
  checkIsAllowEdit: () => Promise<string>;
};

export const userSelectors = {
  selectProfile: (state: UserState) => state.profile,
  selectIsLoading: (state: UserState) => state.isLoading,
  selectIsUpdating: (state: UserState) => state.isUpdating,
  selectIsUseFaceId: (state: UserState) => state.isUseFaceId,
  selectGetProfile: (state: UserState) => state.getProfile,
  selectUpdateProfile: (state: UserState) => state.updateProfile,
  selectChangePassword: (state: UserState) => state.changePassword,
  selectError: (state: UserState) => state.error,
  selectLogout: (state: UserState) => state.logout,
  selectSetIsUseFaceId: (state: UserState) => state.setIsUseFaceId,
  selectUploadAvatar: (state: UserState) => state.uploadAvatar,
  selectShowTooltip: (state: UserState) => state.showTooltip,
  selectSetShowTooltip: (state: UserState) => state.setShowTooltip,
  
};

// Refactor: nhận profileUseCase từ ngoài vào
export const createUserStore = (profileUseCase: ProfileUseCase) => (set: any, get: any) => ({
  profile: null,
  isLoading: false,
  isUpdating: false,
  error: null,
  isUseFaceId: false,
  showTooltip: false,
  getProfile: async () => {
    set({ isLoading: true });
    const profileResult = await profileUseCase.getProfile();
    try {
      
      if (isSuccess(profileResult)) {
        const newProfile = profileResult.value;
        useAvatarStore.setState({ avatarUri: newProfile.image });

        const json = await appConfig.getUser();
        if (json && json.selectedStore == null) {
          json.avatarUri = newProfile.image;
          await appConfig.saveUser(json);
        }
        
        set({ profile: newProfile, error: null }); // Chỉ set profile, isLoading sẽ được xử lý ở finally
        return profileResult;
      } else {
        set({ error: profileResult.error.message });
        return profileResult;
      }
    } catch (error) {
      set({ error: "An unexpected error occurred." });
    } finally {
      // Luôn luôn chạy, đảm bảo isLoading được reset
      set({ isLoading: false }); 
      return profileResult;
    }
  },
  updateProfile: async (request: UpdateProfileRequest): Promise<Result<ProfileEntity, UserError>> => {
    set({ isUpdating: true });
    const updateResult = await profileUseCase.updateProfile(request);
    set({ isUpdating: false });
    return updateResult;
  },
  changePassword: async (request: ChangePasswordRequest): Promise<Result<void, UserError>> => {
    set({ isLoading: true });
    const json = await appConfig.getUser();
    const changeResult = await profileUseCase.changePassword(request, json?.password);
    set({ isLoading: false, error: null });
    if(isSuccess(changeResult)) {
      const json = await appConfig.getUser();
      if(json) {
        json.password = request.newPassword;
        await appConfig.saveUser(json);
      }
    }
    return changeResult;
  },
  setIsUseFaceId: (isUseFaceId: boolean) => {
    set({ isUseFaceId: isUseFaceId });
    useHomeStore.getState().updateJson({...useHomeStore.getState().json, isUseFaceId: isUseFaceId});
  },
  logout: async () => {
    set({ isLoading: true });
    const deviceId = await appConfig.getPersistentDeviceId()
    const json = await appConfig.getUser();
    try {
      const rq : LogoutMRequest = {
        deviceId: deviceId,
        employeeId: json?.employeeId
      }
      await realAuthUseCase.logout(rq)
    }
    catch(e){
      throw e
    }
    if(json) {
      const userName = json.userName;
      const password = json.password;
      const fullNameDefault = json.fullNameDefault;
      const avatarUri = json.avatarUri;
      await appConfig.saveUser({
        userName: userName, 
        password: password, 
        avatarUri: avatarUri,
        fullNameDefault: fullNameDefault
      });
      await appConfig.saveUseBiometric(get().isUseFaceId??false);
      await appConfig.clearAutoLogin();
    }
    set({ profile: null, isLoading: false });
  },
  uploadAvatar: async (imageData: Asset): Promise<Result<string, UserError>> => {
    set({ isLoading: true });
    const uploadResult = await profileUseCase.uploadAvatar(imageData);
    set({ isLoading: false });
    return uploadResult;
  },
  setShowTooltip: (value: boolean) => set({showTooltip: value}),
  checkIsAllowEdit: async () => {
    let data = await appConfig.getUser() ;
    if(!data) return ''
    let username = data.userName.split("@")[0]

    let masterStore = data.switchableStores.find((e:StoreItemEntity)=> e.empUser.split("@")[0]==username)

    let isNotAllow = useHomeStore.getState().selectedStore && useHomeStore.getState().selectedStore?.empUser.split("@")[0]!=username

    if(isNotAllow) return `Feature unavailable. Please switch to your home store: ${masterStore?.storeName}`          
    return '';
  }
});

// Khởi tạo real usecase ở production
import { ProfileRepositoryImplement } from '../repositories/ProfileRepositoryImplement';
import { ProfileApi } from '../services/ProfileApi';
const realProfileUseCase = new ProfileUseCase(new ProfileRepositoryImplement(ProfileApi));
export const useUserStore = create<UserState>()(createUserStore(realProfileUseCase)); 

import { ApiAuthRepository } from '../../auth/repositories/ApiAuthRepository';
import { AuthUseCase, StoreItemEntity } from '@/features/auth/usecase/AuthUsecase';
import { AuthApi } from '@/features/auth/services/AuthApi';
import { LoginEntity, LogoutMRequest } from '@/features/auth/types/AuthTypes';
import { appConfig } from '@/shared/utils/appConfig';
import { Asset } from 'react-native-image-picker';
import { useAvatarStore } from './avatarStore';

const realAuthUseCase = new AuthUseCase(new ApiAuthRepository(AuthApi));