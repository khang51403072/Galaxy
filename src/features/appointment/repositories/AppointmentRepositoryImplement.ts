import { CommonRequest } from "@/types/CommonRequest";
import { AppointmentResponse, AppointmentEntity } from "../types/AppointmentResponse";
import { AppointmentRepository } from "./AppointmentRepository";
import { AppointmentApi } from "../services/AppointmentApi";
import { Result, success, failure } from "../../../shared/types/Result";
import { CategoriesResponse } from "../types/CategoriesResponse";
import { MenuItemResponse } from "../types/MenuItemResponse";
import { ApptResResponse } from "../types/ApptResResponse";
import { CustomerResponse, CustomerPayload, CustomerSavePayload, CustomerSaveResponse } from "../types/CustomerResponse";
import { ApptPayload, ApptSaveResponse } from "../types/ApptSaveResponse";
import { ApptDetailsResponse } from "../types/ApptDetailsResponse";

export class AppointmentRepositoryImplement implements AppointmentRepository {
    async getAppointmentList(request: CommonRequest): Promise<Result<AppointmentEntity[], Error>> {
        try {
            const response = await AppointmentApi.getAppointmentList(request);
            return success(response.data ?? []);
        } catch (error) {
            return failure(error as Error);
        }
    }

    async getAppointmentListOwner(request: CommonRequest): Promise<Result<AppointmentEntity[], Error>> {
        try {
            const response = await AppointmentApi.getAppointmentListOwner(request);
            return success(response.data ?? []);
        } catch (error) {
            return failure(error as Error);
        }
    }

    async getCategories(): Promise<Result<CategoriesResponse, Error>> {
        try {
            const response = await AppointmentApi.getCategories();
            return success(response);
        } catch (error) {
            return failure(error as Error);
        }
    }

    async getMenuItems(): Promise<Result<MenuItemResponse, Error>> {
        try {
            const response = await AppointmentApi.getMenuItems();
            return success(response);
        } catch (error) {
            return failure(error as Error);
        }
    }

    async getApptResource(): Promise<Result<ApptResResponse, Error>> {
        try {
            const response = await AppointmentApi.getApptResource();
            return success(response);
        } catch (error) {
            return failure(error as Error);
        }
    }

    async customers(payload: CustomerPayload): Promise<Result<CustomerResponse, Error>> {
        try {
            const response = await AppointmentApi.customers(payload);
            return success(response);
        } catch (error) {
            return failure(error as Error);
        }
    }

    async customerSave(payload: CustomerSavePayload): Promise<Result<CustomerSaveResponse, Error>> {
        try {
            const response = await AppointmentApi.customerSave(payload);
            return success(response);
        } catch (error) {
            return failure(error as Error);
        }
    }

    async saveAppointment(payload: ApptPayload): Promise<Result<ApptSaveResponse, Error>> {
        try {
            const response = await AppointmentApi.saveAppointment(payload);
            return success(response);
        } catch (error) {
            return failure(error as Error);
        }
    }

    async apptDetails(id: string): Promise<Result<ApptDetailsResponse, Error>> {
        try {
            const response = await AppointmentApi.apptDetails(id);
            return success(response);
        } catch (error) {
            return failure(error as Error);
        }
    }
} 