import { LoginEntity, RegisterFCMRequest, LogoutMRequest } from '../types/AuthTypes';
import { Result } from '../../../shared/types/Result';
import { AuthError } from '../types/AuthErrors';

export interface AuthRepository {
  login(email: string, password: string): Promise<Result<LoginEntity, AuthError>>;
  registerFCM(request: RegisterFCMRequest): Promise<Result<any, AuthError>>;
  logout(request: LogoutMRequest): Promise<Result<any, AuthError>>;
} 