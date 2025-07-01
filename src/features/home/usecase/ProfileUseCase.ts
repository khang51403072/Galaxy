import xlog from '../../../core/utils/xlog';
import { ProfileApi, ProfileUpdate } from '../services/ProfileApi';
import { Result, success, failure } from '../../../shared/types/Result';
import { ProfileEntity } from '../types/UserTypes';
import { UserError } from '../types/UserError';
import { ChangePasswordRequest, UpdateProfileRequest } from '../types/UpdateProfileTypes';
import { UserRepository } from '../repositories/UserRepository';

export async function getProfile(repository: UserRepository): Promise<Result<ProfileEntity, UserError>> {
  return await repository.getProfile();
}

export async function updateProfile(data: UpdateProfileRequest, repository: UserRepository): Promise<Result<ProfileEntity, UserError>> {
  return repository.updateProfile(data);
}


export async function changePassword(request: ChangePasswordRequest, repository: UserRepository): Promise<Result<void, UserError>> {
  return repository.changePassword(request);
}

