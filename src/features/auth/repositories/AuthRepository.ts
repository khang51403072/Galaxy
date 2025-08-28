import { LoginEntity, RegisterFCMRequest, LogoutMRequest, LoginRequest } from '../types/AuthTypes';
import { Result } from '../../../shared/types/Result';
import { AuthError } from '../types/AuthErrors';

export interface AuthRepository {
  login(request: LoginRequest): Promise<Result<LoginEntity, AuthError>>;
  registerFCM(request: RegisterFCMRequest): Promise<Result<any, AuthError>>;
  logout(request: LogoutMRequest): Promise<Result<any, AuthError>>;
} 