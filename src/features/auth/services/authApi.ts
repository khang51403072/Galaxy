// features/auth/services/AuthApi.ts
import { httpClient } from '../../../core/network/HttpClient';
import { ApiResponse } from '../../../core/network/ApiResponse';
import { LoginEntity } from '../types/AuthTypes';

type LoginResponse = ApiResponse<LoginEntity>;

export const AuthApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const res = await httpClient.post<LoginResponse>('/galaxy-me/authen', {
        username,
        password,
      });
      return res.data;
    } catch (error: any) {
        throw error;
    }
    
  },

};
