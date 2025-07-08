import { CommonRequest } from "../../../types/CommonRequest";
import { httpClient } from "../../../core/network/HttpClient";
import { API_ENDPOINTS } from "../../../core/network/endpoints";
import { ApiResponse } from "../../../core/network/ApiResponse";


type PayrollResponse = ApiResponse<string>;

interface PayrollEntity {
    id: string;
    name: string;
    description: string;
}
export const getPayroll = async (request: CommonRequest):Promise<PayrollResponse> =>  {
    const response = await httpClient.post<PayrollResponse>(API_ENDPOINTS.PAYROLL.GET_PAYROLL, request);
    return response.data;
}

export const getPayrollOwner = async (request: CommonRequest):Promise<PayrollResponse> =>  {
    const response = await httpClient.post<PayrollResponse>(API_ENDPOINTS.PAYROLL.GET_PAYROLL_OWNER, request);
    return response.data;
}