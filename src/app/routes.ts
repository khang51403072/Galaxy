// Định nghĩa route name chuẩn cho toàn app
import { ProfileEntity } from "../features/home/types/UserTypes";

export const ROUTES = {
    LOGIN: 'Login',
    HOME: 'Home',
    PROFILE: 'Profile',
    UPDATE_PROFILE: 'UpdateProfile',
    CHANGE_PASSWORD: 'ChangePassword',
    // Thêm các route khác ở đây
  } as const;
  
  export type RouteName = typeof ROUTES[keyof typeof ROUTES];
  
  // Type-safe cho params từng route
  export type RootStackParamList = {
    [ROUTES.LOGIN]: undefined;
    [ROUTES.HOME]: { updatedProfile?: ProfileEntity };
    [ROUTES.PROFILE]: { updatedProfile?: ProfileEntity };
    [ROUTES.UPDATE_PROFILE]: { profileId?: string };
    [ROUTES.CHANGE_PASSWORD]: { profileId?: string };
    // Thêm params cho các route khác nếu cần
  };
  