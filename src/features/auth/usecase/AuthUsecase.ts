import xlog from '../../../core/utils/xlog';
import { AuthRepository } from '../repositories/AuthRepository';
import { LoginEntity, RegisterFCMRequest, LogoutMRequest, LoginRequest, MerchantInfo } from '../types/AuthTypes';
import { Result, success, failure, isSuccess } from '../../../shared/types/Result';
import { AuthError } from '../types/AuthErrors';

// Define return type for login
export interface LoginResult {
  userName: string;
  token: string;
  password: string;
  userId: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  isOwner: boolean;
  listRole: string[];
  isShowPhone: boolean;
  switchableStores: StoreItemEntity [];
  selectedStore?: StoreItemEntity;
  merchantInfo: MerchantInfo;
  fullNameDefault?: string //show in login screen
}

export interface StoreItemEntity  {
  storeId: string;
  storeName: string;
  storeLogo?: string; 
  address: string;
  corporateId: string;
  employeeId: string;
  empUser: string;
  empPassword?: string;
  empPhone?: string;

  // Các trường có thể không tồn tại
  masterStoreId?: string;
  masterStoreName?: string;
  masterEmployeeId?: string;
  empPOSPassword?: string;
}
export class AuthUseCase {
  constructor(private authRepository: AuthRepository) {}
  getUserName = (email: string) => email.split('@')[0];

  async loginUser(request: LoginRequest): Promise<Result<LoginResult, AuthError>> {
    try {
      const loginResult = await this.authRepository.login(request);
      if (isSuccess(loginResult)) {
        const loginData = loginResult.value;
        const result: LoginResult = {
          userName: this.getUserName(loginData.userName) || "",
          token: loginData.token || "",
          password: request.password || "",
          userId: loginData.userId || "",
          firstName: loginData.firstName || "",
          lastName: loginData.lastName || "",
          employeeId: loginData.employeeId || "",
          isOwner: loginData.isOwner || false,
          listRole: loginData.listRole || [],
          isShowPhone: loginData.isShowPhone || false,
          switchableStores: loginData.switchableStores || [],
          merchantInfo: loginData.merchantInfo
        };
        return success(result);
      } else {
        xlog.error('Login failed', { tag: "Auth", extra: loginResult.error });
        return failure(loginResult.error);
      }
    } catch (error: any) {
      xlog.error('Unexpected login error', { tag: "Auth", extra: error });
      return failure(new AuthError('Unexpected error occurred', 'UNKNOWN_ERROR', error));
    }
  }

  async registerFCM(request: RegisterFCMRequest): Promise<Result<any, AuthError>> {
    try {
      const resultRepo = await this.authRepository.registerFCM(request);
      if (isSuccess(resultRepo)) {
        const loginData = resultRepo.value;
       
        return success(loginData);
      } else {
        xlog.error('RegisterFCM failed', { tag: "Auth", extra: resultRepo.error });
        return failure(resultRepo.error);
      }
    } catch (error: any) {
      xlog.error('Unexpected registerFCM error', { tag: "Auth", extra: error });
      return failure(new AuthError('Unexpected error occurred', 'UNKNOWN_ERROR', error));
    }
  }

  async logout(request: LogoutMRequest): Promise<Result<any, AuthError>> {
    try {
      const resultRepo = await this.authRepository.logout(request);
      if (isSuccess(resultRepo)) {
        const loginData = resultRepo.value;
       
        return success(loginData);
      } else {
        xlog.error('Logout failed', { tag: "Auth", extra: resultRepo.error });
        return failure(resultRepo.error);
      }
    } catch (error: any) {
      xlog.error('Unexpected logout error', { tag: "Auth", extra: error });
      return failure(new AuthError('Unexpected error occurred', 'UNKNOWN_ERROR', error));
    }
  }
}
