import { ApiResponse } from "../../../core/network/ApiResponse";
import { httpClientWithDeduplication } from "../../../core/network/HttpClient";
import { API_ENDPOINTS } from "../../../core/network/endpoints";
import { CommonRequest } from "../../../types/CommonRequest";
import { BatchHistoryResponse, TimeSheetResponse } from "../types/ReportResponse";
import { CloseOutOwnerModel } from "../types/closeOutResponse";


// Sửa lại type này để dùng cho nhiều hàm hơn, hoặc tạo các type riêng biệt
type HtmlStringResponse = ApiResponse<string>;
type CloseOutResponse = ApiResponse<CloseOutOwnerModel>;
export const ReportApi = {
    getReportTechnician: async (request: CommonRequest): Promise<HtmlStringResponse> => {
        const response = await httpClientWithDeduplication.post(API_ENDPOINTS.REPORT.REPORT_TECHNICIAN, request);
        return response.data;
    },

    getReportSales: async (request: CommonRequest): Promise<HtmlStringResponse> => {
        const response = await httpClientWithDeduplication.post(API_ENDPOINTS.REPORT.REPORT_SALES, request);
        return response.data;
    },

    getReportTimeSheet: async (request: CommonRequest): Promise<TimeSheetResponse> => {
        const response = await httpClientWithDeduplication.post(API_ENDPOINTS.REPORT.REPORT_TIME_SHEET, request);
        return response.data;
    },

    getReportBatchHistory: async (request: CommonRequest):Promise<BatchHistoryResponse> => {
        // Lưu ý: hàm này dùng GET và không cần request body theo code gốc của bạn
        const response = await httpClientWithDeduplication.get(API_ENDPOINTS.REPORT.REPORT_BATCH_HISTORY);
        return response.data;
    },

    getCloseOut: async (request: CommonRequest): Promise<HtmlStringResponse> => {
        const response = await httpClientWithDeduplication.post(API_ENDPOINTS.REPORT.CLOSE_OUT, request);
        return response.data;
    },

    // Khuyến nghị: Sử dụng một type cụ thể cho response này
    getCloseOutOwner: async (request: CommonRequest): Promise<CloseOutResponse> => {
        const response = await httpClientWithDeduplication.post(API_ENDPOINTS.REPORT.CLOSE_OUT_OWNER, request);
        return response.data;
    }
};