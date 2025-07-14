import { create } from "zustand";
import { TicketUsecase } from "../usecase/TicketUsecase";
import { EmployeeEntity, WorkOrderEntity } from "../types/TicketResponse";
import { TicketError } from "../types/TicketError";
import { failure, isSuccess, Result } from "../../../shared/types/Result";
import { StateCreator } from "zustand/vanilla";
import { keychainHelper, KeychainObject } from "../../../shared/utils/keychainHelper";

export type TicketState = {
    workOrders: WorkOrderEntity[];
    workOrderOwners: WorkOrderEntity[];
    isLoading: boolean;
    startDate: Date;
    endDate: Date;
    selectedEmployee: EmployeeEntity | null;
    error: string | null;
    visible: boolean;
    json: KeychainObject | null;
    getWorkOrders: () => Promise<Result<WorkOrderEntity[], TicketError>>;
    getWorkOrderOwners: (employeeId: string) => Promise<Result<WorkOrderEntity[], TicketError>>;
    reset: () => void;
}

export const ticketSelectors = {
    selectWorkOrders: (state: TicketState) => state.workOrders,
    selectWorkOrderOwners: (state: TicketState) => state.workOrderOwners,
    selectIsLoading: (state : TicketState) => state.isLoading,
    selectError: (state: TicketState) => state.error,
    selectGetWorkOrders: (state: TicketState) => state.getWorkOrders,
    selectGetWorkOrderOwners: (state: TicketState) => state.getWorkOrderOwners,
    selectVisible: (state: TicketState) => state.visible,
    selectStartDate: (state: TicketState) => state.startDate,
    selectEndDate: (state: TicketState) => state.endDate,
    selectSelectedEmployee: (state: TicketState) => state.selectedEmployee,
    selectJson: (state: TicketState) => state.json,
}

const initialTicketState = {
    workOrders: [],
    workOrderOwners: [],
    isLoading: false,
    error: null,
    visible: false,
    startDate: new Date(Date.now()),
    endDate: new Date(Date.now()),
    selectedEmployee: null,
    json: null,
};

export const createTicketStore = (ticketUsecase: TicketUsecase): StateCreator<TicketState> => (set, get) => ({
    ...initialTicketState,
    getWorkOrders: async () : Promise<Result<WorkOrderEntity[], TicketError>> => {
        set({ isLoading: true });
        const json = await keychainHelper.getObject();
        if(json==null) {
            set({ error: 'User not found' });
            set({ isLoading: false });
            return failure(new TicketError('User not found', 'USER_NOT_FOUND'));
        }
        const result = await ticketUsecase.getWorkOrders({
            employeeId: get().selectedEmployee?.id??json?.employeeId??'',
            dateStart: get().startDate.toYYYYMMDD('-'),
            dateEnd: get().endDate.toYYYYMMDD('-'),
        });
        if(isSuccess(result)) {
            set({ workOrders: result.value });
        } else {
            set({ error: result.error });
        }
        set({ isLoading: false });
        return result;
    },
    getWorkOrderOwners: async (employeeId: string) : Promise<Result<WorkOrderEntity[], TicketError>> => {
        set({ isLoading: true });
        const json = await keychainHelper.getObject();
        if(json==null) {
            set({ error: 'User not found' });
            set({ isLoading: false });
            return failure(new TicketError('User not found', 'USER_NOT_FOUND'));
        }
        const result = await ticketUsecase.getWorkOrderOwner({
            employeeId: employeeId,
            dateStart: get().startDate.toYYYYMMDD('-'),
            dateEnd: get().endDate.toYYYYMMDD('-'),
        });
        if(isSuccess(result)) {
            set({ workOrderOwners: result.value });
        } else {
            set({ error: result.error });
        }
        set({ isLoading: false });
        return result;
    },
    reset: () => {
        set({ ...initialTicketState });
        keychainHelper.getObject().then((json) => {
            set({json: json});
        });
    },
});

// Khởi tạo real usecase ở production
import { TicketRepositoryImplement } from "../repositories/TicketRepositoryImplement";
import { TicketApi } from "../services/TicketApi";
const realTicketUsecase = new TicketUsecase(new TicketRepositoryImplement(TicketApi));
export const useTicketStore = create<TicketState>()(createTicketStore(realTicketUsecase));



