export interface ApptPayload {
  id: string;
  apptDate: string;
  retentionType: string;
  isOnlineConfirm: boolean;
  isGroupAppt: boolean;
  apptStatus: string;
  apptConfirmStatus: string;
  apptServiceItems: ApptServiceItem[];
  apptServicePackages: ApptPackageItem[];
  customer: CustomerAppt;
  customerNote: string;
  allowBookAnyway: boolean;
}

export interface ApptServiceItem {
  id: string;
  name: string;
  duration: number;
  startTime: StartTime;
  price: number;
  employeeId: string;
  note: string;
  userInfo?: UserInfo;
  apptServicePackageId: string;
  apptServicePackageName: string;
  apptServicePackageFilter?: string;
  position: number;
  foreColor?: string;
  backColor?: string;
}

export interface StartTime {
  hours: number;
  minutes: number;
  seconds: number;
  nanos: number;
}

export interface CustomerAppt {
  firstName: string;
  lastName: string;
  fullName: string;
  id: string;
  email: string;
  cellPhone: string;
}

export interface ApptPackageItem {
  id: string;
  apptServicePackageFilter: string;
  name: string;
  price: number;
  duration: number;
  apptServiceItems: ApptServiceItem[];
}
///////////////////////////RESPONSE
export interface ApptSaveResponse {
  result: boolean;
  errorMsg: string;
  data: DataAppt;
  validateApptResponse?: ValidateApptResponse;
}

export interface ValidateApptResponse {
  errorMsg: string;
  isNoConflict: boolean;
  allowBookAnyway: boolean;
  conflictItems: ConflictItem[];
  errorMsgs: string[];
}

export interface ConflictItem {
  apptID: string;
  isBlock: boolean;
  // ... define as needed
}

export interface DataAppt {
  // Basic appointment properties
  isAllowUnAsignAppt: boolean;
  captchaToken: string;
  apptType: string;
  isBlock: boolean;
  blockStart: TimeInfo;
  blockEnd: TimeInfo;
  blockEmployeeId: string;
  apptDate: string;
  startTime: string;
  customer: Customer;
  customerNote: string;
  retentionType: string;
  
  // Booking flags
  isPreBooking: boolean;
  isOnlineConfirm: boolean;
  isOnlineBooking: boolean;
  isGroupAppt: boolean;
  
  // Group and referral
  groupApptColor: string;
  refererOption: string;
  
  // Service items and packages
  apptServiceItems: ApptServiceItem[];
  apptServicePackages: any[];
  apppointmentCategories: any[];
  
  // Status information
  apptStatus: string;
  apptConfirmStatus: string;
  customerResponseStatus: string;
  
  // Ticket information
  ticketNumber: number;
  ticketId: string;
  
  // Technician information
  createdTechnician: TedTechnician;
  updatedTechnician: TedTechnician;
  deletedTechnician: TedTechnician;
  
  // Type and deposit
  type: string;
  deposit: Deposit;
  
  // Additional fields
  runLogId: string;
  isImport: boolean;
  waitingId: string;
  createdBy: string;
  updatedBy: string;
  id: string;
  isDeleted: boolean;
  channels: string;
  uid: any[];
  createdAt: string;
  updatedAt: string;
}

export interface TimeInfo {
  hours: number;
  minutes: number;
  nanos: number;
  seconds: number;
}

export interface Customer {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  cellPhone: string;
}


export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string;
}

export interface TedTechnician {
  id: string;
  name: string;
}

export interface Deposit {
  preDepositAmount: number;
  depositTransId: string;
  paymentCardNumber: string;
  expirationDate: string;
  paymentCvcCode: string;
  isReturn: boolean;
}

