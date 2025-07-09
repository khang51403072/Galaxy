import { Result } from '../../../shared/types/Result';
import { ReportRepository } from '../repositories/ReportRepository';
import { BatchEntity, TimeSheetEntity } from '../types/ReportResponse';

export class ReportUsecase {
  constructor(private repository: ReportRepository) {}

  async getReportTechnician(request: any): Promise<Result<string, Error>> {
    return this.repository.getReportTechnician(request);
  }
  async getReportSales(request: any): Promise<Result<string, Error>> {
    return this.repository.getReportSales(request);
  }
  async getReportTimeSheet(request: any): Promise<Result<TimeSheetEntity[], Error>> {
    return this.repository.getReportTimeSheet(request);
  }
  async getReportBatchHistory(request: any): Promise<Result<BatchEntity[], Error>> {
    return this.repository.getReportBatchHistory(request);
  }
  async getCloseOut(request: any): Promise<Result<string, Error>> {
    return this.repository.getCloseOut(request);
  }
} 