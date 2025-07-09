import { create } from "zustand";
import { TicketApi } from "../services/TicketApi";
import { TicketRepositoryImplement } from "../repositories/TicketRepositoryImplement";
import { TicketUsecase } from "../usecase/TicketUsecase";
import { EmployeeEntity, WorkOrderEntity } from "../types/TicketResponse";
import { TicketError } from "../types/TicketError";
import { failure, isSuccess, Result } from "../../../shared/types/Result";
import { createStore, StateCreator } from "zustand/vanilla";
import { keychainHelper, KeychainObject } from "../../../shared/utils/keychainHelper";

export type TicketState = {
    employeeLookup: EmployeeEntity[];
    workOrders: WorkOrderEntity[];
    workOrderOwners: WorkOrderEntity[];
    isLoading: boolean;
    startDate: Date;
    endDate: Date;
    selectedEmployee: EmployeeEntity | null;
    error: string | null;
    visible: boolean;
    json: KeychainObject | null;
    getEmployeeLookup: () => Promise<Result<EmployeeEntity[], TicketError>>;
    getWorkOrders: () => Promise<Result<WorkOrderEntity[], TicketError>>;
    getWorkOrderOwners: (employeeId: string) => Promise<Result<WorkOrderEntity[], TicketError>>;
}

export const ticketSelectors = {
    selectEmployeeLookup: (state: TicketState) => state.employeeLookup,
    selectWorkOrders: (state: TicketState) => state.workOrders,
    selectWorkOrderOwners: (state: TicketState) => state.workOrderOwners,
    selectIsLoading: (state : TicketState) => state.isLoading,
    selectError: (state: TicketState) => state.error,
    selectGetEmployeeLookup: (state: TicketState) => state.getEmployeeLookup,
    selectGetWorkOrders: (state: TicketState) => state.getWorkOrders,
    selectGetWorkOrderOwners: (state: TicketState) => state.getWorkOrderOwners,
    selectVisible: (state: TicketState) => state.visible,
    selectStartDate: (state: TicketState) => state.startDate,
    selectEndDate: (state: TicketState) => state.endDate,
    selectSelectedEmployee: (state: TicketState) => state.selectedEmployee,
    selectJson: (state: TicketState) => state.json,
}

const initialTicketState = {
    employeeLookup: [],
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

const ticketCreator : StateCreator<TicketState & { reset: () => void }> = (set, get) => {
    let ticketRepository = new TicketRepositoryImplement(TicketApi);
    let ticketUsecase = new TicketUsecase(ticketRepository);
    return {
        ...initialTicketState,
        getEmployeeLookup: async () : Promise<Result<EmployeeEntity[], TicketError>> => {
            set({ isLoading: true });
            const result = await ticketUsecase.getEmployeeLookup();
            if(isSuccess(result)) {
                set({ employeeLookup: result.value });
            } else {
                set({ error: result.error });
            }
            set({ isLoading: false });
            return result;
        },
        getWorkOrders: async () : Promise<Result<WorkOrderEntity[], TicketError>> => {
            set({ isLoading: true });
            console.log('getWorkOrders', get().startDate, get().endDate, get().selectedEmployee?.id);
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
    }
}

export const useTicketStore = create<TicketState & { reset: () => void }> (ticketCreator);



