import { CommonRequest } from "@/types/CommonRequest";
import { create, StateCreator } from "zustand";
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
    reportBatchHistory: BatchEntity[];
    closeOut: string;
    json: KeychainObject | null;
    closeOutOwner?: CloseOutOwnerModel;
    loadData: () => void;
    reset: () => void;
    setStartDate: (date: Date) => void;
    setEndDate: (date: Date) => void
}
//selector
export const reportSelectors = {
    selectIsLoading: (state: ReportState) => state.isLoading,
    selectError: (state: ReportState) => state.error,
    selectStartDate: (state: ReportState) => state.startDate,
    selectEndDate: (state: ReportState) => state.endDate,
    selectReportBatchHistory: (state: ReportState) => state.reportBatchHistory,
    selectJson: (state: ReportState) => state.json,
    selectCloseOut: (state: ReportState) => state.closeOut,
    
}
// Refactor: nhận reportUsecase từ ngoài vào
const initState = {
    isLoading: false,
    error: null,
    startDate: new Date(),
    endDate: new Date(),
    reportBatchHistory: [],
    closeOut: "",
    json: null,
    closeOutOwner: undefined,
}
export const createReportStore = (usecase: ReportUsecase): StateCreator<ReportState> => (set, get) => ({
    ...initState,
     reset: () => {
        set({...initState})
    },
    setStartDate: (date: Date) => set({startDate: date}),
    setEndDate: (date: Date) => set({endDate: date}),
    loadData: async () => {
        const user = await appConfig.getUser();
        const request: CommonRequest = {
            dateStart: get().startDate?.format("yyyy-MM-dd"),
            dateEnd: get().endDate?.format("yyyy-MM-dd"),
            employeeId: user.employeeId??"",
        }
        const newStateUpdate: Partial<ReportState> = { isLoading: false, json:user }; 
        var messageError = ""
        if(user?.isOwner){
            set({ isLoading: true, });
            const [rsCloseOut, rsBatch] = await Promise.all([
                usecase.getCloseOutOwner(request),
                usecase.getReportBatchHistory(request)
            ])
            if(isSuccess(rsCloseOut)) {
                newStateUpdate.closeOutOwner = rsCloseOut.value
            } 
            else{
                messageError += `${rsCloseOut.error.message} \n`
            }
            if(isSuccess(rsBatch)) {
                newStateUpdate.reportBatchHistory = rsBatch.value
            } 
            else{
                messageError += `${rsBatch.error.message} \n`
            }
        } else{
            set({ isLoading: true });
            const response = await usecase.getCloseOut(request);
            if(isSuccess(response)) {
                newStateUpdate.closeOut = response.value
            } else {
                messageError = response.error.message
            }
            user
        }
        set({...newStateUpdate, error: messageError})
   }
});

// Khởi tạo real usecase ở production
import { ReportRepositoryImplement } from "../repositories/ReportRepositoryImplement";
import { CloseOutOwnerModel } from "../types/closeOutResponse";
import { appConfig } from "@/shared/utils/appConfig";
const realReportUsecase = new ReportUsecase(new ReportRepositoryImplement());
export const useReportStore = create<ReportState>()(createReportStore(realReportUsecase));
