export interface ApptPayload {
  id: string;
  apptDate: string;
  retentionType: string;
  isPreBooking: boolean;
  isOnlineConfirm: boolean;
  isGroupAppt: boolean;
  apptStatus: string;
  apptConfirmStatus: string;
  apptServiceItems: ApptServiceItem[];
  apptServicePackages: ApptPackageItem[];
  customer: CustomerAppt;
  customerNote: string;
  createdTechnician: CreatedTechnician;
  updatedTechnician?: any;
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
  apptServicePackageFilter: string;
  position: number;
}

export interface StartTime {
  hours: number;
  minutes: number;
  seconds: number;
  nanos: number;
}

export interface CreatedTechnician {
  id: string;
  name: string;
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

export interface ApptSaveResponse {
  result: boolean;
  errorMsg: string;
  data: DataAppt;
  validateApptResponse?: ValidateApptResponse;
}

export interface DataAppt {
  // ... define as needed
}

export interface ValidateApptResponse {
  errorMsg: string;
  isNoConflict: boolean;
  allowBookAnyway: boolean;
  conflictItems: ConflictItem[];
  errorMsgs: string[];
  appointment: DataAppt;
}

export interface ConflictItem {
  apptID: string;
  isBlock: boolean;
  // ... define as needed
}

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string;
} 