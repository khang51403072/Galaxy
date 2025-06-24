// features/auth/services/AuthApi.ts
import { httpClient } from '../../../core/network/HttpClient';
import { ApiResponse } from '../../../core/network/ApiResponse';
import { LoginEntity } from '../types/AuthTypes';
import { useAuthStore } from '../../auth/stores/authStore';

type LoginResponse = ApiResponse<LoginEntity>;

export const HomeApi = {
  getProfile: async (): Promise<LoginResponse> => {
    try {
      const res = await httpClient.post<LoginResponse>('/galaxy-me/profile', {
        employeeId: useAuthStore.getState().employeeId,        
      });
      return res.data;
    } catch (error: any) {
        throw new Error(error.message || 'Đăng nhập thất bại');
    }
    
  },

};
