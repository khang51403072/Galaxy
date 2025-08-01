import { httpClient } from '../../../core/network/HttpClient';
import { ApiResponse } from '../../../core/network/ApiResponse';
import { useAuthStore } from '../../auth/stores/authStore';
import { ProfileEntity } from '../types/ProfileResponse';
import { ChangePasswordRequest, UpdateProfileRequest } from '../types/ProfileRequest';
import xlog from '../../../core/utils/xlog';
import { appConfig } from '@/shared/utils/appConfig';
import { Asset } from 'react-native-image-picker';

// ===== TYPES =====

export interface ProfileUpdate {
  name?: string;
  email?: string;
  phone?: string;
}


// ===== API RESPONSES =====
type ProfileResponse = ApiResponse<ProfileEntity>;
type ProfileUpdateResponse = ApiResponse<void>;
type ChangePasswordResponse = ApiResponse<void>;
type AvatarUploadResponse = ApiResponse<{ avatarUrl: string }>;

// ===== PROFILE API =====
export const ProfileApi = {
  // Get user profile
  getProfile: async (): Promise<ProfileResponse> => {
    try {
      const res = await httpClient.post<ProfileResponse>('/galaxy-me/profile', {
          employeeId: useAuthStore.getState().employeeId,    
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error.message || 'Không thể tải thông tin profile');
    }
  },

  // Update profile information
  updateProfile: async (request: UpdateProfileRequest): Promise<ProfileResponse> => {
    try {
      const res = await httpClient.post<ProfileResponse>('/galaxy-me/save-profile', request);
      return res.data;
    } catch (error: any) {
      throw new Error(error.message || 'Không thể cập nhật profile');
    }
  },
  uploadAvatar: async (imageData: Asset): Promise<AvatarUploadResponse> => {
    try {
      const boundary = `Boundary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const filename = `avatar_${Date.now()}.jpg`;
      const json = await appConfig.getUser();
      const formData = new FormData();
      formData.append('file', {
        uri: imageData.uri,
        type: 'image/jpeg',
        name: filename,
      } as any);
      const res = await httpClient.post<AvatarUploadResponse>('/galaxy-me/upload-avatar/'+json?.employeeId, formData,{
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
        },
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error.message || 'Không thể tải thông tin profile');
    }
  },


  // Change password
  changePassword: async (request: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    try {
      const res = await httpClient.post<ChangePasswordResponse>('/galaxy-me/reset-password', request);
      return res.data;
    } catch (error: any) {
      xlog.error(`changePassword: ${error.message}`, { tag: 'HTTP', extra: error });
      throw error;
    }
  },

  
}; 