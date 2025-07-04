import { HomeEntity, ChartEntity } from '../types/HomeResponse';
import { Result } from '../../../shared/types/Result';
import { HomeError } from '../types/HomeError';
import { HomeOwnerRequest, HomeChartRequest } from '../types/HomeRequest';

export interface HomeRepository {
  getHomeData(request: HomeOwnerRequest): Promise<Result<HomeEntity, HomeError>>;
  getChartData(request: HomeChartRequest): Promise<Result<ChartEntity[], HomeError>>;
  getChartDataOwner(request: HomeChartRequest): Promise<Result<ChartEntity[], HomeError>>;
} 