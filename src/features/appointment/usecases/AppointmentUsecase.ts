import { CommonRequest } from "@/types/CommonRequest";
import { AppointmentResponse, AppointmentEntity } from "../types/AppointmentResponse";
import { AppointmentRepository } from "../repositories/AppointmentRepository";
import { Result } from "../../../shared/types/Result";
import { CategoriesResponse, CategoryEntity } from "../types/CategoriesResponse";
import { MenuItemEntity, MenuItemResponse } from "../types/MenuItemResponse";
import { ApptResResponse } from "../types/ApptResResponse";
import { CustomerResponse, CustomerPayload, CustomerSavePayload, CustomerSaveResponse } from "../types/CustomerResponse";
import { ApptPayload, ApptSaveResponse } from "../types/ApptSaveResponse";
import { ApptDetailsResponse } from "../types/ApptDetailsResponse";
import { CompanyProfileResponse } from "../types/CompanyProfileResponse";

export class AppointmentUsecase {
    constructor(private repository: AppointmentRepository) {}

    async getAppointmentList(request: CommonRequest): Promise<Result<AppointmentEntity[], Error>> {
        return await this.repository.getAppointmentList(request);
    }

    async getAppointmentListOwner(request: CommonRequest): Promise<Result<AppointmentEntity[], Error>> {
        return await this.repository.getAppointmentListOwner(request);
    }

    async getCategories(): Promise<Result<CategoryEntity[], Error>> {
        return await this.repository.getCategories();
    }

    async getMenuItems(): Promise<Result<MenuItemEntity[], Error>> {
        return await this.repository.getMenuItems();
    }

    async getApptResource(): Promise<Result<ApptResResponse, Error>> {
        return await this.repository.getApptResource();
    }

    async customers(payload: CustomerPayload): Promise<Result<CustomerResponse, Error>> {
        return await this.repository.customers(payload);
    }

    async customerSave(payload: CustomerSavePayload): Promise<Result<CustomerSaveResponse, Error>> {
        return await this.repository.customerSave(payload);
    }

    async saveAppointment(payload: ApptPayload): Promise<Result<ApptSaveResponse, Error>> {
        return await this.repository.saveAppointment(payload);
    }

    async apptDetails(id: string): Promise<Result<ApptDetailsResponse, Error>> {
        return await this.repository.apptDetails(id);
    }

    async apptCompanyProfile(): Promise<Result<CompanyProfileResponse, Error>> {
        return await this.repository.apptCompanyProfile();
    }
} 