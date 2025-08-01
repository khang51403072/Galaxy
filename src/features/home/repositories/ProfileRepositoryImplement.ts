import { ProfileRepository } from './ProfileRepository';
import { ProfileApi } from '../services/ProfileApi';
import { Result, success, failure } from '../../../shared/types/Result';
import { ProfileEntity } from '../types/ProfileResponse';
import { ChangePasswordRequest, UpdateProfileRequest } from '../types/ProfileRequest';
import { UserError } from '../types/UserError';
import { Asset } from 'react-native-image-picker';

export class ProfileRepositoryImplement implements ProfileRepository {
  constructor(private profileApi: typeof ProfileApi) {}

  async getProfile(): Promise<Result<ProfileEntity, UserError>> {
    try {
      const response = await this.profileApi.getProfile();
      return success(response.data as ProfileEntity);
    } catch (error: any) {
      return failure(new UserError(error.message || 'Error getting profile', 'PROFILE_LOAD_ERROR', error));
    }
  }

  async updateProfile(request: UpdateProfileRequest): Promise<Result<ProfileEntity, UserError>> {
    try {
      const response = await this.profileApi.updateProfile(request);
      
      if (!response.result || !response.data) {
        return failure(new UserError(response.errorMsg || 'Failed to update profile', 'PROFILE_UPDATE_ERROR'));
      }

      return success(response.data);
    } catch (error: any) {
      return failure(new UserError(error.message || 'Error updating profile', 'PROFILE_UPDATE_ERROR', error));
    }
  }

  async changePassword(request: ChangePasswordRequest): Promise<Result<void, UserError>> {
    try {
      const response = await this.profileApi.changePassword(request);
      
      if (!response.result) {
        return failure(new UserError(response.errorMsg || 'Failed to change password', 'PASSWORD_CHANGE_ERROR'));
      }

      return success(undefined);
    } catch (error: any) {
      return failure(new UserError(error.message || 'Error changing password', 'PASSWORD_CHANGE_ERROR', error));
    }
  }

  async uploadAvatar(imageData: Asset): Promise<Result<string, UserError>> {
    try {
      const response = await this.profileApi.uploadAvatar(imageData);
      return success(response.data?.avatarUrl || '');
    } catch (error: any) {
      return failure(new UserError(error.message || 'Error uploading avatar', 'AVATAR_UPLOAD_ERROR', error));
    }
  }
} 