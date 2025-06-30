import { AuthApi } from '../services/AuthApi';
import { ApiAuthRepository } from './ApiAuthRepository';
import { AuthRepository } from './AuthRepository';

// Create repository instance
export const authRepository: AuthRepository = new ApiAuthRepository(AuthApi);

// Export types
export type { AuthRepository } from './AuthRepository';
export { ApiAuthRepository } from './ApiAuthRepository'; 