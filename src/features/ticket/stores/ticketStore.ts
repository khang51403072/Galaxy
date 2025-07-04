import { create } from "zustand";
import { TicketApi } from "../services/TicketApi";
import { TicketRepositoryImplement } from "../repositories/TicketRepositoryImplement";
import { TicketUsecase } from "../usecase/TicketUsecase";
import { EmployeeEntity } from "../types/TicketResponse";
import { TicketError } from "../types/TicketError";
import { isSuccess, Result } from "../../../shared/types/Result";
import { createStore, StateCreator } from "zustand/vanilla";

export type TicketState = {
    employeeLookup: EmployeeEntity[];
    isLoading: boolean;
    error: string | null;
    visible: boolean;
    getEmployeeLookup: () => Promise<Result<EmployeeEntity[], TicketError>>;
}

export const ticketSelectors = {
    selectEmployeeLookup: (state: TicketState) => state.employeeLookup,
    selectIsLoading: (state : TicketState) => state.isLoading,
    selectError: (state: TicketState) => state.error,
    selectGetEmployeeLookup: (state: TicketState) => state.getEmployeeLookup,
    selectVisible: (state: TicketState) => state.visible,
}

const ticketCreator : StateCreator<TicketState> = (set, get) => {
    let ticketRepository = new TicketRepositoryImplement(TicketApi);
    let ticketUsecase = new TicketUsecase(ticketRepository);
    return {
        employeeLookup: [],
        isLoading: false,
        error: null,
        visible: false,
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
        }
    }
}

export const useTicketStore = create<TicketState> (ticketCreator);



