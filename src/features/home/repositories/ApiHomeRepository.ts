import { HomeRepository } from './HomeRepository';
import { HomeEntity, ChartEntity } from '../types/HomeResponse';
import { HomeAPI } from '../services/HomeApi';
import { Result, success, failure } from '../../../shared/types/Result';
import { HomeError } from '../types/HomeError';
import { HomeOwnerRequest, HomeChartRequest } from '../types/HomeRequest';

export class ApiHomeRepository implements HomeRepository {
  constructor(private homeApi: typeof HomeAPI) {}

  async getHomeData(request: HomeOwnerRequest): Promise<Result<HomeEntity, HomeError>> {
    try {
      const response = await this.homeApi.getHomeData(request);
      // Validate response data
      if (!response.result || !response.data) {
        return failure(new HomeError(
          response.errorMsg, 
          'RESULT_FALSE'
        ));
      }
      return success(response.data);
    } catch (error: any) {
      return failure(new HomeError(error.message, 'SERVER_ERROR'));
    }
  }

  async getHomeDataOwner(request: HomeOwnerRequest): Promise<Result<HomeEntity, HomeError>> {
    try {
      const response = await this.homeApi.getHomeDataOwner(request);
      return success(response.data??{} as HomeEntity);
    } catch (error: any) {
      return failure(new HomeError(error.message, 'SERVER_ERROR'));
    }
  }

  async getChartData(request: HomeChartRequest): Promise<Result<ChartEntity[], HomeError>> {
    try {
      const response = await this.homeApi.getChartData(request);
      
      if (!response.result || !response.data) {
        return failure(new HomeError(
          response.errorMsg, 
          'RESULT_FALSE'
        ));
      }
      return success(response.data);
    } catch (error: any) {
      return failure(new HomeError(error.message, 'SERVER_ERROR'));
    }
  }

  async getChartDataOwner(request: HomeChartRequest): Promise<Result<ChartEntity[], HomeError>> {
    try {
      const response = await this.homeApi.getChartDataOwner(request);
      
      if (!response.result || !response.data) {
        return failure(new HomeError(
          response.errorMsg, 
          'RESULT_FALSE'
        ));
      }
      return success(response.data);
    } catch (error: any) {
      return failure(new HomeError(error.message, 'SERVER_ERROR'));
    }
  }
} 