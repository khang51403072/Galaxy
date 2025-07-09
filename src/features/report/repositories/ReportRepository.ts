import { Result } from "../../../shared/types/Result";
import { BatchEntity, TimeSheetEntity } from "../types/ReportResponse";

export interface ReportRepository {
  getReportTechnician(request: any): Promise<Result<string, Error>>;
  getReportSales(request: any): Promise<Result<string, Error>>;
  getReportTimeSheet(request: any): Promise<Result<TimeSheetEntity[], Error>>;
  getReportBatchHistory(request: any): Promise<Result<BatchEntity[], Error>>;
  getCloseOut(request: any): Promise<Result<string, Error>>;
} 