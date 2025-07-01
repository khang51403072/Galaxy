import { Address } from './UserTypes';

export interface UpdateProfileRequest {
  employeeId: string;
  image?: string | null;
  fullName?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: Address | null;
} 

export interface ChangePasswordRequest {
  employeeId: string;
  newPassword: string;
}