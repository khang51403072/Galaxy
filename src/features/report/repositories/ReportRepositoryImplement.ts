import { ReportRepository } from './ReportRepository';
import { ReportApi } from '../services/ReportApi';
import { Result, asyncResult, failure, success } from '../../../shared/types/Result';
import { BatchEntity, TimeSheetEntity } from '../types/ReportResponse';
import { CloseOutOwnerModel } from '../types/closeOutResponse';
import { CommonRequest } from '../../../types/CommonRequest';

export class ReportRepositoryImplement implements ReportRepository {
  
  getReportTechnician(request: CommonRequest): Promise<Result<string, Error>> {
    // Chúng ta vẫn mong đợi một Error chung ở đây
    const promise = ReportApi.getReportTechnician(request).then(res => res.data ?? "");
    return asyncResult<string, Error>(promise);
  }

  getReportSales(request: CommonRequest): Promise<Result<string, Error>> {
    const promise = ReportApi.getReportSales(request).then(res => res.data ?? "");
    return asyncResult<string, Error>(promise);
  }

  getReportTimeSheet(request: CommonRequest): Promise<Result<TimeSheetEntity[], Error>> {
    const promise = ReportApi.getReportTimeSheet(request).then(res => res.data ?? []);
    return asyncResult<TimeSheetEntity[], Error>(promise);
  }

  getReportBatchHistory(request: CommonRequest): Promise<Result<BatchEntity[], Error>> {
    const promise = ReportApi.getReportBatchHistory(request).then(res => res.data ?? []);
    return asyncResult<BatchEntity[], Error>(promise);
  }

  getCloseOut(request: CommonRequest): Promise<Result<string, Error>> {
    const promise = ReportApi.getCloseOut(request).then(res => res.data ?? "");
    return asyncResult<string, Error>(promise);
  }

  getCloseOutOwner(request: CommonRequest): Promise<Result<CloseOutOwnerModel, Error>> {
    const promise = ReportApi.getCloseOutOwner(request).then(res => res.data?? {} as CloseOutOwnerModel);
    return asyncResult<CloseOutOwnerModel, Error>(promise);
  }
}