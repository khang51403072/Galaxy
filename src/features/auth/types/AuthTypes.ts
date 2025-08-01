import { Platform } from "react-native";
export enum Permissions {
  VIEW_PROFILE = 'VIEW_PROFILE',
  EDIT_PROFILE = 'EDIT_PROFILE',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  VIEW_HOME = 'VIEW_HOME',
  MAKE_APPOINTMENTS = "MAKE_APPOINTMENTS",
  MOVE_APPOINTMENT = "MOVE_APPOINTMENT",
}
export type LoginInput = {
    email: string;
    password: string;
  };

  export interface LoginRequest {
    userName: string;
    password: string;
    deviceId?: string;
    [key: string]: any; // mở rộng nếu cần
  }

  export interface MerchantInfo {
    mid: string;
    corpID: string;
    storeID: string;
    dbaName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    channel: string;
  }

  export interface LoginEntity {
    employeeId: string,
    isOwner: boolean,
    activationCode: string;
    deviceId: string;
    userName: string;
    firstName: string;
    lastName: string;
    token: string;
    photoURL: string;
    roles: string[];
    posProfile?: any | null;
    userId: string;
    merchantInfo: MerchantInfo;
    privileges: any[];
    fullName: string;
    listRole: string[];
    isShowPhone: boolean;
  }


  export interface RegisterFCMRequest{
    deviceId: string,
    deviceToken: string
    platform: string
  }
  export interface LogoutMRequest{
    deviceId: string,
    employeeId: string
  }