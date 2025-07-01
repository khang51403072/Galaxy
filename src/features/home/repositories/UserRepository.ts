import { Result } from '../../../shared/types/Result';
import { ProfileEntity } from '../types/UserTypes';
import { ChangePasswordRequest, UpdateProfileRequest } from '../types/UpdateProfileTypes';
import { UserError } from '../types/UserError';

export interface UserRepository {
  getProfile(): Promise<Result<ProfileEntity, UserError>>;
  updateProfile(request: UpdateProfileRequest): Promise<Result<ProfileEntity, UserError>>;
  changePassword(request: ChangePasswordRequest): Promise<Result<void, UserError>>;

} 