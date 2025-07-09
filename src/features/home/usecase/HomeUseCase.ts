import { Result } from "../../../shared/types/Result";
import { HomeOwnerRequest, HomeChartRequest } from "../types/HomeRequest";
import { HomeEntity, ChartEntity } from "../types/HomeResponse";
import { HomeError } from "../types/HomeError";
import { HomeRepository } from "../repositories/HomeRepository";
import xlog from '../../../core/utils/xlog';

export class HomeUseCase {
  constructor(private homeRepository: HomeRepository) {}

  async getHomeData(request: HomeOwnerRequest): Promise<Result<HomeEntity, HomeError>> {
    return await this.homeRepository.getHomeData(request);
  }

  async getHomeDataOwner(request: HomeOwnerRequest): Promise<Result<HomeEntity, HomeError>> {
    return this.homeRepository.getHomeDataOwner(request);
  }

  async getChartData(request: HomeChartRequest): Promise<Result<ChartEntity[], HomeError>> {
    return await this.homeRepository.getChartData(request);
  }

  async getChartDataOwner(request: HomeChartRequest): Promise<Result<ChartEntity[], HomeError>> {
    return await this.homeRepository.getChartDataOwner(request);
  }
}
