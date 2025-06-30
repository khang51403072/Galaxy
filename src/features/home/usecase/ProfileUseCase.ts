import xlog from '../../../core/utils/xlog';
import { ProfileApi, ProfileUpdate } from '../services/ProfileApi';
import { Result, success, failure } from '../../../shared/types/Result';
import { ProfileEntity } from '../types/UserTypes';
import { UserError } from '../types/UserError';

export async function getProfile(): Promise<Result<ProfileEntity, UserError>> {
  try {
    const res = await ProfileApi.getProfile();
    xlog.info('Profile data loaded', {
      tag: "Profile",
      extra: res?.data
    });
    
    // Return profile data if available, otherwise return failure
    if (!res?.data) {
      return failure(new UserError('Profile data not found', 'PROFILE_NOT_FOUND'));
    }
    
    return success(res.data);
  } catch (error) {
    xlog.error('Error loading profile', {
      tag: "Profile",
      extra: error
    });
    return failure(new UserError('Error loading profile', 'PROFILE_LOAD_ERROR', error));
  }
}

export async function updateProfile(data: ProfileUpdate): Promise<Result<void, UserError>> {
  try {
    await ProfileApi.updateProfile(data);
    xlog.info('Profile updated successfully', {
      tag: "Profile",
      extra: data
    });
    return success(undefined);
  } catch (error) {
    xlog.error('Error updating profile', {
      tag: "Profile",
      extra: error
    });
    return failure(new UserError('Error updating profile', 'PROFILE_UPDATE_ERROR', error));
  }
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<Result<void, UserError>> {
  try {
    await ProfileApi.changePassword(newPassword);
    xlog.info('Password changed successfully', {
      tag: "Profile",
      extra: { oldPassword: '***', newPassword: '***' }
    });
    return success(undefined);
  } catch (error) {
    xlog.error('Error changing password', {
      tag: "Profile",
      extra: error
    });
    return failure(new UserError('Error changing password', 'PASSWORD_CHANGE_ERROR', error));
  }
}

export async function uploadAvatar(file: File): Promise<Result<string, UserError>> {
  try {
    const res = await ProfileApi.uploadAvatar(file);
    xlog.info('Avatar uploaded successfully', {
      tag: "Profile",
      extra: { avatarUrl: res.data?.avatarUrl }
    });
    
    const avatarUrl = res.data?.avatarUrl || '';
    return success(avatarUrl);
  } catch (error) {
    xlog.error('Error uploading avatar', {
      tag: "Profile",
      extra: error
    });
    return failure(new UserError('Error uploading avatar', 'AVATAR_UPLOAD_ERROR', error));
  }
} 