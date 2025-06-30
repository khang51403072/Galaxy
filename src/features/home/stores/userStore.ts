import { create } from 'zustand/react';
import { StateCreator } from 'zustand/vanilla';
import { Result, isSuccess, isFailure } from '../../../shared/types/Result';
import { AuthError } from '../../auth/types/AuthErrors';
import { ProfileEntity } from '../types/UserTypes';
import { ROUTES } from '@/app/routes';
import { useNavigation } from '@react-navigation/native';
export type UserState = {
  profile: ProfileEntity | null;
  isLoading: boolean;
  // Business actions
  getProfile: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  // Callbacks for UI
  onGetProfileSuccess?: (profile: ProfileEntity) => void;
  onGetProfileError?: (error: string) => void;
  onChangePasswordSuccess?: () => void;
  onChangePasswordError?: (error: string) => void;
};

const userStoreCreator: StateCreator<UserState> = (set, get) => ({
  profile: null,
  isLoading: false,
  navigation: useNavigation(),
  // Business action with loading state and Result pattern
  getProfile: async (): Promise<void> => {
    try {
      set({ isLoading: true });
      
      // Import ProfileUseCase function
      const { getProfile: getProfileUseCase } = await import('../usecase/ProfileUseCase');
      
      const profileResult = await getProfileUseCase();
      
      if (isSuccess(profileResult)) {
        const profile = profileResult.value;
        
        // Update store with profile data
        set({ profile, isLoading: false });
        
        // Call success callback
        get().onGetProfileSuccess?.(profile);
      } else {
        // Call error callback
        get().onGetProfileError?.(profileResult.error.message);
        throw profileResult.error;
      }
    } catch (error: any) {
      const authError = error instanceof AuthError ? error : new AuthError('Unexpected error occurred', 'UNKNOWN_ERROR', error);
      
      // Call error callback
      get().onGetProfileError?.(authError.message);
      throw authError;
    } finally {
      set({ isLoading: false });
    }
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    try {
      set({ isLoading: true });
      
      // Import ProfileUseCase function
      const { changePassword: changePasswordUseCase } = await import('../usecase/ProfileUseCase');
      
      const changeResult = await changePasswordUseCase(oldPassword, newPassword);
      
      if (isSuccess(changeResult)) {
        // Call success callback
        get().onChangePasswordSuccess?.();
      } else {
        // Call error callback
        get().onChangePasswordError?.(changeResult.error.message);
        throw changeResult.error;
      }
    } catch (error: any) {
      const authError = error instanceof AuthError ? error : new AuthError('Unexpected error occurred', 'UNKNOWN_ERROR', error);
      
      // Call error callback
      get().onChangePasswordError?.(authError.message);
      throw authError;
    } finally {
      set({ isLoading: false });
    }
  },
  onGoToUpdateProfile: () => {
   
  },
});

export const useUserStore = create<UserState>()(userStoreCreator); 