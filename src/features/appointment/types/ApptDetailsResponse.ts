import { CustomerEntity } from "./CustomerResponse";

export interface ApptDetailsResponse {
  result: boolean;
  errorMsg: string;
  errorCode: number;
  data: ApptDetail;
}

export interface ApptDetail {
  isAllowUnAsignAppt: boolean;
  captchaToken: string;
  apptType: string;
  isBlock: boolean;
  blockStart: BlockEnd;
  blockEnd: BlockEnd;
  blockEmployeeID: string;
  apptDate: string;
  startTime: string;
  customer: CustomerEntity;
  customerNote: string;
  retentionType: string;
  isPreBooking: boolean;
  isOnlineConfirm: boolean;
  isOnlineBooking: boolean;
  isGroupAppt: boolean;
  groupApptColor: string;
  refererOption: string;
  apptServiceItems: ApptServiceItem[];
  apptServicePackages: ApptServicePackage[];
  apppointmentCategories: ApppointmentCategory[];
  apptStatus: string;
  apptConfirmStatus: string;
  customerResponseStatus: string;
  ticketNumber: number;
  ticketID: string;
  createdTechnician: TedTechnician;
  updatedTechnician: TedTechnician;
  deletedTechnician: TedTechnician;
  type: string;
  deposit: Deposit;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  id: string;
  isDeleted: boolean;
  channels: string;
  uid: string[];
}

export interface BlockEnd {
  hours: number;
  minutes: number;
  nanos: number;
  seconds: number;
}

export interface ApptServiceItem {
  id: string;
  name: string;
  employeeId: string;
  duration: number;
  note: string;
  position: number;
  startTime: BlockEnd;
}

export interface ApptServicePackage {
  id: string;
  name: string;
  apptServiceItems: ApptServiceItem[];
  position: number;
  price: number;
  duration: number;
  apptServicePackageFilter: string;
}

export interface ApppointmentCategory {
  id: string;
  name: string;
  employeeID: string;
  duration: number;
  note: string;
  position: number;
  startTime: BlockEnd;
}

export interface TedTechnician {
  id: string;
  name: string;
}

export interface Deposit {
  preDepositAmount: number;
  depositTransID: string;
  paymentCardNumber: string;
  expirationDate: string;
  paymentCvcCode: string;
  isReturn: boolean;
} 