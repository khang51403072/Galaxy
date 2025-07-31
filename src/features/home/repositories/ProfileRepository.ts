import { Result } from '../../../shared/types/Result';
import { ProfileEntity } from '../types/ProfileResponse';
import { ChangePasswordRequest, UpdateProfileRequest } from '../types/ProfileRequest';
import { UserError } from '../types/UserError';

export interface ProfileRepository {
  getProfile(): Promise<Result<ProfileEntity, UserError>>;
  updateProfile(request: UpdateProfileRequest): Promise<Result<ProfileEntity, UserError>>;
  changePassword(request: ChangePasswordRequest): Promise<Result<void, UserError>>;
  uploadAvatar(file: File): Promise<Result<string, UserError>>;
} 