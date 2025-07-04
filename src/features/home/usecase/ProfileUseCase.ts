import xlog from '../../../core/utils/xlog';
import { ProfileApi, ProfileUpdate } from '../services/ProfileApi';
import { Result, success, failure, isSuccess, isFailure } from '../../../shared/types/Result';
import { ProfileEntity } from '../types/ProfileResponse';
import { UserError } from '../types/UserError';
import { ChangePasswordRequest, UpdateProfileRequest } from '../types/ProfileRequest';
import { ProfileRepository } from '../repositories/ProfileRepository';

export class ProfileUseCase {
  constructor(private userRepository: ProfileRepository) {}

  async getProfile(): Promise<Result<ProfileEntity, UserError>> {
    return await this.userRepository.getProfile();
  }

  async updateProfile(request: UpdateProfileRequest): Promise<Result<ProfileEntity, UserError>> {
    return await this.userRepository.updateProfile(request);
  }

  async changePassword(request: ChangePasswordRequest, oldPassword: string): Promise<Result<void, UserError>> {
    if(oldPassword === request.newPassword) {
      return failure(new UserError('New password is exist', 'NEW_PASSWORD_EXIST'));
    }
    
    return await this.userRepository.changePassword(request);
  }
}

