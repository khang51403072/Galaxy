import { create } from 'zustand';
import { StateCreator } from 'zustand/vanilla';
import { PayrollRepositoryImplement } from '../repositories/PayrollRepositoryImplement';
import { PayrollUsecase } from '../usecases/PayrollUsecase';
import { EmployeeEntity } from '../../ticket/types/TicketResponse';
import { failure, isSuccess, Result } from '../../../shared/types/Result';
import { TicketError } from '../../ticket/types/TicketError';
import { TicketUsecase } from '../../ticket/usecase/TicketUsecase';
import { TicketApi } from '../../ticket/services/TicketApi';
import { TicketRepositoryImplement } from '../../ticket/repositories/TicketRepositoryImplement';
import { CommonRequest } from '../../../types/CommonRequest';
import { keychainHelper, KeychainObject } from '../../../shared/utils/keychainHelper';
export type PayrollState = {
  employeeLookup: EmployeeEntity[];
  payrolls: string;
  payrollOwners: string;
  isLoading: boolean;
  error: string | null;
  visible: boolean;
  selectedEmployee: EmployeeEntity | null;
  startDate: Date | null;
  endDate: Date | null;
  json: KeychainObject | null;
  getPayroll: (employeeId: string) => Promise<Result<string, TicketError>>;
  getPayrollOwner: (employeeId: string) => Promise<Result<string, TicketError>>;
  getEmployeeLookup: () => Promise<Result<EmployeeEntity[], TicketError>>;
  reset: () => void;
};

export const payrollSelectors = {
  selectPayrolls: (state: PayrollState) => state.payrolls,
  selectPayrollOwners: (state: PayrollState) => state.payrollOwners,
  selectIsLoading: (state: PayrollState) => state.isLoading,
  selectError: (state: PayrollState) => state.error,
  selectVisible: (state: PayrollState) => state.visible,
  selectSelectedEmployee: (state: PayrollState) => state.selectedEmployee,
  selectStartDate: (state: PayrollState) => state.startDate,
  selectEndDate: (state: PayrollState) => state.endDate,
  selectGetPayroll: (state: PayrollState) => state.getPayroll,
  selectGetPayrollOwner: (state: PayrollState) => state.getPayrollOwner,
  selectGetEmployeeLookup: (state: PayrollState) => state.getEmployeeLookup,
};

const initialState = {
  payrolls: "",
  payrollOwners: "",
  isLoading: false,
  error: null,
  visible: false,
  selectedEmployee: null,
  startDate: null,
  endDate: null,
  employeeLookup: [],
  json: null,
};

const payrollCreator: StateCreator<PayrollState> = (set, get) => {
  const payrollRepository = new PayrollRepositoryImplement();
  const payrollUsecase = new PayrollUsecase(payrollRepository);
  const ticketRepository = new TicketRepositoryImplement(TicketApi);
  const ticketUsecase = new TicketUsecase(ticketRepository);
  return {
    ...initialState,
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
    getPayroll: async (employeeId: string) => {
        set({ isLoading: true, error: null });
        
        
        let commonRequest: CommonRequest = {
            dateStart: get().startDate?.toYYYYMMDD('-'),
            dateEnd: get().endDate?.toYYYYMMDD('-'),
            employeeId: employeeId??"",
        }
        const result = await payrollUsecase.getPayroll(commonRequest);
        if(isSuccess(result)) {
            set({ payrolls: result.value as string, isLoading: false });
        } else {
            set({ error: result.error.message, isLoading: false });
        }
        return result;
    },
    getPayrollOwner: async (employeeId: string) => {
        set({ isLoading: true, error: null });
        let commonRequest: CommonRequest = {
            dateStart: get().startDate?.toYYYYMMDD('-'),
            dateEnd: get().endDate?.toYYYYMMDD('-'),
            employeeId: employeeId??"",
        }
        const result = await payrollUsecase.getPayrollOwner(commonRequest);
        if(isSuccess(result)) {
        set({ payrollOwners: result.value as string, isLoading: false });
        } else {
            set({ error: result.error.message, isLoading: false });
        }
        
        return result;
    },
    reset: () => {
        set({ ...initialState });
        keychainHelper.getObject().then((json) => {
            set({json: json});
          });
    },
  };
};

export const usePayrollStore = create<PayrollState>(payrollCreator); 