import { CommonRequest } from "@/types/CommonRequest";
import { create, StateCreator } from "zustand";
import { AppointmentUsecase } from "../usecases/AppointmentUsecase";
import { isSuccess, Result, success } from "../../../shared/types/Result";
import { AppointmentEntity } from "../types/AppointmentResponse";
import { keychainHelper, KeychainObject } from "@/shared/utils/keychainHelper";
import { CompanyProfileResponse } from "../types/CompanyProfileResponse";

// State
export type AppointmentState = {
    isLoading: boolean;
    error: string | null;
    selectedDate: Date;
    selectedEmployee: EmployeeEntity | null;
    appointmentList: AppointmentEntity[];
    json: KeychainObject | null;
    companyProfile: CompanyProfileResponse | null;
    getAppointmentList: () => Promise<Result<AppointmentEntity[], Error>>;
    getAppointmentListOwner: () => Promise<Result<AppointmentEntity[], Error>>;
    getCompanyProfile: () => Promise<Result<CompanyProfileResponse, Error>>;
    setSelectedEmployee: (employee: EmployeeEntity) => void;
    reset: () => void;
}
const initialState: Partial<AppointmentState> = {
    isLoading: false,
    error: null,
    selectedDate: new Date(),
    selectedEmployee: null,
    appointmentList: [],
    json: null,
    companyProfile: null
}
export const appointmentSelectors = {
    selectIsLoading: (state: AppointmentState) => state.isLoading,
    selectError: (state: AppointmentState) => state.error,
    selectSelectedDate: (state: AppointmentState) => state.selectedDate,
    selectAppointmentList: (state: AppointmentState) => state.appointmentList,
    selectGetAppointmentList: (state: AppointmentState) => state.getAppointmentList,
    selectGetAppointmentListOwner: (state: AppointmentState) => state.getAppointmentListOwner,
    selectJson: (state: AppointmentState) => state.json,
    selectCompanyProfile: (state: AppointmentState) => state.companyProfile,
    selectGetCompanyProfile: (state: AppointmentState) => state.getCompanyProfile,
    selectSelectedEmployee: (state: AppointmentState) => state.selectedEmployee,
    selectSetSelectedEmployee: (state: AppointmentState) => state.setSelectedEmployee,
    selectReset: (state: AppointmentState) => state.reset,
}

// Refactor: nhận appointmentUsecase từ ngoài vào
export const createAppointmentStore = (usecase: AppointmentUsecase): StateCreator<AppointmentState> => (set, get) => ({
    ...initialState as AppointmentState,
    setSelectedEmployee: (employee: EmployeeEntity) => {
        set({ selectedEmployee: employee });
    },
    getAppointmentList: async (): Promise<Result<AppointmentEntity[], Error>> => {
        set({ isLoading: true });
        const employeeId = get().json?.employeeId ?? "";
        const request: CommonRequest = {
            dateStart: get().selectedDate?.toYYYYMMDD('-'),
            dateEnd: get().selectedDate?.toYYYYMMDD('-'),
            employeeId: employeeId,
        }
        const response = await usecase.getAppointmentList(request);
        if (isSuccess(response)) {
            set({ appointmentList: response.value, isLoading: false });
        } else {
            set({ error: response.error.message, isLoading: false });
        }
        return response;
    },
    getAppointmentListOwner: async (): Promise<Result<AppointmentEntity[], Error>> => {
        set({ isLoading: true });
        const request: CommonRequest = {
            dateStart: get().selectedDate?.toYYYYMMDD('-'),
            dateEnd: get().selectedDate?.toYYYYMMDD('-'),
            employeeId: get().selectedEmployee?.id ?? "",
        }
        const response = await usecase.getAppointmentListOwner(request);
        if (isSuccess(response)) {
            set({ appointmentList: response.value, isLoading: false });
        } else {
            set({ error: response.error.message, isLoading: false });
        }
        return response;
    },
    getCompanyProfile: async (): Promise<Result<CompanyProfileResponse, Error>> => {
        if (get().companyProfile != null) {
            return success(get().companyProfile!);
        }
        const response = await usecase.apptCompanyProfile();
        if (isSuccess(response)) {
            set({ companyProfile: response.value });
        }
        return response;
    },
    reset: () => {
        set(initialState as AppointmentState);
    }
});

// Khởi tạo real usecase ở production
import { AppointmentRepositoryImplement } from "../repositories/AppointmentRepositoryImplement";
import { EmployeeEntity } from "@/features/ticket/types/TicketResponse";
const realAppointmentUsecase = new AppointmentUsecase(new AppointmentRepositoryImplement());
export const useAppointmentStore = create<AppointmentState>()(createAppointmentStore(realAppointmentUsecase)); 