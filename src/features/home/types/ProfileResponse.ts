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

