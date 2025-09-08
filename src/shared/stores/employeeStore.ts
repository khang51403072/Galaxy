import { create } from 'zustand';
import { EmployeeEntity } from '@/features/ticket/types/TicketResponse';
import { TicketApi } from '@/features/ticket/services/TicketApi';

// Tạo một object "All" tĩnh để tái sử dụng
export const ALL_EMPLOYEES_OPTION: EmployeeEntity = {
  __type: 'employee',
  id: '',
  firstName: "All",
  lastName: "",
  nickName: "",
  image: "",
  avatar: "",
  isUnassigned: false,
};


export type EmployeeStoreState = {
  employees: EmployeeEntity[];
  isLoading: boolean;
  error: string | null;
  fetchEmployees: (force?: boolean) => Promise<void>;
};

export const useEmployeeStore = create<EmployeeStoreState>((set, get) => ({
  employees: [],
  isLoading: false,
  error: null,
  async fetchEmployees(force = false) {
    if (get().employees.length > 0 && !force) return;
    set({ isLoading: true, error: null });
    try {
      const res = await TicketApi.getEmployeeLookup();
      if (res.result && res.data) {
        set({ employees: res.data, isLoading: false });
      } else {
        set({ error: res.errorMsg || 'Unknown error', isLoading: false });
      }
    } catch (e: any) {
      set({ error: e.message || 'Unknown error', isLoading: false });
    }
  },
}));

export const employeeSelectors = {
  selectEmployees: (state: EmployeeStoreState) => state.employees,
  selectIsLoading: (state: EmployeeStoreState) => state.isLoading,
  selectError: (state: EmployeeStoreState) => state.error,
  selectFetchEmployees: (state: EmployeeStoreState) => state.fetchEmployees,
}; 