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
  }
  
} as const; 