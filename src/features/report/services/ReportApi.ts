import { ApiResponse } from "../../../core/network/ApiResponse";
import { httpClientWithDeduplication } from "../../../core/network/HttpClient";
import { API_ENDPOINTS } from "../../../core/network/endpoints";
import  {CommonRequest}  from "../../../types/CommonRequest";
import { BatchHistoryResponse, TimeSheetResponse } from "../types/ReportResponse";


type commonResponse = ApiResponse<string>;


export const ReportApi = {
    getReportTechnician: async (request: CommonRequest):Promise<commonResponse> => {
        try {
            const response = await httpClientWithDeduplication.post(API_ENDPOINTS.REPORT.REPORT_TECHNICIAN,request);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getReportSales: async (request: CommonRequest):Promise<commonResponse> => {
        try {
            const response = await httpClientWithDeduplication.post(API_ENDPOINTS.REPORT.REPORT_SALES,request);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getReportTimeSheet: async (request: CommonRequest):Promise<TimeSheetResponse> => {
        try {
            const response = await httpClientWithDeduplication.post(API_ENDPOINTS.REPORT.REPORT_TIME_SHEET,request);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getReportBatchHistory: async (request: CommonRequest):Promise<BatchHistoryResponse> => {
        try {
            const response = await httpClientWithDeduplication.get(API_ENDPOINTS.REPORT.REPORT_BATCH_HISTORY);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getCloseOut: async (request: CommonRequest):Promise<commonResponse> => {
        try {
            const response = await httpClientWithDeduplication.post(API_ENDPOINTS.REPORT.CLOSE_OUT,request);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}