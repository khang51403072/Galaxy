import { ApiResponse } from "../../../core/network/ApiResponse";
import  {httpClient}  from "../../../core/network/HttpClient";
import { API_ENDPOINTS } from "../../../core/network/endpoints";
import  {CommonRequest}  from "../../../types/CommonRequest";


type commonResponse = ApiResponse<string>;


export const ReportApi = {
    getReportTechnician: async (request: CommonRequest):Promise<commonResponse> => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.REPORT.REPORT_TECHNICIAN,request);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getReportSales: async (request: CommonRequest):Promise<commonResponse> => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.REPORT.REPORT_SALES,request);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getReportTimeSheet: async (request: CommonRequest):Promise<commonResponse> => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.REPORT.REPORT_TIME_SHEET,request);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getReportBatchHistory: async (request: CommonRequest):Promise<commonResponse> => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.REPORT.REPORT_BATCH_HISTORY,request);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
        
}