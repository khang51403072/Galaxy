import { httpClient } from '../../../core/network/HttpClient';
import { ApiResponse } from '../../../core/network/ApiResponse';
import { useAuthStore } from '../../auth/stores/authStore';

// ===== TYPES =====
export interface DashboardStats {
  totalCheckIns: number;
  totalHours: number;
  currentStreak: number;
  monthlyGoal: number;
  monthlyProgress: number;
}

export interface Activity {
  id: string;
  type: 'checkin' | 'checkout' | 'break' | 'overtime';
  timestamp: string;
  location: string;
  description: string;
}

export interface WorkSchedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  breakTime: number; // minutes
  isHoliday: boolean;
  isWeekend: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  isRead: boolean;
}

// ===== API RESPONSES =====
type DashboardStatsResponse = ApiResponse<DashboardStats>;
type ActivitiesResponse = ApiResponse<Activity[]>;
type ScheduleResponse = ApiResponse<WorkSchedule[]>;
type NotificationsResponse = ApiResponse<Notification[]>;

// ===== DASHBOARD API =====
export const DashboardApi = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStatsResponse> => {
    try {
      const res = await httpClient.get<DashboardStatsResponse>('/galaxy-me/dashboard/stats', {
        params: {
          employeeId: useAuthStore.getState().employeeId,
        }
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error.message || 'Không thể tải thống kê dashboard');
    }
  },

  // Get recent activities
  getRecentActivities: async (limit: number = 10): Promise<ActivitiesResponse> => {
    try {
      const res = await httpClient.get<ActivitiesResponse>('/galaxy-me/dashboard/activities', {
        params: {
          employeeId: useAuthStore.getState().employeeId,
          limit,
        }
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error.message || 'Không thể tải hoạt động gần đây');
    }
  },

  // Get work schedule
  getWorkSchedule: async (startDate: string, endDate: string): Promise<ScheduleResponse> => {
    try {
      const res = await httpClient.get<ScheduleResponse>('/galaxy-me/dashboard/schedule', {
        params: {
          employeeId: useAuthStore.getState().employeeId,
          startDate,
          endDate,
        }
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error.message || 'Không thể tải lịch làm việc');
    }
  },

  // Get notifications
  getNotifications: async (): Promise<NotificationsResponse> => {
    try {
      const res = await httpClient.get<NotificationsResponse>('/galaxy-me/dashboard/notifications', {
        params: {
          employeeId: useAuthStore.getState().employeeId,
        }
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error.message || 'Không thể tải thông báo');
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId: string): Promise<ApiResponse<void>> => {
    try {
      const res = await httpClient.put<ApiResponse<void>>(`/galaxy-me/dashboard/notifications/${notificationId}/read`, {}, {
        params: {
          employeeId: useAuthStore.getState().employeeId,
        }
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error.message || 'Không thể cập nhật trạng thái thông báo');
    }
  },

  // Check in/out
  checkIn: async (location: string): Promise<ApiResponse<void>> => {
    try {
      const res = await httpClient.post<ApiResponse<void>>('/galaxy-me/dashboard/checkin', {
        location,
        timestamp: new Date().toISOString(),
      }, {
        params: {
          employeeId: useAuthStore.getState().employeeId,
        }
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error.message || 'Không thể check-in');
    }
  },

  checkOut: async (location: string): Promise<ApiResponse<void>> => {
    try {
      const res = await httpClient.post<ApiResponse<void>>('/galaxy-me/dashboard/checkout', {
        location,
        timestamp: new Date().toISOString(),
      }, {
        params: {
          employeeId: useAuthStore.getState().employeeId,
        }
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error.message || 'Không thể check-out');
    }
  },
}; 