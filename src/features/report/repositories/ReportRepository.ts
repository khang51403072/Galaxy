import { Result } from "../../../shared/types/Result";

export interface ReportRepository {
  getReportTechnician(request: any): Promise<Result<string, Error>>;
  getReportSales(request: any): Promise<Result<string, Error>>;
  getReportTimeSheet(request: any): Promise<Result<string, Error>>;
  getReportBatchHistory(request: any): Promise<Result<string, Error>>;
} 