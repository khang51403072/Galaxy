import { httpClient } from "../../../core/network/HttpClient";
import { API_ENDPOINTS } from "../../../core/network/endpoints";
import { EmployeeEntity } from "../types/TicketResponse";
import { ApiResponse } from "../../../core/network/ApiResponse";

type EmployeeLookupResponse = ApiResponse<EmployeeEntity[]>;

export const TicketApi = {
  getEmployeeLookup: async () => {
    const res = await httpClient.get<EmployeeLookupResponse>(API_ENDPOINTS.HOME.EMPLOYEE_LOOKUP);
    return res.data;
  }
}