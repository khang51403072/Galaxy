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

export interface ApptServiceItem {
  id: string;
  name: string;
  duration: number;
  startTime: TimeInfo;
  price: number;
  employeeId: string;
  note: string;
  foreColor: string;
  backColor: string;
  position: number;
  userInfo: UserInfo;
  apptServicePackageFilter: string;
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


// Helper functions for DataAppt
export const createDataAppt = (data: Partial<DataAppt>): DataAppt => {
  return {
    isAllowUnAsignAppt: false,
    captchaToken: '',
    apptType: 'Regular',
    isBlock: false,
    blockStart: { hours: 0, minutes: 0, nanos: 0, seconds: 0 },
    blockEnd: { hours: 0, minutes: 0, nanos: 0, seconds: 0 },
    blockEmployeeId: '',
    apptDate: '',
    startTime: '',
    customer: {
      id: '',
      fullName: '',
      firstName: '',
      lastName: '',
      email: '',
      cellPhone: '',
    },
    customerNote: '',
    retentionType: 'Request',
    isPreBooking: false,
    isOnlineConfirm: false,
    isOnlineBooking: false,
    isGroupAppt: false,
    groupApptColor: '',
    refererOption: 'None',
    apptServiceItems: [],
    apptServicePackages: [],
    apppointmentCategories: [],
    apptStatus: 'New',
    apptConfirmStatus: 'None',
    customerResponseStatus: 'None',
    ticketNumber: 0,
    ticketId: '',
    createdTechnician: { id: '', name: '' },
    updatedTechnician: { id: '', name: '' },
    deletedTechnician: { id: '', name: '' },
    type: 'Appointment',
    deposit: {
      preDepositAmount: 0,
      depositTransId: '',
      paymentCardNumber: '',
      expirationDate: '',
      paymentCvcCode: '',
      isReturn: false,
    },
    runLogId: '',
    isImport: false,
    waitingId: '',
    createdBy: '',
    updatedBy: '',
    id: '',
    isDeleted: false,
    channels: '',
    uid: [],
    createdAt: '',
    updatedAt: '',
    ...data,
  };
};

