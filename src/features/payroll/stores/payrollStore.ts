import { create } from 'zustand';
import { PayrollUsecase } from '../usecases/PayrollUsecase';
import { TicketUsecase } from '../../ticket/usecase/TicketUsecase';
import { EmployeeEntity } from '../../ticket/types/TicketResponse';
import { failure, isSuccess, Result } from '../../../shared/types/Result';
import { TicketError } from '../../ticket/types/TicketError';
import { CommonRequest } from '../../../types/CommonRequest';
import { KeychainObject } from '../../../shared/utils/keychainHelper';
import { appConfig } from '@/shared/utils/appConfig';

export type PayrollState = {
  payrolls: string;
  payrollOwners: string;
  isLoading: boolean;
  error: string | null;
  visible: boolean;
  selectedEmployee: EmployeeEntity;
  startDate: Date ;
  endDate: Date ;
  json?: KeychainObject;
  getPayroll: () => Promise<Result<string, TicketError>>;
  getPayrollOwner: () => Promise<Result<string, TicketError>>;
  reset: () => void;
  setStartDate: (date: Date) => void
  setEndDate: (date: Date) => void
  setSelectedEmployee: (emp: EmployeeEntity) => void
  setVisible: (v: boolean) => void
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
  selectedEmployee: ALL_EMPLOYEES_OPTION,
  startDate: new Date(),
  endDate: new Date(),
  json: undefined
};

// Refactor: nhận payrollUsecase, ticketUsecase từ ngoài vào
export const createPayrollStore = (payrollUsecase: PayrollUsecase) => (set: any, get: any) => ({
  ...initialState,
  getPayroll: async () => {
      set({ isLoading: true, error: null });
      const json = await appConfig.getUser();
      let commonRequest: CommonRequest = {
          dateStart: get().startDate?.format("yyyy-MM-dd"),
          dateEnd: get().endDate?.format("yyyy-MM-dd"),
          employeeId: json?.employeeId,
      }
      const result = await payrollUsecase.getPayroll(commonRequest);
      if(isSuccess(result)) {
          set({ payrolls: result.value as string, isLoading: false });
      } else {
          set({ error: result.error.message, isLoading: false });
      }
      return result;
  },
  getPayrollOwner: async () => {
      set({ isLoading: true, error: null });
      const json = await appConfig.getUser();
      let commonRequest: CommonRequest = {
          dateStart: get().startDate?.format("yyyy-MM-dd"),
          dateEnd: get().endDate?.format("yyyy-MM-dd"),
          employeeId: get().selectedEmployee.id??"",
      }
      const result = await payrollUsecase.getPayrollOwner(commonRequest);
      if(isSuccess(result)) {
      set({ payrollOwners: result.value as string, isLoading: false });
      } else {
          set({ error: result.error.message, isLoading: false });
      }
      return result;
  },
  reset: async () => {
      const user = await appConfig.getUser()
      set({ ...initialState, json: user });
      // Không lấy lại json từ keychainHelper nữa, json sẽ được truyền từ ngoài vào
  },
  setStartDate: (date: Date) => set({startDate: date}),
  setEndDate: (date: Date) => set({endDate:date}),
  setSelectedEmployee: (emp: EmployeeEntity) => set({selectedEmployee: emp}),
  setVisible: (v: boolean) => set({visible: v})
});

// Khởi tạo real usecase ở production
import { PayrollRepositoryImplement } from '../repositories/PayrollRepositoryImplement';
import { ALL_EMPLOYEES_OPTION } from '@/shared/stores/employeeStore';

const realPayrollUsecase = new PayrollUsecase(new PayrollRepositoryImplement());
export const usePayrollStore = create<PayrollState>()(createPayrollStore(realPayrollUsecase)); 