import { create } from 'zustand';
import { ApptResResponse } from '../types/ApptResResponse';
import { Failure, isSuccess, Result, success, Success } from '../../../shared/types/Result';
import { ApiAuthRepository } from '@/features/auth/repositories';
import { AppointmentRepositoryImplement } from '../repositories/AppointmentRepositoryImplement';
import { AppointmentUsecase } from '../usecases/AppointmentUsecase';
import { CustomerEntity, CustomerResponse } from '../types/CustomerResponse';
import type { CustomerPayload } from '../types/CustomerResponse';
export type ServicesEntity = {
  service?: MenuItemEntity|null
  technician?: EmployeeEntity|null
}
export type CreateAppointmentState = {
  customerList: CustomerEntity[] | null;
  selectedCustomer: CustomerEntity | null;
  service: string | null;
  date: Date | null;
  time: Date | null;
  confirmOnline: boolean;
  groupAppointment: boolean;
  isLoading: boolean;
  selectedApptType: ApptType| null;
  listApptType: ApptType[];
  listCategories: CategoryEntity[];
  listItemMenu: MenuItemEntity[];
  listServices: ServicesEntity[];
  getListCategories: ()=> Promise<Result<CategoryEntity[], Error>>;
  getListItemMenu: ()=> Promise<Result<MenuItemEntity[], Error>>
  setService: (service: string | null) => void;
  setDate: (date: Date | null) => void;
  setTime: (time: Date | null) => void;
  setConfirmOnline: (value: boolean) => void;
  setGroupAppointment: (value: boolean) => void;
  reset: () => void;
  setSelectedCustomer: (value: CustomerEntity)=> void,
  getApptResource: () => Promise<Result<ApptResResponse, Error>>;
  getCustomerLookup: (pageNumber?: number, pageSize?: number, phoneNumber?: string) => Promise<Result<CustomerResponse, Error>>;
};

import { ApptType, createApptType } from '../types/AppointmentType';
import { CategoriesResponse, CategoryEntity } from '../types/CategoriesResponse';
import { MenuItemEntity } from '../types/MenuItemResponse';
import { TedTechnician } from '../types/AppointmentResponse';
import { EmployeeEntity } from '@/features/ticket/types/TicketResponse';


export const initialCreateAppointmentState = {
  customerList: null,
  service: null,
  date: null,
  time: null,
  confirmOnline: false,
  groupAppointment: false,
  isLoading: false,
  selectedCustomer: null,
  selectedApptType: null,
  listCategories: [],
  listItemMenu: [],
  listApptType: [
    createApptType("Misc", "Misc",),
    createApptType("NewCustomer", "New Customer", ),
    createApptType("Request", "Choose Tech"),
    createApptType("NonRequest", "Any Tech",),
    createApptType("WalkIn", "Walk In"),
    createApptType("Online", "Online"),
  ],
  listServices: [{
    service: null,
    technician:null
  }]
};
const appointmentRepository = new AppointmentRepositoryImplement();
const appointmentUsecase = new AppointmentUsecase(appointmentRepository);
const createAppointmentCreator = (set: any, get:any) => ({
  ...initialCreateAppointmentState,
  setService: (service: string | null) => set({ service }),
  setDate: (date: Date | null) => set({ date }),
  setTime: (time: Date | null) => set({ time }),
  setConfirmOnline: (value: boolean) => set({ confirmOnline: value }),
  setGroupAppointment: (value: boolean) => set({ groupAppointment: value }),
  reset: () => set({ ...initialCreateAppointmentState }),
  getApptResource: () => {
    return appointmentUsecase.getApptResource();
  },
  setSelectedCustomer: (value:CustomerEntity)=>{
    set({selectedCustomer: value})
  },
  getListCategories: async () =>{
    if(get().listCategories.length > 0)
      return success(get().listCategories)
    set({ isLoading: true });
    const result = await appointmentUsecase.getCategories();
    if(isSuccess(result)) {
      set({ listCategories: result.value});
    }
    set({ isLoading: false });
    return result; 
  },
  getListItemMenu: async () =>{
    if(get().listItemMenu.length > 0)
      return success(get().listItemMenu)
    set({ isLoading: true });
    const result = await appointmentUsecase.getMenuItems();
    if(isSuccess(result)) {
      set({ listItemMenu: result.value});
    }
    set({ isLoading: false });
    return result; 
  },
  getCustomerLookup: async (pageNumber: number = 1, pageSize: number = 10, phoneNumber: string = '') => {
    set({ isLoading: true });
    const payload: CustomerPayload = {
      pageNumber,
      pageSize,
      phoneNumber: phoneNumber,
    };
    const result = await appointmentUsecase.customers(payload);
    if(isSuccess(result)) {
      set({ customerList: result.value.dataSource });
    }
    set({ isLoading: false });
    return result; 
  },
});

export const useCreateAppointmentStore = create<CreateAppointmentState>(createAppointmentCreator);

export const createAppointmentSelectors = {
  selectSelectedCustomer: (state: CreateAppointmentState) => state.selectedCustomer,
  selectCustomerList: (state: CreateAppointmentState) => state.customerList,
  selectService: (state: CreateAppointmentState) => state.service,
  selectDate: (state: CreateAppointmentState) => state.date,
  selectTime: (state: CreateAppointmentState) => state.time,
  selectListApptType: (state: CreateAppointmentState)=>state.listApptType,
  selectIsLoading: (state: CreateAppointmentState)=>state.isLoading,
  selectConfirmOnline: (state: CreateAppointmentState) => state.confirmOnline,
  selectGroupAppointment: (state: CreateAppointmentState) => state.groupAppointment,
  selectGetApptResource: (state: CreateAppointmentState) => state.getApptResource,
  selectGetCustomerLookup: (state: CreateAppointmentState) => state.getCustomerLookup,
  selectSetSelectedCustomer: (state: CreateAppointmentState) => state.setSelectedCustomer,
  selectSelectedApptType: (state: CreateAppointmentState) => state.selectedApptType,
  selectListCategories: (state: CreateAppointmentState) => state.listCategories,
  selectListItemMenu: (state: CreateAppointmentState) => state.listItemMenu,
  selectGetListItemMenu: (state: CreateAppointmentState) => state.getListItemMenu,
  selectGetListCategories: (state: CreateAppointmentState) => state.getListCategories,
  selectListService: (state: CreateAppointmentState) => state.listServices
}; 

