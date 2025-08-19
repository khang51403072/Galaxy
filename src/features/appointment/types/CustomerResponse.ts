import { getDisplayName } from "./AppointmentResponse";

export interface CustomerPayload {
  pageNumber: number;
  pageSize: number;
  phoneNumber: string;
}

export interface CustomerSavePayload {
  firstName: string;
  lastName?: string;
  fullName: string;
  id: string;
  email?: string;
  cellPhone: string;
  gender?: string;
  dobMonth?: number;
  dobDay?: number;
  notes?: string;
}

export interface CustomerResponse {
  result: boolean;
  errorMsg: string;
  dataSource: CustomerEntity[];
  totalRecord: number;
}

export interface CustomerEntity {
  idNumber: number;
  loyaltyProgramID: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  cellPhone: string;
  otherPhone: string;
  birthday: string;
  dobMonth: number;
  dobDay: number;
  firstVisit: string;
  lastVisit: string;
  isEmailUnsubscribe: boolean;
  isSMSUnsubscribe: boolean;
  isUndeliverable: boolean;
  rating: number;
  lastSurveyVisitCount: number;
  totalSpent: number;
  visitCount: number;
  pointsBalance: number;
  pointsEarned: number;
  pointsRedeemed: number;
  lastUsedPoints: number;
  apptNoShowCount: number;
  apptCancelCount: number;
  notes: string;
  isActive: boolean;
  isEmail: boolean;
  isCellPhone: boolean;
  isReminderSMS: boolean;
  isReminderEmail: boolean;
  id: string;
}

export interface CustomerSaveResponse {
  result: boolean;
  errorMsg: string;
  isCreateNew: boolean;
  data: CustomerSaveData;
}

export interface CustomerSaveData {
  loyaltyProgramID: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  cellPhone: string;
  otherPhone: string;
  birthday: string;
  dobMonth: number;
  dobDay: number;
  firstVisit?: string;
  lastVisit?: string;
  isEmailUnsubscribe: boolean;
  isSMSUnsubscribe: boolean;
  isUndeliverable: boolean;
  rating: number;
  lastSurveyVisitCount: number;
  totalSpent: number;
  visitCount: number;
  pointsBalance: number;
  pointsEarned: number;
  pointsRedeemed: number;
  lastUsedPoints: number;
  apptNoShowCount: number;
  apptCancelCount: number;
  notes: string;
  isActive: boolean;
  isEmail: boolean;
  isCellPhone: boolean;
  isReminderSMS: boolean;
  isReminderEmail: boolean;
  customerGroups: any[];
  rollUpAvgRating: number;
  type: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  id: string;
  isDeleted: boolean;
  channels: string;
  uid: string[];
} 

