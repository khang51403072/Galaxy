import { httpClient } from '../../../core/network/HttpClient';
import { ApiResponse } from '../../../core/network/ApiResponse';
import { useAuthStore } from '../../auth/stores/authStore';
import { ProfileEntity } from '../types/UserTypes';

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
  updateProfile: async (data: ProfileUpdate): Promise<ProfileUpdateResponse> => {
    try {
      const res = await httpClient.post<ProfileUpdateResponse>('/galaxy-me/profile', {
        "employeeId": useAuthStore.getState().employeeId,
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error.message || 'Không thể cập nhật profile');
    }
  },

  // Change password
  changePassword: async (newPassword: string): Promise<ChangePasswordResponse> => {
    try {
      const res = await httpClient.post<ChangePasswordResponse>('galaxy-me/reset-password', {
        params: {
          employeeId: useAuthStore.getState().employeeId,
          newPassword: newPassword,
        }
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error.message || 'Không thể đổi mật khẩu');
    }
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<AvatarUploadResponse> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const res = await httpClient.post<AvatarUploadResponse>('/galaxy-me/upload-avatar', formData, {
        params: {
          employeeId: useAuthStore.getState().employeeId,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error.message || 'Không thể upload avatar');
    }
  },
}; 