// features/auth/services/AuthApi.ts
import { httpClient } from '../../../core/network/HttpClient';
import { ApiResponse } from '../../../core/network/ApiResponse';
import { LoginEntity, LogoutMRequest, RegisterFCMRequest } from '../types/AuthTypes';
import { API_ENDPOINTS } from '../../../core/network/endpoints';

type LoginResponse = ApiResponse<LoginEntity>;

type RegisterResponse = ApiResponse<any>;
export const AuthApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const res = await httpClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
        username,
        password,
      });
      return res.data;
    } catch (error: any) {
        throw error;
    }
    
  },

  registerFCM: async (request: RegisterFCMRequest): Promise<RegisterResponse> => {
    try {
      const res = await httpClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER_FCM, request);
      return res.data;
    } catch (error: any) {
        throw error;
    }
    
  },


  logout: async (request: LogoutMRequest): Promise<RegisterResponse> => {
    try {
      const res = await httpClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.LOGOUT, request);
      return res.data;
    } catch (error: any) {
        throw error;
    }
    
  },

};
