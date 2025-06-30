import xlog from '../../../core/utils/xlog';
import { DashboardApi, DashboardStats, Activity, WorkSchedule, Notification } from '../services/DashboardApi';

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const res = await DashboardApi.getDashboardStats();
    xlog.info('Dashboard stats loaded', {
      tag: "Dashboard",
      extra: res?.data
    });
    
    // Return mock data for now
    return {
      totalCheckIns: 24,
      totalHours: 160,
      currentStreak: 5,
      monthlyGoal: 180,
      monthlyProgress: 89,
    };
  } catch (error) {
    xlog.error('Error loading dashboard stats', {
      tag: "Dashboard",
      extra: error
    });
    throw error;
  }
}

export async function getRecentActivities(limit: number = 10): Promise<Activity[]> {
  try {
    const res = await DashboardApi.getRecentActivities(limit);
    xlog.info('Recent activities loaded', {
      tag: "Dashboard",
      extra: res?.data
    });
    
    // Return mock data for now
    return [
      {
        id: '1',
        type: 'checkin',
        timestamp: '2025-01-20T08:00:00Z',
        location: 'Office Building A',
        description: 'Checked in at 8:00 AM',
      },
      {
        id: '2',
        type: 'checkout',
        timestamp: '2025-01-20T17:00:00Z',
        location: 'Office Building A',
        description: 'Checked out at 5:00 PM',
      },
    ];
  } catch (error) {
    xlog.error('Error loading recent activities', {
      tag: "Dashboard",
      extra: error
    });
    throw error;
  }
}

export async function getWorkSchedule(startDate: string, endDate: string): Promise<WorkSchedule[]> {
  try {
    const res = await DashboardApi.getWorkSchedule(startDate, endDate);
    xlog.info('Work schedule loaded', {
      tag: "Dashboard",
      extra: res?.data
    });
    
    // Return mock data for now
    return [
      {
        id: '1',
        date: '2025-01-20',
        startTime: '08:00',
        endTime: '17:00',
        breakTime: 60,
        isHoliday: false,
        isWeekend: false,
      },
    ];
  } catch (error) {
    xlog.error('Error loading work schedule', {
      tag: "Dashboard",
      extra: error
    });
    throw error;
  }
}

export async function checkIn(location: string): Promise<void> {
  try {
    await DashboardApi.checkIn(location);
    xlog.info('Check-in successful', {
      tag: "Dashboard",
      extra: { location }
    });
  } catch (error) {
    xlog.error('Error during check-in', {
      tag: "Dashboard",
      extra: error
    });
    throw error;
  }
}

export async function checkOut(location: string): Promise<void> {
  try {
    await DashboardApi.checkOut(location);
    xlog.info('Check-out successful', {
      tag: "Dashboard",
      extra: { location }
    });
  } catch (error) {
    xlog.error('Error during check-out', {
      tag: "Dashboard",
      extra: error
    });
    throw error;
  }
} 