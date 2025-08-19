import { create } from 'zustand';
import { EmployeeEntity } from '@/features/ticket/types/TicketResponse';

type UIState = {
  showServiceSheet: boolean;
  isShowTechnician: boolean;
  serviceIndex: number;
  comboIndex: number;
  employeeForAvailable: EmployeeEntity[];
  
  // Actions
  setShowServiceSheet: (value: boolean) => void;
  setIsShowTechnician: (value: boolean) => void;
  setServiceIndex: (index: number) => void;
  setComboIndex: (index: number) => void;
  setEmployeeForAvailable: (employees: EmployeeEntity[]) => void;
  openTechnicianSheet: (params: {
    employees: EmployeeEntity[];
    serviceIndex: number;
    comboIndex?: number;
  }) => void;
  resetUI: () => void;
};

const initialUIState = {
  showServiceSheet: false,
  isShowTechnician: false,
  serviceIndex: 0,
  comboIndex: -1,
  employeeForAvailable: [],
};

export const useCreateAppointmentUIStore = create<UIState>((set) => ({
  ...initialUIState,
  setShowServiceSheet: (value) => set({ showServiceSheet: value }),
  setIsShowTechnician: (value) => set({ isShowTechnician: value }),
  setServiceIndex: (index) => set({ serviceIndex: index }),
  setComboIndex: (index) => set({ comboIndex: index }),
  setEmployeeForAvailable: (employees) => set({ employeeForAvailable: employees }),
  
  openTechnicianSheet: ({ employees, serviceIndex, comboIndex = -1 }) => {
    set({
      employeeForAvailable: employees,
      serviceIndex,
      comboIndex,
      isShowTechnician: true,
    });
  },
  
  resetUI: () => set(initialUIState),
}));

// --- Selectors ---
// BỔ SUNG: Thêm object selectors để component sử dụng
export const uiSelectors = {
  selectShowServiceSheet: (state: UIState) => state.showServiceSheet,
  selectIsShowTechnician: (state: UIState) => state.isShowTechnician,
  selectServiceIndex: (state: UIState) => state.serviceIndex,
  selectComboIndex: (state: UIState) => state.comboIndex,
  selectEmployeeForAvailable: (state: UIState) => state.employeeForAvailable,
  
  // Actions
  selectSetShowServiceSheet: (state: UIState) => state.setShowServiceSheet,
  selectSetIsShowTechnician: (state: UIState) => state.setIsShowTechnician,
  selectOpenTechnicianSheet: (state: UIState) => state.openTechnicianSheet,

  // Selector tiện ích: Lấy tất cả state và action, dùng với useShallow
  selectAll: (state: UIState) => state,
};