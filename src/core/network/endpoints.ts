export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/galaxy-me/authen',
    LOGOUT:'galaxy-me/logout',
    REGISTER_FCM: 'galaxy-me/register-fcm'
  },
  PROFILE: {
    PROFILE: '/galaxy-me/profile',
    UPDATE_PROFILE: '/galaxy-me/save-profile',
    CHANGE_PASSWORD: '/galaxy-me/reset-password',
    UPLOAD_AVATAR: 'galaxy-me/upload-avatar',
  },
  HOME: {
    HOME: 'galaxy-me/home',
    HOME_OWNER: 'galaxy-me/home-owner',
    VIEW_CHART: 'galaxy-me/view-chart',
    VIEW_CHART_OWNER: 'galaxy-me/view-chart-owner',
    EMPLOYEE_LOOKUP: 'galaxy-me/employees-lookup',
  },
  TICKET: {
    GET_WORK_ORDERS: 'galaxy-me/get-work-orders',
    GET_WORK_ORDER_OWNER: 'galaxy-me/work-orders-owner',
  },
  PAYROLL: {
    GET_PAYROLL: 'galaxy-me/payroll',
    GET_PAYROLL_OWNER: 'galaxy-me/payroll-owner',
  },
  REPORT: {
    REPORT_TECHNICIAN: 'galaxy-me/employee-summary',
    REPORT_SALES: 'galaxy-me/sales-summary',
    REPORT_TIME_SHEET: 'galaxy-me/attendances-close-out',
    REPORT_BATCH_HISTORY: 'galaxy-me/batch-history-owner',
    CLOSE_OUT: 'galaxy-me/close-out',
  },
  APPOINTMENT: {
    APPOINTMENT_LIST: 'galaxy-me/appointment',
    APPOINTMENT_LIST_OWNER: 'galaxy-me/appointment-owner',
    GET_CATEGORIES: 'galaxy-me/get-categories',
    GET_MENU_ITEMS: 'galaxy-me/get-menu-items',
    GET_APPT_RESOURCE: 'galaxy-me/get-appointment-resources',
    GET_CUSTOMERS: 'galaxy-me/get-customers',
    SAVE_CUSTOMER: 'galaxy-me/save-customer',
    SAVE_APPOINTMENT: 'galaxy-me/save-appointment',
    APPT_DETAILS: 'galaxy-me/appointment-details',
    COMPANY_PROFILE: 'galaxy-me/get-company-profile'
  }
  
} as const; 