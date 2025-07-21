import { ApiResponse } from "../../../core/network/ApiResponse";
import { httpClientWithDeduplication } from "../../../core/network/HttpClient";
import { API_ENDPOINTS } from "../../../core/network/endpoints";
import { CommonRequest } from "../../../types/CommonRequest";
import { AppointmentResponse } from "../types/AppointmentResponse";
// Import các type response mới
import { CategoriesResponse } from "../types/CategoriesResponse";
import { MenuItemResponse } from "../types/MenuItemResponse";
import { ApptResResponse } from "../types/ApptResResponse";
import { CustomerResponse, CustomerPayload, CustomerSavePayload, CustomerSaveResponse } from "../types/CustomerResponse";
import { ApptPayload, ApptSaveResponse } from "../types/ApptSaveResponse";
import { ApptDetailsResponse } from "../types/ApptDetailsResponse";
import { CompanyProfileResponse } from "../types/CompanyProfileResponse";


type commonResponse = ApiResponse<string>;

export const AppointmentApi = {
    getAppointmentList: async (request: CommonRequest): Promise<AppointmentResponse> => {
        try {
            const response = await httpClientWithDeduplication.post(API_ENDPOINTS.APPOINTMENT.APPOINTMENT_LIST, request);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    getAppointmentListOwner: async (request: CommonRequest): Promise<AppointmentResponse> => {
        try {
            const response = await httpClientWithDeduplication.post(API_ENDPOINTS.APPOINTMENT.APPOINTMENT_LIST_OWNER, request);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // API mới
    getCategories: async (): Promise<CategoriesResponse> => {
        const response = await httpClientWithDeduplication.get(API_ENDPOINTS.APPOINTMENT.GET_CATEGORIES);
        return response.data;
    },
    getMenuItems: async (): Promise<MenuItemResponse> => {
        const response = await httpClientWithDeduplication.get(API_ENDPOINTS.APPOINTMENT.GET_MENU_ITEMS);
        return response.data;
    },
    getApptResource: async (): Promise<ApptResResponse> => {
        const response = await httpClientWithDeduplication.get(API_ENDPOINTS.APPOINTMENT.GET_APPT_RESOURCE);
        return response.data;
    },
    customers: async (payload: CustomerPayload): Promise<CustomerResponse> => {
        const response = await httpClientWithDeduplication.post(API_ENDPOINTS.APPOINTMENT.GET_CUSTOMERS, payload);
        return response.data;
    },
    customerSave: async (payload: CustomerSavePayload): Promise<CustomerSaveResponse> => {
        const response = await httpClientWithDeduplication.post(API_ENDPOINTS.APPOINTMENT.SAVE_CUSTOMER, payload);
        return response.data;
    },
    saveAppointment: async (payload: ApptPayload): Promise<ApptSaveResponse> => {
        const response = await httpClientWithDeduplication.post(API_ENDPOINTS.APPOINTMENT.SAVE_APPOINTMENT, payload);
        return response.data;
    },
    apptDetails: async (id: string): Promise<ApptDetailsResponse> => {
        const response = await httpClientWithDeduplication.get(`${API_ENDPOINTS.APPOINTMENT.APPT_DETAILS}/${id}`);
        return response.data;
    },

    apptCompanyProfile: async (): Promise<CompanyProfileResponse> => {
        const response = await httpClientWithDeduplication.get(`${API_ENDPOINTS.APPOINTMENT.COMPANY_PROFILE}`);
        return response.data;
    },
} 