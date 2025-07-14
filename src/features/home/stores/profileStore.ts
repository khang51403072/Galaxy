import { create } from 'zustand/react';
import { Result, isSuccess, isFailure, failure } from '../../../shared/types/Result';
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
  setIsUseFaceId: (isUseFaceId: boolean) => void;
  getProfile: () => Promise<Result<ProfileEntity, UserError>>;
  updateProfile: (request: UpdateProfileRequest) => Promise<Result<ProfileEntity, UserError>>;
  changePassword: (request: ChangePasswordRequest) => Promise<Result<void, UserError>>;
  logout: () => Promise<void>;
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
};

// Refactor: nhận profileUseCase từ ngoài vào
export const createUserStore = (profileUseCase: ProfileUseCase) => (set: any, get: any) => ({
  profile: null,
  isLoading: false,
  isUpdating: false,
  error: null,
  isUseFaceId: useHomeStore.getState().json?.isUseFaceId || false,
  getProfile: async (): Promise<Result<ProfileEntity, UserError>> => {
    set({ isLoading: true });
    const profileResult = await profileUseCase.getProfile();
    set({ isLoading: false });
    return profileResult;
  },
  updateProfile: async (request: UpdateProfileRequest): Promise<Result<ProfileEntity, UserError>> => {
    set({ isUpdating: true });
    const updateResult = await profileUseCase.updateProfile(request);
    set({ isUpdating: false });
    return updateResult;
  },
  changePassword: async (request: ChangePasswordRequest): Promise<Result<void, UserError>> => {
    set({ isLoading: true });
    const json = await keychainHelper.getObject();
    const changeResult = await profileUseCase.changePassword(request, json?.password);
    set({ isLoading: false });
    if(isSuccess(changeResult)) {
      const json = await keychainHelper.getObject();
      if(json) {
        json.password = request.newPassword;
        await keychainHelper.saveObject(json);
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
    const json = await keychainHelper.getObject();
    if(json) {
      const userName = json.userName;
      const password = json.password;
      const firstName = json.firstName;
      const lastName = json.lastName;
      const avatarUri = json.avatarUri;
      const isUseFaceId = get().isUseFaceId??false;
      await keychainHelper.reset();
      await keychainHelper.saveObject({userName: userName, password: password, firstName: firstName, lastName: lastName, avatarUri: avatarUri, isUseFaceId: isUseFaceId});
    }
    set({ profile: null, isLoading: false });
  },
});

// Khởi tạo real usecase ở production
import { ProfileRepositoryImplement } from '../repositories/ProfileRepositoryImplement';
import { ProfileApi } from '../services/ProfileApi';
const realProfileUseCase = new ProfileUseCase(new ProfileRepositoryImplement(ProfileApi));
export const useUserStore = create<UserState>()(createUserStore(realProfileUseCase)); 