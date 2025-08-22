import { create } from 'zustand';
import { EmployeeEntity } from '@/features/ticket/types/TicketResponse';

// --- STATE AND ACTIONS TYPE ---
export type AppointmentUIState = {
  showServiceSheet: boolean;
  employeeForAvailable: EmployeeEntity[];
  serviceIndex: number;
  comboIndex: number;
  isShowTechnician: boolean;

  // --- ACTIONS ---
  setShowServiceSheet: (value: boolean) => void;
  openServiceSheet: (serviceIndex: number) => void;
  setEmployeeForAvailable: (employees: EmployeeEntity[]) => void;
  setServiceIndex: (index: number) => void;
  setComboIndex: (index: number) => void;
  setIsShowTechnician: (value: boolean) => void;
  openTechnicianSheet: (config: { employees: EmployeeEntity[]; serviceIndex: number; comboIndex?: number }) => void;
  closeTechnicianSheet: () => void;
};

// --- INITIAL STATE ---
export const initialUIState = {
  showServiceSheet: false,
  employeeForAvailable: [],
  serviceIndex: 0,
  comboIndex: -1,
  isShowTechnician: false,
};

// --- STORE CREATION ---
export const useAppointmentUIStore = create<AppointmentUIState>((set) => ({
  ...initialUIState,

  // --- SETTERS AND ACTIONS ---
  setShowServiceSheet: (value: boolean) => set({ showServiceSheet: value }),
  openServiceSheet: (serviceIndex: number) => set({ showServiceSheet: true, serviceIndex }),

  setEmployeeForAvailable: (employees: EmployeeEntity[]) => set({ employeeForAvailable: employees }),
  
  setServiceIndex: (index: number) => set({ serviceIndex: index }),
  setComboIndex: (index: number) => set({ comboIndex: index }),

  setIsShowTechnician: (value: boolean) => set({ isShowTechnician: value }),

  openTechnicianSheet: ({ employees, serviceIndex, comboIndex = -1 }) =>
    set({
      isShowTechnician: true,
      employeeForAvailable: employees,
      serviceIndex,
      comboIndex,
    }),
  
  closeTechnicianSheet: () => set({ isShowTechnician: false, employeeForAvailable: [], comboIndex: -1 }),
}));


// --- SELECTORS ---
export const appointmentUISelectors = {
  showServiceSheet: (state: AppointmentUIState) => state.showServiceSheet,
  employeeForAvailable: (state: AppointmentUIState) => state.employeeForAvailable,
  serviceIndex: (state: AppointmentUIState) => state.serviceIndex,
  comboIndex: (state: AppointmentUIState) => state.comboIndex,
  isShowTechnician: (state: AppointmentUIState) => state.isShowTechnician,

  // actions
  actions: (state: AppointmentUIState) => ({
    setShowServiceSheet: state.setShowServiceSheet,
    openServiceSheet: state.openServiceSheet,
    setEmployeeForAvailable: state.setEmployeeForAvailable,
    openTechnicianSheet: state.openTechnicianSheet,
    closeTechnicianSheet: state.closeTechnicianSheet,
  }),
};