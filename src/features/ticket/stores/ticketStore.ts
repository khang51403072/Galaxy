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
    json: KeychainObject | null; // Thêm dòng này để fix linter
    getWorkOrders: () => Promise<Result<WorkOrderEntity[], TicketError>>;
    getWorkOrderOwners: (employeeId: string) => Promise<Result<WorkOrderEntity[], TicketError>>;
    reset: () => void;
    setJson: (json: KeychainObject) => void;
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
    selectSetJson:(state: TicketState) => state.setJson
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
    json: null, // Không lấy từ useHomeStore.getState().json nữa
};

export const createTicketStore = (ticketUsecase: TicketUsecase): StateCreator<TicketState> => (set, get) => ({
    ...initialTicketState,
    getWorkOrders: async () : Promise<Result<WorkOrderEntity[], TicketError>> => {
        set({ isLoading: true });
        // json nên truyền từ ngoài vào hoặc lấy từ store qua selector
        const json = get().json;
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
        const json = get().json;
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
    setJson: (json: KeychainObject) => set({ json }), // Action để nhận json từ ngoài vào
    reset: () => {
        set({ ...initialTicketState });
        // reset json về null hoặc lấy lại từ ngoài nếu cần
    },
});

// Khởi tạo real usecase ở production
import { TicketRepositoryImplement } from "../repositories/TicketRepositoryImplement";
import { TicketApi } from "../services/TicketApi";
import { useHomeStore } from "@/features/home/stores/homeStore";
const realTicketUsecase = new TicketUsecase(new TicketRepositoryImplement(TicketApi));
export const useTicketStore = create<TicketState>()(createTicketStore(realTicketUsecase));



