import xlog from '../../../core/utils/xlog';
import { ProfileApi, ProfileUpdate } from '../services/ProfileApi';
import { Result, success, failure, isSuccess, isFailure } from '../../../shared/types/Result';
import { ProfileEntity } from '../types/ProfileResponse';
import { UserError } from '../types/UserError';
import { ChangePasswordRequest, UpdateProfileRequest } from '../types/ProfileRequest';
import { ProfileRepository } from '../repositories/ProfileRepository';
import { appConfig } from '@/shared/utils/appConfig';

export class ProfileUseCase {
  constructor(private userRepository: ProfileRepository) {}

  async getProfile(): Promise<Result<ProfileEntity, UserError>> {
    return await this.userRepository.getProfile();
  }

  async updateProfile(request: UpdateProfileRequest): Promise<Result<ProfileEntity, UserError>> {
    return await this.userRepository.updateProfile(request);
  }

  async changePassword(request: ChangePasswordRequest, oldPassword: string): Promise<Result<void, UserError>> {
    const json = await appConfig.getUser();
    if(json?.password === request.newPassword) {
      return failure(new UserError('New password is exist', 'NEW_PASSWORD_EXIST'));
    }
    if(oldPassword !== request.oldPassword) {
      return failure(new UserError('Old password is incorrect', 'OLD_PASSWORD_INCORRECT'));
    }
    
    return await this.userRepository.changePassword(request);
  }

  async uploadAvatar(file: File): Promise<Result<string, UserError>> {
    return await this.userRepository.uploadAvatar(file);
  }
}

