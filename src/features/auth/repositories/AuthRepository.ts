import { LoginEntity } from '../types/AuthTypes';
import { Result } from '../../../shared/types/Result';
import { AuthError } from '../types/AuthErrors';

export interface AuthRepository {
  login(email: string, password: string): Promise<Result<LoginEntity, AuthError>>;
} 