import { ReportRepository } from '../repositories/ReportRepository';

export class ReportUsecase {
  constructor(private repository: ReportRepository) {}

  async getReportTechnician(request: any) {
    return this.repository.getReportTechnician(request);
  }
  async getReportSales(request: any) {
    return this.repository.getReportSales(request);
  }
  async getReportTimeSheet(request: any) {
    return this.repository.getReportTimeSheet(request);
  }
  async getReportBatchHistory(request: any) {
    return this.repository.getReportBatchHistory(request);
  }
} 