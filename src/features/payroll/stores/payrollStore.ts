import { create } from 'zustand';
import { PayrollUsecase } from '../usecases/PayrollUsecase';
import { TicketUsecase } from '../../ticket/usecase/TicketUsecase';
import { EmployeeEntity } from '../../ticket/types/TicketResponse';
import { failure, isSuccess, Result } from '../../../shared/types/Result';
import { TicketError } from '../../ticket/types/TicketError';
import { CommonRequest } from '../../../types/CommonRequest';
import { keychainHelper, KeychainObject } from '../../../shared/utils/keychainHelper';
import { appConfig } from '@/shared/utils/appConfig';

export type PayrollState = {
  payrolls: string;
  payrollOwners: string;
  isLoading: boolean;
  error: string | null;
  visible: boolean;
  selectedEmployee: EmployeeEntity | null;
  startDate: Date | null;
  endDate: Date | null;
  getPayroll: (employeeId: string) => Promise<Result<string, TicketError>>;
  getPayrollOwner: (employeeId: string) => Promise<Result<string, TicketError>>;
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
};

// Refactor: nhận payrollUsecase, ticketUsecase từ ngoài vào
export const createPayrollStore = (payrollUsecase: PayrollUsecase, ticketUsecase: TicketUsecase) => (set: any, get: any) => ({
  ...initialState,
  getPayroll: async (employeeId: string) => {
      set({ isLoading: true, error: null });
      const json = await appConfig.getUser();
      let commonRequest: CommonRequest = {
          dateStart: get().startDate?.toYYYYMMDD('-'),
          dateEnd: get().endDate?.toYYYYMMDD('-'),
          employeeId: employeeId??json?.employeeId??"",
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
      const json = await appConfig.getUser();
      let commonRequest: CommonRequest = {
          dateStart: get().startDate?.toYYYYMMDD('-'),
          dateEnd: get().endDate?.toYYYYMMDD('-'),
          employeeId: employeeId??json?.employeeId??"",
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
      // Không lấy lại json từ keychainHelper nữa, json sẽ được truyền từ ngoài vào
  },
});

// Khởi tạo real usecase ở production
import { PayrollRepositoryImplement } from '../repositories/PayrollRepositoryImplement';
import { TicketRepositoryImplement } from '../../ticket/repositories/TicketRepositoryImplement';
import { TicketApi } from '../../ticket/services/TicketApi';
const realPayrollUsecase = new PayrollUsecase(new PayrollRepositoryImplement());
const realTicketUsecase = new TicketUsecase(new TicketRepositoryImplement(TicketApi));
export const usePayrollStore = create<PayrollState>()(createPayrollStore(realPayrollUsecase, realTicketUsecase)); 