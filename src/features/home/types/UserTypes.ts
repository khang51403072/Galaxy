// Address type - matching Kotlin data class
export interface Address {
  address: string;
  unitNumber: string;
  city: string;
  state: string;
  zip: string;
}

// Profile entity type - matching Kotlin data class
export interface ProfileEntity {
  address: Address | null;
  email: string;
  firstName: string;
  image: string;
  lastName: string;
  nickName: string;
  phone: string;
  storeName: string;
  storeId: string;
  startDate: string | null;
  id: string;
  income: number; // Double in Kotlin = number in TypeScript
  createdAt: string | null;
  createdBy: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
  channels: string;
  vanityUrl: string;
}

// Extension methods for ProfileEntity (equivalent to Kotlin extension functions)
export class ProfileEntityExtensions {
  /**
   * Get display name (equivalent to Kotlin extension function)
   * fun ProfileEntity.getDisplayName(): String { return "$firstName $lastName" }
   */
  static getDisplayName(profile: ProfileEntity): string {
    return `${profile.firstName} ${profile.lastName}`;
  }

  /**
   * Get full address string
   */
  static getFullAddress(profile: ProfileEntity): string {
    if (!profile.address) return 'No address provided';
    
    const { address, unitNumber, city, state, zip } = profile.address;
    return `${address}${unitNumber ? ` Unit ${unitNumber}` : ''}, ${city}, ${state} ${zip}`;
  }

  /**
   * Get initials (e.g., "JD" for "John Doe")
   */
  static getInitials(profile: ProfileEntity): string {
    const first = profile.firstName.charAt(0).toUpperCase();
    const last = profile.lastName.charAt(0).toUpperCase();
    return `${first}${last}`;
  }

  /**
   * Check if user has complete profile
   */
  static hasCompleteProfile(profile: ProfileEntity): boolean {
    return !!(
      profile.email &&
      profile.firstName &&
      profile.lastName &&
      profile.phone &&
      profile.storeName &&
      profile.storeId
    );
  }

  /**
   * Get formatted income
   */
  static getFormattedIncome(profile: ProfileEntity): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(profile.income);
  }

  /**
   * Get store info
   */
  static getStoreInfo(profile: ProfileEntity): string {
    return `${profile.storeName} (${profile.storeId})`;
  }
}

// User type (simplified version for common use)
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nickName: string;
  phone: string;
  image: string;
  storeName: string;
  storeId: string;
  income: number;
  vanityUrl: string;
}

// User creation input type
export interface CreateUserInput {
  email: string;
  firstName: string;
  lastName: string;
  nickName: string;
  phone: string;
  storeName: string;
  storeId: string;
  address?: Address;
  image?: string;
  startDate?: string;
  income?: number;
  channels?: string;
  vanityUrl?: string;
}

// User update input type
export interface UpdateUserInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  nickName?: string;
  phone?: string;
  storeName?: string;
  storeId?: string;
  address?: Address;
  image?: string;
  startDate?: string;
  income?: number;
  channels?: string;
  vanityUrl?: string;
}

// User response type (API response)
export interface UserResponse {
  data: ProfileEntity;
  message?: string;
  success: boolean;
}

// User list response type
export interface UserListResponse {
  data: ProfileEntity[];
  total: number;
  page: number;
  limit: number;
  message?: string;
  success: boolean;
}

// User filter type
export interface UserFilter {
  search?: string;
  storeId?: string;
  startDate?: string;
  endDate?: string;
  minIncome?: number;
  maxIncome?: number;
  page?: number;
  limit?: number;
}

// User sort type
export interface UserSort {
  field: keyof ProfileEntity;
  direction: 'asc' | 'desc';
}

// User statistics type
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  averageIncome: number;
  totalIncome: number;
  usersThisMonth: number;
  usersThisYear: number;
}

// Utility types
export type UserId = string;
export type UserEmail = string;
export type UserPhone = string;

// User status type
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

// User role type
export type UserRole = 'admin' | 'manager' | 'employee' | 'viewer';

// Extended user with status and role
export interface ExtendedUser extends ProfileEntity {
  status: UserStatus;
  role: UserRole;
  lastLoginAt?: string;
  isOnline: boolean;
}

// User preferences type
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisible: boolean;
    incomeVisible: boolean;
    contactVisible: boolean;
  };
}

// Complete user profile with preferences
export interface CompleteUserProfile extends ProfileEntity {
  preferences: UserPreferences;
  status: UserStatus;
  role: UserRole;
  lastLoginAt?: string;
  isOnline: boolean;
  loginCount: number;
  lastActivityAt?: string;
}

// Address utility functions
export class AddressExtensions {
  /**
   * Get formatted address string
   */
  static getFormattedAddress(address: Address): string {
    const { address: streetAddress, unitNumber, city, state, zip } = address;
    return `${streetAddress}${unitNumber ? ` Unit ${unitNumber}` : ''}, ${city}, ${state} ${zip}`;
  }

  /**
   * Get city and state only
   */
  static getCityState(address: Address): string {
    return `${address.city}, ${address.state}`;
  }

  /**
   * Check if address is complete
   */
  static isComplete(address: Address): boolean {
    return !!(address.address && address.city && address.state && address.zip);
  }
} 