import { CommonRequest } from "@/types/CommonRequest";
import { AppointmentResponse, AppointmentEntity } from "../types/AppointmentResponse";
import { Result } from "../../../shared/types/Result";
import { CategoriesResponse } from "../types/CategoriesResponse";
import { MenuItemResponse } from "../types/MenuItemResponse";
import { ApptResResponse } from "../types/ApptResResponse";
import { CustomerResponse, CustomerPayload, CustomerSavePayload, CustomerSaveResponse } from "../types/CustomerResponse";
import { ApptPayload, ApptSaveResponse } from "../types/ApptSaveResponse";
import { ApptDetailsResponse } from "../types/ApptDetailsResponse";
import { CompanyProfileResponse } from "../types/CompanyProfileResponse";

export interface AppointmentRepository {
    getAppointmentList(request: CommonRequest): Promise<Result<AppointmentEntity[], Error>>;
    getAppointmentListOwner(request: CommonRequest): Promise<Result<AppointmentEntity[], Error>>;
    getCategories(): Promise<Result<CategoriesResponse, Error>>;
    getMenuItems(): Promise<Result<MenuItemResponse, Error>>;
    getApptResource(): Promise<Result<ApptResResponse, Error>>;
    customers(payload: CustomerPayload): Promise<Result<CustomerResponse, Error>>;
    customerSave(payload: CustomerSavePayload): Promise<Result<CustomerSaveResponse, Error>>;
    saveAppointment(payload: ApptPayload): Promise<Result<ApptSaveResponse, Error>>;
    apptDetails(id: string): Promise<Result<ApptDetailsResponse, Error>>;
    apptCompanyProfile(): Promise<Result<CompanyProfileResponse, Error>>;
} 