export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/galaxy-me/authen',
  },
  PROFILE: {
    PROFILE: '/galaxy-me/profile',
    UPDATE_PROFILE: '/galaxy-me/save-profile',
    CHANGE_PASSWORD: '/galaxy-me/reset-password',
    UPLOAD_AVATAR: 'galaxy-me/upload-avatar',
  },
  HOME: {
    HOME_OWNER: 'galaxy-me/home-owner',
    VIEW_CHART: 'galaxy-me/view-chart',
    VIEW_CHART_OWNER: 'galaxy-me/view-chart-owner',
    EMPLOYEE_LOOKUP: 'galaxy-me/employees-lookup',
  },
  TICKET: {
    GET_WORK_ORDERS: 'galaxy-me/get-work-orders',
    GET_WORK_ORDER_OWNER: 'galaxy-me/work-orders-owner',
  }
} as const; 