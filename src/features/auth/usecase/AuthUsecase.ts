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
      xlog.info('Login attempt', {
        tag: "Auth",
        extra: { email }
      });

      // // Validate input
      // const validationResult = this.validateLoginInput(email, password);
      // if (isFailure(validationResult)) {
      //   return validationResult;
      // }

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

        xlog.info('Login successful', {
          tag: "Auth",
          extra: { userName: result.userName }
        });

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

  async logoutUser(): Promise<Result<void, AuthError>> {
    try {
      xlog.info('Logout attempt', {
        tag: "Auth"
      });

      const logoutResult = await this.authRepository.logout();
      
      if (isSuccess(logoutResult)) {
        xlog.info('Logout successful', {
          tag: "Auth"
        });
        return success(undefined);
      } else {
        xlog.error('Logout failed', {
          tag: "Auth",
          extra: logoutResult.error
        });
        return failure(logoutResult.error);
      }
    } catch (error: any) {
      xlog.error('Unexpected logout error', {
        tag: "Auth",
        extra: error
      });
      return failure(new AuthError('Unexpected error occurred', 'UNKNOWN_ERROR', error));
    }
  }

  async refreshUserToken(): Promise<Result<string, AuthError>> {
    try {
      xlog.info('Token refresh attempt', {
        tag: "Auth"
      });

      const refreshResult = await this.authRepository.refreshToken();
      
      if (isSuccess(refreshResult)) {
        const newToken = refreshResult.value;
        xlog.info('Token refresh successful', {
          tag: "Auth"
        });
        return success(newToken);
      } else {
        xlog.error('Token refresh failed', {
          tag: "Auth",
          extra: refreshResult.error
        });
        return failure(refreshResult.error);
      }
    } catch (error: any) {
      xlog.error('Unexpected token refresh error', {
        tag: "Auth",
        extra: error
      });
      return failure(new AuthError('Unexpected error occurred', 'UNKNOWN_ERROR', error));
    }
  }

  async validateUserToken(token: string): Promise<Result<boolean, AuthError>> {
    try {
      xlog.info('Token validation attempt', {
        tag: "Auth"
      });

      const validationResult = await this.authRepository.validateToken(token);
      
      if (isSuccess(validationResult)) {
        const isValid = validationResult.value;
        xlog.info('Token validation result', {
          tag: "Auth",
          extra: { isValid }
        });
        return success(isValid);
      } else {
        xlog.error('Token validation failed', {
          tag: "Auth",
          extra: validationResult.error
        });
        return failure(validationResult.error);
      }
    } catch (error: any) {
      xlog.error('Unexpected token validation error', {
        tag: "Auth",
        extra: error
      });
      return failure(new AuthError('Unexpected error occurred', 'UNKNOWN_ERROR', error));
    }
  }

  // Private validation method
  private validateLoginInput(email: string, password: string): Result<void, AuthError> {
    if (!email || !email.trim()) {
      return failure(new ValidationError('Email is required'));
    }

    if (!password || !password.trim()) {
      return failure(new ValidationError('Password is required'));
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return failure(new ValidationError('Invalid email format'));
    }

    // Basic password validation
    if (password.length < 6) {
      return failure(new ValidationError('Password must be at least 6 characters'));
    }

    return success(undefined);
  }
}
