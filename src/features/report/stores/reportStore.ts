import { CommonRequest } from "@/types/CommonRequest";
import { create, StateCreator } from "zustand";
import { ReportRepositoryImplement } from "../repositories/ReportRepositoryImplement";
import { ReportUsecase } from "../usecases/ReportUsecase";
import { isSuccess, Result } from "../../../shared/types/Result";
import { BatchEntity, TimeSheetEntity } from "../types/ReportResponse";
import { keychainHelper, KeychainObject } from "@/shared/utils/keychainHelper";


//state
export type ReportState = {
    isLoading: boolean;
    error: string | null;
    startDate: Date;
    endDate: Date;
    reportTechnician: string;
    reportSales: string;
    reportTimeSheet: TimeSheetEntity[];
    reportBatchHistory: BatchEntity[];
    closeOut: string;
    json: KeychainObject | null;
    getReportTechnician: () => Promise<Result<string, Error>>;
    getReportSales: () => Promise<Result<string, Error>>;
    getReportTimeSheet: () => Promise<Result<TimeSheetEntity[], Error>>;
    getReportBatchHistory: () => Promise<Result<BatchEntity[], Error>>;
    getCloseOut: () => Promise<Result<string, Error>>;
}
//selector
export const reportSelectors = {
    selectIsLoading: (state: ReportState) => state.isLoading,
    selectError: (state: ReportState) => state.error,
    selectStartDate: (state: ReportState) => state.startDate,
    selectEndDate: (state: ReportState) => state.endDate,
    selectReportTechnician: (state: ReportState) => state.reportTechnician,
    selectReportSales: (state: ReportState) => state.reportSales,
    selectReportTimeSheet: (state: ReportState) => state.reportTimeSheet,
    selectReportBatchHistory: (state: ReportState) => state.reportBatchHistory,
    selectGetReportTechnician: (state: ReportState) => state.getReportTechnician,
    selectGetReportSales: (state: ReportState) => state.getReportSales,
    selectGetReportTimeSheet: (state: ReportState) => state.getReportTimeSheet,
    selectGetReportBatchHistory: (state: ReportState) => state.getReportBatchHistory,
    selectGetCloseOut: (state: ReportState) => state.getCloseOut,
    selectJson: (state: ReportState) => state.json,
    selectCloseOut: (state: ReportState) => state.closeOut,
}
//creator
const reportCreator : StateCreator<ReportState> = (set, get) => {
    const repository = new ReportRepositoryImplement();
    const usecase = new ReportUsecase(repository);
    
    return {
        isLoading: false,
        error: null,
        startDate: new Date(),
        endDate: new Date(),
        reportTechnician: "",
        reportSales: "",
        reportTimeSheet: [],
        reportBatchHistory: [],
        closeOut: "",
        json: null,
        getReportTechnician: async ():Promise<Result<string, Error>> => {
            set({ isLoading: true });
            const request: CommonRequest = {
                dateStart: get().startDate?.toYYYYMMDD('-'),
                dateEnd: get().endDate?.toYYYYMMDD('-'),
                employeeId: "",
            }
            const response = await usecase.getReportTechnician(request);
            if(isSuccess(response)) {
                set({ reportTechnician: response.value as string, isLoading: false });
            } else {
                set({ error: response.error.message, isLoading: false });
            }
            return response;
        },
        getReportSales: async ():Promise<Result<string, Error>> => {
            set({ isLoading: true });
            const request: CommonRequest = {
                dateStart: get().startDate?.toYYYYMMDD('-'),
                dateEnd: get().endDate?.toYYYYMMDD('-'),
            }
            const response = await usecase.getReportSales(request);
            if(isSuccess(response)) {
                set({ reportSales: response.value, isLoading: false });
            } else {
                set({ error: response.error.message, isLoading: false });
            }
            return response;
        },
        getReportTimeSheet: async ():Promise<Result<TimeSheetEntity[], Error>> => {
            set({ isLoading: true });
            const request: CommonRequest = {
                dateStart: get().startDate?.toYYYYMMDD('-'),
                dateEnd: get().endDate?.toYYYYMMDD('-'),
            }
            const response = await usecase.getReportTimeSheet(request);
            if(isSuccess(response)) {
                set({ reportTimeSheet: response.value, isLoading: false });
            } else {
                set({ error: response.error.message, isLoading: false });
            }
            return response;
        },
        getReportBatchHistory: async ():Promise<Result<BatchEntity[], Error>> => {
            set({ isLoading: true });
            const request: CommonRequest = {
                dateStart: get().startDate?.toYYYYMMDD('-'),
                dateEnd: get().endDate?.toYYYYMMDD('-'),
            }
            const response = await usecase.getReportBatchHistory(request);
            if(isSuccess(response)) {
                set({ reportBatchHistory: response.value, isLoading: false });
            } else {
                set({ error: response.error.message, isLoading: false });
            }
            return response;
        },
        getCloseOut: async ():Promise<Result<string, Error>> => {
            set({ isLoading: true });
            const employeeId = get().json?.employeeId??"";
            const request: CommonRequest = {
                dateStart: get().startDate?.toYYYYMMDD('-'),
                dateEnd: get().endDate?.toYYYYMMDD('-'),
                employeeId: employeeId,
            }
            const response = await usecase.getCloseOut(request);
            if(isSuccess(response)) {
                set({ closeOut: response.value, isLoading: false });
            } else {
                set({ error: response.error.message, isLoading: false });
            }
            return response;
        }
    }
}

export const useReportStore = create<ReportState>()(reportCreator)
