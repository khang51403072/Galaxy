import { ReportRepository } from './ReportRepository';
import { ReportApi } from '../services/ReportApi';
import { Result, failure, success } from '../../../shared/types/Result';
import { BatchEntity, TimeSheetEntity } from '../types/ReportResponse';

export class ReportRepositoryImplement implements ReportRepository {
  async getReportTechnician(request: any): Promise<Result<string, Error>> {
    try {
      const response = await ReportApi.getReportTechnician(request);
      return success(response.data ?? "");
    } catch (error) {
      return failure(error as Error);
    }
  }
  async getReportSales(request: any): Promise<Result<string, Error>> {
    try {
      const response = await ReportApi.getReportSales(request);
      return success(response.data ?? "");
    } catch (error) {
      return failure(error as Error);
    }
  }
  async getReportTimeSheet(request: any): Promise<Result<TimeSheetEntity[], Error>> {
    try {
      const response = await ReportApi.getReportTimeSheet(request);
     
        return success(response.data ?? []);
      
      
    } catch (error) {
      return failure(error as Error);
    }
  }
  async getReportBatchHistory(request: any): Promise<Result<BatchEntity[], Error>> {
    try {
      const response = await ReportApi.getReportBatchHistory(request);
      return success(response.data ?? []);
    } catch (error) {
      return failure(error as Error);
    }
  }
  async getCloseOut(request: any): Promise<Result<string, Error>> {
    try {
      const response = await ReportApi.getCloseOut(request);
      return success(response.data ?? "");
    } catch (error) {
      return failure(error as Error);
    }
  }
} 