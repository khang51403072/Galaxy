import { AuthRepository } from './AuthRepository';
import { LoginEntity, RegisterFCMRequest, LogoutMRequest } from '../types/AuthTypes';
import { AuthApi } from '../services/AuthApi';
import { Result, success, failure } from '../../../shared/types/Result';
import { AuthError, createAuthError } from '../types/AuthErrors';

export class ApiAuthRepository implements AuthRepository {
  constructor(private authApi: typeof AuthApi) {}

  async login(email: string, password: string): Promise<Result<LoginEntity, AuthError>> {
    try {
      const response = await this.authApi.login(email, password);
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

  async registerFCM(request: RegisterFCMRequest): Promise<Result<any, AuthError>> {
    try {
      const response = await this.authApi.registerFCM(request);
      if (response == null) {
        return failure(new AuthError('No response from server', 'SERVER_ERROR'));
      }
      return success(response);
    } catch (error: any) {
      return failure(createAuthError(error));
    }
  }

  async logout(request: LogoutMRequest): Promise<Result<any, AuthError>> {
    try {
      const response = await this.authApi.logout(request);
      if (response == null) {
        return failure(new AuthError('No response from server', 'SERVER_ERROR'));
      }
      return success(response);
    } catch (error: any) {
      return failure(createAuthError(error));
    }
  }
} 