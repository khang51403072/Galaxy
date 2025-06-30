import { LoginEntity } from '../types/AuthTypes';
import { Result } from '../../../shared/types/Result';
import { AuthError } from '../types/AuthErrors';

export interface AuthRepository {
  login(email: string, password: string): Promise<Result<LoginEntity, AuthError>>;
  logout(): Promise<Result<void, AuthError>>;
  refreshToken(): Promise<Result<string, AuthError>>;
  validateToken(token: string): Promise<Result<boolean, AuthError>>;
} 