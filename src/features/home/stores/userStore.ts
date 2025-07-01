import { create } from 'zustand/react';
import { StateCreator } from 'zustand/vanilla';
import { Result, isSuccess, isFailure, failure } from '../../../shared/types/Result';
import { ProfileEntity } from '../types/UserTypes';
import { ChangePasswordRequest, UpdateProfileRequest } from '../types/UpdateProfileTypes';
import { UserError } from '../types/UserError';
import { keychainHelper } from '../../../shared/utils/keychainHelper';
export type UserState = {
  profile: ProfileEntity | null;
  isLoading: boolean;
  isUpdating: boolean;
  // Business actions
  getProfile: () => Promise<void>;
  updateProfile: (request: UpdateProfileRequest) => Promise<Result<ProfileEntity, UserError>>;
  changePassword: (request: ChangePasswordRequest) => Promise<Result<void, UserError>>;
};

// Selectors
export const userSelectors = {
  selectProfile: (state: UserState) => state.profile,
  selectIsLoading: (state: UserState) => state.isLoading,
  selectIsUpdating: (state: UserState) => state.isUpdating,
  selectGetProfile: (state: UserState) => state.getProfile,
  selectUpdateProfile: (state: UserState) => state.updateProfile,
  selectChangePassword: (state: UserState) => state.changePassword,
};

const userStoreCreator: StateCreator<UserState> = (set, get) => {
  let repository:any;
  let getProfileUseCase:any;
  let updateProfileUseCase:any;
  let changePasswordUseCase:any;
  return {
    profile: null,
    isLoading: false,
    isUpdating: false,
  
  // Business action with loading state and Result pattern
  getProfile: async (): Promise<void> => {
    set({ isLoading: true });
      
    // Import ProfileUseCase function
    const { getProfile: getProfileUseCase } = await import('../usecase/ProfileUseCase');
    
    if(repository === null) {
      repository = await import('../repositories/ApiUserRepository');
    }
    
    
    const profileResult = await getProfileUseCase(repository);
    
    if (isSuccess(profileResult)) {
      const profile = profileResult.value;
      
      // Update store with profile data
      set({ profile, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  updateProfile: async (request: UpdateProfileRequest): Promise<Result<ProfileEntity, UserError>> => {
    set({ isUpdating: true });
    
    if(repository === null) {
      repository = await import('../repositories/ApiUserRepository');
    }
    if(updateProfileUseCase === null) {
      updateProfileUseCase = await import('../usecase/ProfileUseCase');
    }
    const updateResult = await updateProfileUseCase( request,repository);
    
    if (isSuccess(updateResult)) {
      const updatedProfile = updateResult.value;
      // Update store with new profile data
      set({ profile: updatedProfile as ProfileEntity, isUpdating: false });
    } else {
      set({ isUpdating: false });
    }
    return updateResult;
  },

  changePassword: async (request: ChangePasswordRequest): Promise<Result<void, UserError>> => {
    set({ isLoading: true });
    const json = await keychainHelper.getObject();
    if(json?.password === request.newPassword) {
      set({ isLoading: false });
      return failure(new UserError('New password is exist', 'NEW_PASSWORD_EXIST'));
    }
    if(changePasswordUseCase === null) {
      changePasswordUseCase = await import('../usecase/ProfileUseCase');
    }
    
    const changeResult = await changePasswordUseCase(request,repository);
    set({ isLoading: false });
    return changeResult;
  },
};
};

export const useUserStore = create<UserState>()(userStoreCreator); 