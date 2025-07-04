import { create } from 'zustand/react';
import { StateCreator } from 'zustand/vanilla';
import { Result, isSuccess, isFailure, failure } from '../../../shared/types/Result';
import { ProfileEntity } from '../types/ProfileResponse';
import { ChangePasswordRequest, UpdateProfileRequest } from '../types/ProfileRequest';
import { UserError } from '../types/UserError';
import { keychainHelper } from '../../../shared/utils/keychainHelper';

export type UserState = {
  profile: ProfileEntity | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  // Business actions
  getProfile: () => Promise<Result<ProfileEntity, UserError>>;
  updateProfile: (request: UpdateProfileRequest) => Promise<Result<ProfileEntity, UserError>>;
  changePassword: (request: ChangePasswordRequest) => Promise<Result<ProfileEntity, UserError>>;
  logout: () => Promise<void>;
};

// Selectors
export const userSelectors = {
  selectProfile: (state: UserState) => state.profile,
  selectIsLoading: (state: UserState) => state.isLoading,
  selectIsUpdating: (state: UserState) => state.isUpdating,
  selectGetProfile: (state: UserState) => state.getProfile,
  selectUpdateProfile: (state: UserState) => state.updateProfile,
  selectChangePassword: (state: UserState) => state.changePassword,
  selectError: (state: UserState) => state.error,
  selectLogout: (state: UserState) => state.logout,
};

const userStoreCreator: StateCreator<UserState> = (set, get) => {
  let repository: any = null;
  let ProfileApi: any = null;
  let ApiUserRepository: any = null;
  let getProfileUseCase: any = null;
  let updateProfileUseCase: any = null;
  let changePasswordUseCase: any = null;

  // Helper function để load modules
  const loadModules = async () => {
    if(ProfileApi === null) {
      const profileApiModule = await import('../services/ProfileApi');
      ProfileApi = profileApiModule.ProfileApi;
    }
    if(ApiUserRepository === null) {
      const apiUserRepoModule = await import('../repositories/ProfileRepositoryImplement');
      ApiUserRepository = apiUserRepoModule.ProfileRepositoryImplement;
    }
    
    // Tạo repository nếu chưa có
    if(repository === null) {
      repository = new ApiUserRepository(ProfileApi);
    }
  };

  return {
    profile: null,
    isLoading: false,
    isUpdating: false,
    error: null,
  // Business action with loading state and Result pattern
  getProfile: async (): Promise<Result<ProfileEntity, UserError>> => {
    set({ isLoading: true });
      await loadModules();
      if(getProfileUseCase === null) {
        const profileUseCaseModule = await import('../usecase/ProfileUseCase');
        getProfileUseCase = new profileUseCaseModule.ProfileUseCase(repository);
      }
      const profileResult = await getProfileUseCase.getProfile();
      set({ isLoading: false });
      return profileResult;
  },

  updateProfile: async (request: UpdateProfileRequest): Promise<Result<ProfileEntity, UserError>> => {
    set({ isUpdating: true });
    await loadModules();
    if(updateProfileUseCase === null) {
      const profileUseCaseModule = await import('../usecase/ProfileUseCase');
      updateProfileUseCase = new profileUseCaseModule.ProfileUseCase(repository);
    }
    const updateResult = await updateProfileUseCase.updateProfile(request);
    set({ isUpdating: false });
    return updateResult;
  },

  changePassword: async (request: ChangePasswordRequest): Promise<Result<ProfileEntity, UserError>> => {
    set({ isLoading: true });
    await loadModules();
    if(changePasswordUseCase === null) {
      const profileUseCaseModule = await import('../usecase/ProfileUseCase');
      changePasswordUseCase = new profileUseCaseModule.ProfileUseCase(repository);
    }
    const json = await keychainHelper.getObject();
    const changeResult = await changePasswordUseCase.changePassword(request, json?.password);
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

  logout: async () => {
    set({ isLoading: true });
    const json = await keychainHelper.getObject();
    if(json) {
      const userName = json.userName;
      const password = json.password;
      
      const firstName = json.firstName;
      const lastName = json.lastName;
      const avatarUri = json.avatarUri;
      await keychainHelper.reset();
      await keychainHelper.saveObject({userName: userName, password: password, firstName: firstName, lastName: lastName, avatarUri: avatarUri});
    }
    set({ profile: null, isLoading: false });

  },
};
};

export const useUserStore = create<UserState>()(userStoreCreator); 