import { create } from 'zustand';
import { ApptResResponse } from '../types/ApptResResponse';
import { failure, isSuccess, Result, success } from '../../../shared/types/Result';
import { AppointmentRepositoryImplement } from '../repositories/AppointmentRepositoryImplement';
import { AppointmentUsecase } from '../usecases/AppointmentUsecase';
import { CustomerEntity, CustomerResponse } from '../types/CustomerResponse';
import type { CustomerPayload } from '../types/CustomerResponse';
import { ApptType, createApptType } from '../types/AppointmentType';
import { CategoryEntity } from '../types/CategoriesResponse';
import { MenuItemEntity } from '../types/MenuItemResponse';
import { EmployeeEntity } from '@/features/ticket/types/TicketResponse';
import { ApptPackageItem, ApptPayload, ApptServiceItem, DataAppt, StartTime } from '../types/ApptSaveResponse';
import { useAppointmentStore } from './appointmentStore';
import { dateFromTimeEntity, TimeEntity, TimeRange } from '../types/CompanyProfileResponse';
import { ApptServicePackage } from '../types/ApptDetailsResponse';
import { appConfig } from '@/shared/utils/appConfig';

export type ServicesEntity = {
  service?: MenuItemEntity|null
  technician?: EmployeeEntity|null
}
export type CreateAppointmentState = {
  error: string | null;
  isLoading: boolean;
  customerList: CustomerEntity[] | null;
  selectedCustomer: CustomerEntity | null;  
  isConfirmOnline: boolean;
  isGroupAppointment: boolean;
  selectedApptType: ApptType| null;
  listApptType: ApptType[];
  listCategories: CategoryEntity[];
  listItemMenu: MenuItemEntity[];
  listBookingServices: ServicesEntity[];
  selectedDate: Date;
  isAllowBookAnyway: boolean;
  reset: () => void;
  ///GET
  getListCategories: ()=> Promise<Result<CategoryEntity[], Error>>;
  getListItemMenu: ()=> Promise<Result<MenuItemEntity[], Error>>
  getApptResource: () => Promise<Result<ApptResResponse, Error>>;
  getCustomerLookup: (pageNumber?: number, pageSize?: number, phoneNumber?: string) => Promise<Result<CustomerResponse, Error>>;
  ///SET
  setIsConfirmOnline: (value: boolean) => void;
  setIsGroupAppt: (value: boolean) => void;
  setSelectedCustomer: (value: CustomerEntity)=> void,
  setSelectedDate: (value: Date)=> void,
  //
  saveAppointment: ()=> Promise<Result<DataAppt, Error>>;
  setIsAllowBookAnyway: (value: boolean)=> void;
};



