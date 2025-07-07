import { httpClient } from "../../../core/network/HttpClient";
import { API_ENDPOINTS } from "../../../core/network/endpoints";
import { EmployeeEntity, WorkOrderEntity } from "../types/TicketResponse";
import { ApiResponse } from "../../../core/network/ApiResponse";
import { TicketRequest } from "../types/TicketRequest";

type EmployeeLookupResponse = ApiResponse<EmployeeEntity[]>;
type WorkOrderResponse = ApiResponse<WorkOrderEntity[]>;
export const TicketApi = {
  getEmployeeLookup: async () => {
    const res = await httpClient.get<EmployeeLookupResponse>(API_ENDPOINTS.HOME.EMPLOYEE_LOOKUP);
    return res.data;
  },
  getWorkOrders: async (request: TicketRequest) => {
    const res = await httpClient.post<WorkOrderResponse>(API_ENDPOINTS.TICKET.GET_WORK_ORDERS, request);
    return res.data;
  },
  getWorkOrderOwner: async () => {
    const res = await httpClient.post<WorkOrderResponse>(API_ENDPOINTS.TICKET.GET_WORK_ORDER_OWNER);
    return res.data;
  }

}