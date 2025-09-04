import { HomeEntity, ChartEntity } from '../types/HomeResponse';
import { Result } from '../../../shared/types/Result';
import { HomeError } from '../types/HomeError';
import { HomeOwnerRequest, HomeChartRequest, SummaryRequest } from '../types/HomeRequest';
import { ReportData } from '../types/SummaryResponse';

export interface HomeRepository {
  getHomeData(request: HomeOwnerRequest): Promise<Result<HomeEntity, HomeError>>;
  getHomeDataOwner(request: HomeOwnerRequest): Promise<Result<HomeEntity, HomeError>>;
  getChartData(request: HomeChartRequest): Promise<Result<ChartEntity[], HomeError>>;
  getChartDataOwner(request: HomeChartRequest): Promise<Result<ChartEntity[], HomeError>>;
  getSummaryData(request: SummaryRequest): Promise<Result<ReportData, HomeError>>;
} 