export const initialCreateAppointmentState = {
  isLoading: false,
  error: null,
  
  isConfirmOnline: false,
  isGroupAppointment: false,
  selectedCustomer: null,
  selectedApptType: null,
  selectedDate: new Date(),
  isAllowBookAnyway: false,
  
  listApptType: [
    createApptType("Misc", "Misc",),
    createApptType("NewCustomer", "New Customer", ),
    createApptType("Request", "Choose Tech"),
    createApptType("NonRequest", "Any Tech",),
    createApptType("WalkIn", "Walk In"),
    createApptType("Online", "Online"),
  ],
  listBookingServices: [{
    service: null,
    technician:null
  }]
};
const appointmentRepository = new AppointmentRepositoryImplement();
const appointmentUsecase = new AppointmentUsecase(appointmentRepository);
const createAppointmentCreator = (set: any, get:any) => ({
  ...initialCreateAppointmentState,
  listCategories: [],
  listItemMenu: [],
  customerList: [],
  setSelectedDate: (value: Date) => set({ selectedDate: value }),
  setIsConfirmOnline: (value: boolean) => set({ isConfirmOnline: value }),
  setIsGroupAppt: (value: boolean) => set({ isGroupAppointment: value }),
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
      set({ listCategories: result.value.filter(
        (e: CategoryEntity)=>e.categoryType === "Service" || e.isHide === false)});
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
  getCustomerLookup: async (pageNumber: number = 1, pageSize: number = 10000, phoneNumber: string = '') => {
    set({ isLoading: true });
    if(get().customerList?.length > 0){
      set({ isLoading: false });
      return success(get().customerList)
    }
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
  saveAppointment: async () => {
    set({ isLoading: true });
    if (!validBookings(get(), (msg: string) => set({ error: msg }))) {
      set({ isLoading: false });
      return Promise.resolve(failure(new Error(get.error)));
    }
    // Lấy businessHours từ store
    const businessHours = useAppointmentStore.getState().companyProfile?.data.businessHours;
    // Tính tổng thời lượng
    const totalDuration = get().listBookingServices.reduce((acc: number, item: ServicesEntity) => {
      return acc + (item.service?.duration || 0);
    }, 0);

    // Kiểm tra thời gian hợp lệ
    if (!isValidTime(get().selectedDate, totalDuration, businessHours, msg => set({ error: msg }))) {
      set({ isLoading: false });
      return Promise.resolve(failure(new Error(get().error)));
    }

  
    //
    //continue save
    const payloadSave: ApptPayload = {
      id: "",
      apptDate: get().selectedDate.toYYYYMMDD("-"),
      retentionType: get().selectedApptType?.id || "",
      isOnlineConfirm: get().isConfirmOnline,
      isGroupAppt: get().isGroupAppointment,
      apptStatus: "New",
      apptConfirmStatus: "None",
      apptServiceItems: getListApptServiceItems(get()),
      apptServicePackages: getListComboItems(get()),
      customer: {
        firstName: get().selectedCustomer?.firstName || "",
        lastName: get().selectedCustomer?.lastName || "",
        fullName: get().selectedCustomer?.fullName || "",
        id: get().selectedCustomer?.id || "",
        email: get().selectedCustomer?.email || "",
        cellPhone: get().selectedCustomer?.cellPhone || "",
      },
      customerNote: get().selectedCustomer.note,
      allowBookAnyway: get().isAllowBookAnyway
    }
    const result = await appointmentUsecase.saveAppointment(payloadSave);
    if(isSuccess(result)){  
      set({ isLoading: false });
    }
    else{
      set({ isLoading: false, error: result.error.message });
    }
    
    return result;
  },
  setIsAllowBookAnyway: (value: boolean) => set({ isAllowBookAnyway: value })
});

function getListComboItems(createAppointmentStore: CreateAppointmentState): ApptPackageItem[] {
  let startTime = createAppointmentStore.selectedDate;
  const apptServicePackages: ApptPackageItem[] = [];
  for (const item of createAppointmentStore.listBookingServices) {
    if (item.service?.menuItemType === "ServicePackage") {
      const listComboItems = createAppointmentStore.listBookingServices.filter(
        (e: ServicesEntity)=> item.service?.servicePackageMaps.findIndex((value, index)=>{
          if(value.mapMenuItemId === e.service?.id)
            return index
          return -1
        }) !== -1
      );

      const apptServiceItems = listComboItems.map((e: ServicesEntity)=>{
        const apptServiceItem = {
          id: e.service?.id || "",
          name: e.service?.name || "",
          duration: e.service?.duration || 0,
          startTime: {
            hours: startTime.getHours(),
            minutes: startTime.getMinutes(),
            seconds: 0,
            nanos: 0
          },
          position: 0,

          price: e.service?.regularPrice || 0,
        } as ApptServiceItem
        if(!createAppointmentStore.isGroupAppointment){
          startTime = new Date(startTime.getTime() + (e.service?.duration || 0) * 60000);
        }
        return apptServiceItem;
      });
      apptServicePackages.push(
        {
          id: item.service?.id || "",
          name: item.service?.name || "",
          apptServiceItems: apptServiceItems,
          position: item.service?.position || 0,
          price: item.service?.regularPrice || 0,
          duration: item.service?.duration || 0,
          apptServicePackageFilter: "",
        } as ApptPackageItem
      );
    }

  }
  
  return apptServicePackages;
}

function getListApptServiceItems(createAppointmentStore: CreateAppointmentState): ApptServiceItem[] {
  let startTime = createAppointmentStore.selectedDate;
  const apptServiceItems: ApptServiceItem[] = [];
  for (const item of createAppointmentStore.listBookingServices) {
    if (item.service?.menuItemType === "ServicePackage") {
      continue; 
    }
    apptServiceItems.push(
      {
        id: "",
        name: item.service?.name || "",
        duration: item.service?.duration || 0,
        startTime: {
          hours: startTime.getHours(),
          minutes: startTime.getMinutes(),
          seconds: 0,
          nanos: 0
        },
        price: item.service?.regularPrice || 0,
        employeeId: item.technician?.id || "",
      } as ApptServiceItem
    );
    if(createAppointmentStore.isGroupAppointment){
      startTime = new Date(startTime.getTime() + (item.service?.duration || 0) * 60000);
    }
  }
  return apptServiceItems;

}

export const useCreateAppointmentStore = create<CreateAppointmentState>(createAppointmentCreator);

export const createAppointmentSelectors = {
  selectSelectedCustomer: (state: CreateAppointmentState) => state.selectedCustomer,
  selectCustomerList: (state: CreateAppointmentState) => state.customerList,
  selectListApptType: (state: CreateAppointmentState)=>state.listApptType,
  selectIsLoading: (state: CreateAppointmentState)=>state.isLoading,
  selectIsConfirmOnline: (state: CreateAppointmentState) => state.isConfirmOnline,
  selectIsGroupAppt: (state: CreateAppointmentState) => state.isGroupAppointment,
  selectSetIsConfirmOnline: (state: CreateAppointmentState) => state.setIsConfirmOnline,
  selectSetIsGroupAppt: (state: CreateAppointmentState) => state.setIsGroupAppt,
  selectGetApptResource: (state: CreateAppointmentState) => state.getApptResource,
  selectGetCustomerLookup: (state: CreateAppointmentState) => state.getCustomerLookup,
  selectSetSelectedCustomer: (state: CreateAppointmentState) => state.setSelectedCustomer,
  selectSelectedApptType: (state: CreateAppointmentState) => state.selectedApptType,
  selectListCategories: (state: CreateAppointmentState) => state.listCategories,
  selectListItemMenu: (state: CreateAppointmentState) => state.listItemMenu,
  selectGetListItemMenu: (state: CreateAppointmentState) => state.getListItemMenu,
  selectGetListCategories: (state: CreateAppointmentState) => state.getListCategories,
  selectListService: (state: CreateAppointmentState) => state.listBookingServices,
  selectSelectedDate: (state: CreateAppointmentState) => state.selectedDate,
  selectSetSelectedDate: (state: CreateAppointmentState) => state.setSelectedDate,
  selectSetIsAllowBookAnyway: (state: CreateAppointmentState) => state.setIsAllowBookAnyway,
  selectSaveAppointment: (state: CreateAppointmentState) => state.saveAppointment,
  selectError: (state: CreateAppointmentState) => state.error,
  selectReset: (state: CreateAppointmentState) => state.reset,
}; 

function validBookings(
  useCreateAppointmentStore: CreateAppointmentState,
  setAlertMessage: (msg: string) => void
): boolean {
  if (useCreateAppointmentStore.listBookingServices.length<2) {
    setAlertMessage("Please add at least one service");
    return false;
  }

  if (!useCreateAppointmentStore.selectedCustomer) {
    setAlertMessage("Please select a customer");
    return false;
  }

  // booking.startTime = toTimeEntity(booking.bookingTime); // Nếu cần set lại, xử lý ngoài hàm này

  for (const item of useCreateAppointmentStore.listBookingServices) {
    if (item.service && item.technician === null) {
      setAlertMessage(
        `Please select a technician for service: ${item.service?.name}`
      );
      return false;
    }
  }

  return true;
}


function isValidTime(
  selectedDate: Date,
  totalDuration: number, // phút
  businessHours: any,
  setAlertMessage: (msg: string) => void
): boolean {
  const timeRange = getWorkHourByDay(businessHours, selectedDate);
  if (!timeRange) {
    setAlertMessage("This day is not a working day.");
    return false;
  }
  const bookingStart = selectedDate;
  const bookingEnd = new Date(bookingStart.getTime() + totalDuration * 60000);

  const workStart = dateFromTimeEntity(selectedDate, timeRange.start);
  const workEnd = dateFromTimeEntity(selectedDate, timeRange.end);

  if (bookingEnd > workEnd) {
    setAlertMessage("Time must not exceed the end of the day.");
    return false;
  }
  return true;
}


function getWorkHourByDay(workHours: any, date: Date): TimeRange | null {
  const day = date.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
  switch (day) {
    case 0:
      if (!workHours.isSun) return null;
      return { start: workHours.sunFromHour, end: workHours.sunToHour };
    case 1:
      if (!workHours.isMon) return null;
      return { start: workHours.monFromHour, end: workHours.monToHour };
    case 2:
      if (!workHours.isTue) return null;
      return { start: workHours.tueFromHour, end: workHours.tueToHour };
    case 3:
      if (!workHours.isWed) return null;
      return { start: workHours.wedFromHour, end: workHours.wedToHour };
    case 4:
      if (!workHours.isThu) return null;
      return { start: workHours.thuFromHour, end: workHours.thuToHour };
    case 5:
      if (!workHours.isFri) return null;
      return { start: workHours.friFromHour, end: workHours.friToHour };
    case 6:
      if (!workHours.isSat) return null;
      return { start: workHours.satFromHour, end: workHours.satToHour };
    default:
      return null;
  }
}



