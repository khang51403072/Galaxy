import { create } from 'zustand';
import { ApptResResponse } from '../types/ApptResResponse';
import { isSuccess, Result } from '../../../shared/types/Result';
import { ApiAuthRepository } from '@/features/auth/repositories';
import { AppointmentRepositoryImplement } from '../repositories/AppointmentRepositoryImplement';
import { AppointmentUsecase } from '../usecases/AppointmentUsecase';
import { CustomerEntity, CustomerResponse } from '../types/CustomerResponse';
import type { CustomerPayload } from '../types/CustomerResponse';

export type CreateAppointmentState = {
  customerList: CustomerEntity[] | null;
  selectedCustomer: CustomerEntity | null;
  service: string | null;
  date: Date | null;
  time: Date | null;
  confirmOnline: boolean;
  groupAppointment: boolean;
  isLoading: boolean;
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

import { createApptType } from '../types/AppointmentType';


export const initialCreateAppointmentState = {
  customerList: null,
  service: null,
  date: null,
  time: null,
  confirmOnline: false,
  groupAppointment: false,
  isLoading: false,
  selectedCustomer: null
};
const appointmentRepository = new AppointmentRepositoryImplement();
const appointmentUsecase = new AppointmentUsecase(appointmentRepository);
const createAppointmentCreator = (set: any) => ({
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
  selectConfirmOnline: (state: CreateAppointmentState) => state.confirmOnline,
  selectGroupAppointment: (state: CreateAppointmentState) => state.groupAppointment,
  selectGetApptResource: (state: CreateAppointmentState) => state.getApptResource,
  selectGetCustomerLookup: (state: CreateAppointmentState) => state.getCustomerLookup,
  selectSetSelectedCustomer: (state: CreateAppointmentState) => state.setSelectedCustomer,

}; 

function CustomerPayload(pageNumber: any, arg1: number, pageSize: any, arg3: number, phoneNumber: any, arg5: string) {
    throw new Error('Function not implemented.');
}
