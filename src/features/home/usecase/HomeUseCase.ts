import { Result } from "../../../shared/types/Result";
import { HomeOwnerRequest, HomeChartRequest } from "../types/HomeRequest";
import { HomeEntity, ChartEntity } from "../types/HomeResponse";
import { HomeError } from "../types/HomeError";
import { HomeRepository } from "../repositories/HomeRepository";
import xlog from '../../../core/utils/xlog';

export class HomeUseCase {
  constructor(private homeRepository: HomeRepository) {}

  async getHomeData(request: HomeOwnerRequest): Promise<Result<HomeEntity, HomeError>> {
    try {
      const result = await this.homeRepository.getHomeData(request);
      
      if (result.isSuccess()) {
        xlog.info('Home data loaded successfully', {
          tag: 'HomeUseCase',
          extra: result.value
        });
        return result;
      } else {
        xlog.error('Failed to load home data', {
          tag: 'HomeUseCase',
          extra: result.error
        });
        throw result.error;
      }
    } catch (error) {
      xlog.error('Error in getHomeData use case', {
        tag: 'HomeUseCase',
        extra: error
      });
      throw error;
    }
  }

  async getChartData(request: HomeChartRequest): Promise<Result<ChartEntity[], HomeError>> {
    try {
      const result = await this.homeRepository.getChartData(request);
      
      if (result.isSuccess()) {
        xlog.info('Chart data loaded successfully', {
          tag: 'HomeUseCase',
          extra: result.value
        });
        return result;
      } else {
        xlog.error('Failed to load chart data', {
          tag: 'HomeUseCase',
          extra: result.error
        });
        throw result.error;
      }
    } catch (error) {
      xlog.error('Error in getChartData use case', {
        tag: 'HomeUseCase',
        extra: error
      });
      throw error;
    }
  }

  async getChartDataOwner(request: HomeChartRequest): Promise<Result<ChartEntity[], HomeError>> {
    try {
      const result = await this.homeRepository.getChartDataOwner(request);
      
      if (result.isSuccess()) {
        xlog.info('Chart data owner loaded successfully', {
          tag: 'HomeUseCase',
          extra: result.value
        });
        return result;
      } else {
        xlog.error('Failed to load chart data owner', {
          tag: 'HomeUseCase',
          extra: result.error
        });
        throw result.error;
      }
    } catch (error) {
      xlog.error('Error in getChartDataOwner use case', {
        tag: 'HomeUseCase',
        extra: error
      });
      throw error;
    }
  }
}
