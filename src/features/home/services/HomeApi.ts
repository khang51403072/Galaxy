import { httpClient } from '../../../core/network/HttpClient';
import { ApiResponse } from '../../../core/network/ApiResponse';
import { API_ENDPOINTS } from '../../../core/network/endpoints';
import { HomeChartRequest, HomeOwnerRequest } from '../types/HomeRequest';
import { ChartEntity, HomeEntity } from '../types/HomeResponse';

// ===== TYPES =====
export interface DashboardStats {
  totalCheckIns: number;
  totalHours: number;
  currentStreak: number;
  monthlyGoal: number;
  monthlyProgress: number;
}


// ===== API RESPONSES =====
type HomeDataResponse = ApiResponse<HomeEntity>;
type ChartDataResponse = ApiResponse<ChartEntity[]>;

export const HomeAPI = {
  // Get dashboard statistics
  getHomeDataOwner: async (request: HomeOwnerRequest): Promise<HomeDataResponse> => {
    try {
      const res = await httpClient.post<HomeDataResponse>(API_ENDPOINTS.HOME.HOME_OWNER, request);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  },

  getChartData: async (request: HomeChartRequest): Promise<ChartDataResponse> => {
    try {
      const res = await httpClient.post<ChartDataResponse>(API_ENDPOINTS.HOME.VIEW_CHART, request);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  },

  getChartDataOwner: async (request: HomeChartRequest): Promise<ChartDataResponse> => {
    try {
      const res = await httpClient.post<ChartDataResponse>(API_ENDPOINTS.HOME.VIEW_CHART_OWNER, request);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  },

  getHomeData: async (request: HomeOwnerRequest): Promise<HomeDataResponse> => {
    try {
      const res = await httpClient.post<HomeDataResponse>(API_ENDPOINTS.HOME.HOME, request);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  },

}; 