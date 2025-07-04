import xlog from '../../../core/utils/xlog';
import { AuthRepository } from '../repositories/AuthRepository';
import { LoginEntity } from '../types/AuthTypes';
import { Result, success, failure, isSuccess, isFailure } from '../../../shared/types/Result';
import { AuthError, InvalidCredentialsError, ValidationError } from '../types/AuthErrors';

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
}

export class AuthUseCase {
  constructor(private authRepository: AuthRepository) {}

  async loginUser(email: string, password: string): Promise<Result<LoginResult, AuthError>> {
    try {
      // Call repository
      const loginResult = await this.authRepository.login(email, password);
      
      // Transform repository result to business result
      if (isSuccess(loginResult)) {
        const loginData = loginResult.value;
        const result: LoginResult = {
          userName: loginData.userName || "",
          token: loginData.token || "",
          password: password || "",
          userId: loginData.userId || "",
          firstName: loginData.firstName || "",
          lastName: loginData.lastName || "",
          employeeId: loginData.employeeId || "",
          isOwner: loginData.isOwner || false
        };


        return success(result);
      } else {
        xlog.error('Login failed', {
          tag: "Auth",
          extra: loginResult.error
        });
        return failure(loginResult.error);
      }
    } catch (error: any) {
      xlog.error('Unexpected login error', {
        tag: "Auth",
        extra: error
      });
      return failure(new AuthError('Unexpected error occurred', 'UNKNOWN_ERROR', error));
    }
  }

  

 
}
