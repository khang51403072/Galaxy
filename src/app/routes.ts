// Định nghĩa route name chuẩn cho toàn app
import { ProfileEntity } from "../features/home/types/ProfileResponse";

export const ROUTES = {
    SPLASH: 'Splash',
    LOGIN: 'Login',
    HOME: 'Home',
    PROFILE: 'Profile',
    UPDATE_PROFILE: 'UpdateProfile',
    CHANGE_PASSWORD: 'ChangePassword',
    NOTIFICATIONS: 'Notifications',
    TICKET: 'Ticket',
    PAYROLL: 'Payroll',
    REPORT: 'Report',
    APPOINTMENT: 'Appointment',
    CREATE_APPOINTMENT: 'CreateAppointment',
    SELECT_CUSTOMER: 'SelectCustomer',
    SELECT_SERVICE:'SelectService'
    // Thêm các route khác ở đây
  } as const;
  
  export type RouteName = typeof ROUTES[keyof typeof ROUTES];
  
  // Type-safe cho params từng route
  export type RootStackParamList = {
    [ROUTES.SPLASH]: undefined;
    [ROUTES.LOGIN]: undefined;
    [ROUTES.HOME]: { updatedProfile?: ProfileEntity };
    [ROUTES.PROFILE]: { updatedProfile?: ProfileEntity, showBiometricTooltip?: boolean };
    [ROUTES.UPDATE_PROFILE]: { profileId?: string };
    [ROUTES.CHANGE_PASSWORD]: { profileId?: string };
    [ROUTES.TICKET]: undefined;
    [ROUTES.PAYROLL]: undefined;
    [ROUTES.REPORT]: undefined;
    [ROUTES.APPOINTMENT]: undefined;
    [ROUTES.CREATE_APPOINTMENT]: undefined;
    [ROUTES.SELECT_CUSTOMER]: undefined;
    [ROUTES.NOTIFICATIONS]: undefined;
    [ROUTES.SELECT_SERVICE]: undefined;
    // Thêm params cho các route khác nếu cần
  };
  