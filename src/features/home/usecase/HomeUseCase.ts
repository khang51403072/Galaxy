import { Result } from "../../../shared/types/Result";
import { HomeOwnerRequest, HomeChartRequest, SummaryRequest } from "../types/HomeRequest";
import { HomeEntity, ChartEntity } from "../types/HomeResponse";
import { HomeError } from "../types/HomeError";
import { HomeRepository } from "../repositories/HomeRepository";
import { ReportData } from "../types/SummaryResponse";

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

  async getSummaryData(request: SummaryRequest) : Promise<Result<ReportData, HomeError>> {
    return await this.homeRepository.getSummaryData(request);
  }

}
