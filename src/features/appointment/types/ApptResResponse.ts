export interface ApptResResponse {
  result: boolean;
  errorMsg: string;
  errorCode: number;
  data: ApptRes[];
}

export interface ApptRes {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  customerFacingName: string;
  image: string;
  foreColor: string;
  backColor: string;
  apptSortOrder: number;
  timeInfo?: any;
  defaultQueueGroupID: string;
  workHours: WorkHours;
  queueGroupIDS: string[];
  isUnAssignApptHolder: boolean;
  standAloneApptAccess: string;
  isTechAppOwnerMode: boolean;
  isAddToApptBook: boolean;
}

export interface WorkHours {
  isMon: boolean;
  monFromHour: Hour;
  monToHour: Hour;
  isTue: boolean;
  tueFromHour: Hour;
  tueToHour: Hour;
  isWed: boolean;
  wedFromHour: Hour;
  wedToHour: Hour;
  isThu: boolean;
  thuFromHour: Hour;
  thuToHour: Hour;
  isFri: boolean;
  friFromHour: Hour;
  friToHour: Hour;
  isSat: boolean;
  satFromHour: Hour;
  satToHour: Hour;
  isSun: boolean;
  sunFromHour: Hour;
  sunToHour: Hour;
}

export interface Hour {
  hours: number;
  minutes: number;
  nanos: number;
  seconds: number;
} 