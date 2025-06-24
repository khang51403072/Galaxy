// Định nghĩa route name chuẩn cho toàn app
export const ROUTES = {
    LOGIN: 'Login',
    HOME: 'Home',
    PROFILE: 'Profile',
    // Thêm các route khác ở đây
  } as const;
  
  export type RouteName = typeof ROUTES[keyof typeof ROUTES];
  
  // Type-safe cho params từng route
  export type RootStackParamList = {
    [ROUTES.LOGIN]: undefined;
    [ROUTES.HOME]: { userId?: string };
    [ROUTES.PROFILE]: { profileId?: string };
    // Thêm params cho các route khác nếu cần
  };
  