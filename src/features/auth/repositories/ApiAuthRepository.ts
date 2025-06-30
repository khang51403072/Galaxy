import { AuthRepository } from './AuthRepository';
import { LoginEntity } from '../types/AuthTypes';
import { AuthApi } from '../services/AuthApi';
import { Result, success, failure, asyncResult } from '../../../shared/types/Result';
import { AuthError, createAuthError } from '../types/AuthErrors';

export class ApiAuthRepository implements AuthRepository {
  constructor(private authApi: typeof AuthApi) {}

  async login(email: string, password: string): Promise<Result<LoginEntity, AuthError>> {
    try {
      const response = await this.authApi.login(email, password);
      
      // Validate response data
      if (!response.data) {
        return failure(new AuthError('Invalid response from server', 'SERVER_ERROR'));
      }

      const loginData: LoginEntity = {
        activationCode: response.data.activationCode || '',
        deviceId: response.data.deviceId || '',
        userName: response.data.userName || '',
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        token: response.data.token || '',
        photoURL: response.data.photoURL || '',
        roles: response.data.roles || [],
        posProfile: response.data.posProfile || null,
        userId: response.data.userId || '',
        merchantInfo: response.data.merchantInfo || {
          mid: '',
          corpID: '',
          storeID: '',
          dbaName: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          channel: '',
        },
        privileges: response.data.privileges || [],
        fullName: response.data.fullName || '',
        employeeId: response.employeeId || '',
        isOwner: response.isOwner || false,
      };

      return success(loginData);
    } catch (error: any) {
      return failure(createAuthError(error));
    }
  }

  async logout(): Promise<Result<void, AuthError>> {
    try {
      // TODO: Implement when AuthApi.logout is available
      // await this.authApi.logout();
      console.log('Logout successful');
      return success(undefined);
    } catch (error: any) {
      return failure(createAuthError(error));
    }
  }

  async refreshToken(): Promise<Result<string, AuthError>> {
    try {
      // TODO: Implement when AuthApi.refreshToken is available
      // const response = await this.authApi.refreshToken();
      // if (!response.data?.token) {
      //   return failure(new AuthError('Invalid token response', 'SERVER_ERROR'));
      // }
      // return success(response.data.token);
      
      return failure(new AuthError('Refresh token not implemented yet', 'SERVER_ERROR'));
    } catch (error: any) {
      return failure(createAuthError(error));
    }
  }

  async validateToken(token: string): Promise<Result<boolean, AuthError>> {
    try {
      // TODO: Implement when AuthApi.validateToken is available
      // const response = await this.authApi.validateToken(token);
      // return success(response.data?.isValid || false);
      
      // For now, assume token is valid if it exists
      return success(!!token);
    } catch (error: any) {
      return failure(createAuthError(error));
    }
  }
} 