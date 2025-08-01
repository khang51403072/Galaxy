import { create } from 'zustand';
import { ApptRes, ApptResResponse, Hour, WorkHours } from '../types/ApptResResponse';
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
import { CompanyProfileResponse, dateFromTimeEntity, TimeEntity, TimeRange } from '../types/CompanyProfileResponse';
import { ApptDetail, ApptDetailsResponse, ApptServicePackage } from '../types/ApptDetailsResponse';
import { appConfig } from '@/shared/utils/appConfig';
import { useEmployeeStore } from '@/shared/stores/employeeStore';
import { DropdownOption } from '@/shared/components/XDropdown';

export type BookingServiceEntity = {
  service?: MenuItemEntity|null
  technician?: EmployeeEntity|null
  comboItems?: BookingServiceEntity[]|null
}
export type CreateAppointmentState = {
  error: string | null;
  isLoading: boolean;
  customerList: CustomerEntity[] | null;
  selectedCustomer: CustomerEntity | null;  
  isConfirmOnline: boolean;
  isGroupAppointment: boolean;
  selectedApptType: DropdownOption| null;
  listApptType: ApptType[];
  listCategories: CategoryEntity[];
  listItemMenu: MenuItemEntity[];
  listBookingServices: BookingServiceEntity[];
  selectedDate: Date;
  isAllowBookAnyway: boolean;
  listEmployeeOnWork: EmployeeEntity[];
  companyProfile: CompanyProfileResponse | null;
  listApptResource: ApptRes[];
  apptDetails: ApptDetail | null;
  
  // UI State
  showServiceSheet: boolean;
  employeeForAvailable: EmployeeEntity[];
  serviceIndex: number;
  comboIndex: number;
  isShowTechnician: boolean;
  
  reset: () => void;
  ///GET
  getListCategories: ()=> Promise<Result<CategoryEntity[], Error>>;
  getListItemMenu: ()=> Promise<Result<MenuItemEntity[], Error>>
  getApptResource: () => Promise<Result<ApptRes, Error>>;
  getCustomerLookup: (pageNumber?: number, pageSize?: number, phoneNumber?: string) => Promise<Result<CustomerResponse, Error>>;
  getCompanyProfile: () => Promise<Result<CompanyProfileResponse, Error>>;
  getApptDetails: (id: string) => Promise<Result<ApptDetail, Error>>;
  initData: (id?: string)=> Promise<void>;
  ///SET
  setIsConfirmOnline: (value: boolean) => void;
  setIsGroupAppt: (value: boolean) => void;
  setSelectedCustomer: (value: CustomerEntity)=> void,
  setSelectedDate: (value: Date)=> void,
  setSelectedApptType: (value: DropdownOption)=> void,
  
  // UI Actions
  setShowServiceSheet: (value: boolean) => void;
  setEmployeeForAvailable: (employees: EmployeeEntity[]) => void;
  setServiceIndex: (index: number) => void;
  setComboIndex: (index: number) => void;
  setIsShowTechnician: (value: boolean) => void;
  
  //
  saveAppointment: ()=> Promise<Result<DataAppt, Error>>;
  setIsAllowBookAnyway: (value: boolean)=> void;
  //
};



export const initialCreateAppointmentState = {
  isLoading: false,
  error: null,
  apptDetails: null,
  isConfirmOnline: false,
  isGroupAppointment: false,
  selectedCustomer: null,
  selectedApptType: null,
  selectedDate: new Date(),
  isAllowBookAnyway: false,
  
  // UI State
  showServiceSheet: false,
  employeeForAvailable: [],
  serviceIndex: 0,
  comboIndex: -1,
  isShowTechnician: false,
  
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
  companyProfile: null,
  listApptResource: [],
  listEmployeeOnWork: [],
  setSelectedDate: (value: Date) => set({ selectedDate: value }),
  setIsConfirmOnline: (value: boolean) => set({ isConfirmOnline: value }),
  setIsGroupAppt: (value: boolean) => set({ isGroupAppointment: value }),
  reset: () => set( { ...initialCreateAppointmentState }),
  getApptDetails: async (id: string) => {
    set({ isLoading: true });
    const result = await appointmentUsecase.apptDetails(id);
    return result;
  },
  setSelectedApptType: (value: DropdownOption)=> set({selectedApptType: value}),
  getApptResource: async () => {
    if(get().listApptResource.length > 0)
      return success(get().listApptResource)
    const result = await appointmentUsecase.getApptResource();
    if(isSuccess(result)){
      return success(result.value.data);
    }
    return result;
  },
  getCompanyProfile: async (): Promise<Result<CompanyProfileResponse, Error>> => {
    if (get().companyProfile != null) {
        return success(get().companyProfile!);
    }
    const response = await appointmentUsecase.apptCompanyProfile();
    return response;
  },
  setSelectedCustomer: (value:CustomerEntity)=>{
    set({selectedCustomer: value})
  },
  getListCategories: async () =>{
    if(get().listCategories.length > 0)
      return success(get().listCategories)
    const result = await appointmentUsecase.getCategories();
    return result; 
  },
  getListItemMenu: async () =>{
    if(get().listItemMenu.length > 0)
    {
      return success(get().listItemMenu)
    }
    const result = await appointmentUsecase.getMenuItems();
    return result; 
  },
  
  getCustomerLookup: async (pageNumber: number = 1, pageSize: number = 10000, phoneNumber: string = '', {isReset}: {isReset: boolean} = {isReset: false}) => {
    const payload: CustomerPayload = {
      pageNumber,
      pageSize,
      phoneNumber: phoneNumber,
    };
    const result = await appointmentUsecase.customers(payload);
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
    const totalDuration = get().listBookingServices.reduce((acc: number, item: BookingServiceEntity) => {
      return acc + (item.service?.duration || 0);
    }, 0);

    // Kiểm tra thời gian hợp lệ
    if (!isValidTime(get().selectedDate, totalDuration, businessHours, msg => set({ error: msg }))) {
      set({ isLoading: false });
      return Promise.resolve(failure(new Error(get().error)));
    }
    //get list apptServiceItems và apptServicePackages
    const apptServiceItems: ApptServiceItem[] = [];
    const apptServicePackages: ApptPackageItem[] = [];
    let startTime = get().selectedDate;
    const listBookingServices: BookingServiceEntity[] = get().listBookingServices || [];
    for(const item  of  listBookingServices){
      if(item.service === null) continue;
      if(item.service?.menuItemType === "ServicePackage"){
        const listComboItems = item.comboItems || [];
        const apptServiceItemsTmp= []
        for(const comboItem of listComboItems){
          const apptServiceItem = {
            id: comboItem.service?.id || "",
            name: comboItem.service?.name || "",
            duration: comboItem.service?.duration || 0,
            startTime: {
              hours: startTime.getHours(),
              minutes: startTime.getMinutes(),
              seconds: 0,
              nanos: 0
            },
            price: comboItem.service?.regularPrice || 0,
            employeeId: comboItem.technician?.id || "",
          } as ApptServiceItem;
          apptServiceItemsTmp.push(apptServiceItem);
          if(get().isGroupAppointment){
            startTime = new Date(startTime.getTime() + (comboItem.service?.duration || 0) * 60000);
          }
        }
        const apptServicePackage : ApptPackageItem = {
          id: item.service?.id || "",
          apptServicePackageFilter: "",
          name: item.service?.name || "",
          price: item.service?.regularPrice || 0,
          duration: item.service?.duration || 0,
          apptServiceItems: apptServiceItemsTmp,
        } as ApptPackageItem
        apptServicePackages.push(apptServicePackage);
      } else {
        const apptServiceItem = {
          id: item.service?.id || "",
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
        } as ApptServiceItem;
        apptServiceItems.push(
          apptServiceItem
        );
        if(get().isGroupAppointment){
          startTime = new Date(startTime.getTime() + (item.service?.duration || 0) * 60000);
        }
      }
    }
    //
    //continue save
    const payloadSave: ApptPayload = {
      id: "",
      apptDate: get().selectedDate.toYYYYMMDD("-"),
      retentionType: get().selectedApptType?.value?.id || "",
      isOnlineConfirm: get().isConfirmOnline,
      isGroupAppt: get().isGroupAppointment,
      apptStatus: "New",
      apptConfirmStatus: "None",
      apptServiceItems: apptServiceItems,
      apptServicePackages: apptServicePackages,
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
      set({ isLoading: false, error: null });
      return success(result.value.data);
    }
    else{
      set({ isLoading: false, error: result.error.message });
    }
    return result;
  },
  setIsAllowBookAnyway: (value: boolean) => set({ isAllowBookAnyway: value }),
  
  // UI Actions
  setShowServiceSheet: (value: boolean) => set({ showServiceSheet: value }),
  setEmployeeForAvailable: (employees: EmployeeEntity[]) => set({ employeeForAvailable: employees }),
  setServiceIndex: (index: number) => set({ serviceIndex: index }),
  setComboIndex: (index: number) => set({ comboIndex: index }),
  setIsShowTechnician: (value: boolean) => set({ isShowTechnician: value }),
  initData: async (id?: string) => {
    try{
      set({ isLoading: true });
    const [categoriesResponse, menuItemsResponse, apptResource, companyProfileResponse, customerListResponse] = await Promise.all([
      await get().getListCategories(),
      await get().getListItemMenu(),
      await get().getApptResource(),
      await get().getCompanyProfile(),
      await get().getCustomerLookup(),
    ])
    if (isSuccess(categoriesResponse)
      && isSuccess(menuItemsResponse)
      && isSuccess(apptResource)
      && isSuccess(companyProfileResponse)
      && isSuccess(customerListResponse)
      && isSuccess(apptResource)) {
      ///appt resource
      const listEmployee: EmployeeEntity[] = useEmployeeStore.getState().employees;
      const listApptResource = apptResource.value as ApptRes[];
      const mapApptResource = new Map<string, WorkHours>();
      listApptResource.forEach((item) => {
        mapApptResource.set(item.id, item.workHours);
      })
      const listEmployeeOnWork: EmployeeEntity[] = listEmployee.map((item) => {
        return {
          ...item,
          workHours: mapApptResource.get(item.id)
        }
      })
      ///appt resource end
      //category
      const listCategories = (categoriesResponse.value as CategoryEntity[]).filter((e: CategoryEntity) => e.categoryType === "Service" || e.isHide === false);
      //menu item
      const listItemMenu = (menuItemsResponse.value as MenuItemEntity[]);
      //company profile
      const companyProfile = (companyProfileResponse.value as CompanyProfileResponse);
      const listApptType = get().listApptType;
      if(companyProfile){
        listApptType[0].bgColor = companyProfile.data.posTheme.miscBackColor
        listApptType[1].bgColor = companyProfile.data.posTheme.newCustomerBackColor
        listApptType[2].bgColor = companyProfile.data.posTheme.heldOnBackColor
        listApptType[3].bgColor = companyProfile.data.posTheme.nonRequestBackColor
        listApptType[4].bgColor = companyProfile.data.posTheme.walkinBackColor
        listApptType[5].bgColor = companyProfile.data.posTheme.onlineBackColor
      }
      
      //customer list
      const customerList = (customerListResponse.value as CustomerResponse).dataSource;
      ///appt detail
      let apptDetailResponse;
      let apptDetails : ApptDetail | null = null;
      const listBookingServices: BookingServiceEntity[] = [];
      const selectedDate: Date = new Date();
      const isConfirmOnline: boolean = false;
      const isGroupAppointment: boolean = false;
      
      if(id){
        apptDetailResponse = await get().getApptDetails(id);
        apptDetails = apptDetailResponse.value;
        apptDetails?.apptServiceItems.forEach((apptServiceItem : any)=>{
          const service = listItemMenu.find((menu:MenuItemEntity)=>menu.id === apptServiceItem.id);
          listBookingServices.push({
            service: service,
            technician: listEmployeeOnWork.find((e:EmployeeEntity)=>e.id === apptServiceItem.employeeId),
            comboItems: []
          })
        })
  
        apptDetails?.apptServicePackages.forEach((apptServicePackage:ApptServicePackage)=>{
          const service = get().listItemMenu.find((menu:MenuItemEntity)=>menu.id === apptServicePackage.id);
          listBookingServices.push({
            service: service,
            technician: null,
            comboItems: apptServicePackage.apptServiceItems.map((apptServiceItem)=>{
              const service = listItemMenu.find((menu:MenuItemEntity)=>menu.id === apptServiceItem.id);
              return {
                service: service,
                technician: listEmployeeOnWork.find(
                  (e:EmployeeEntity)=>e.id === apptServiceItem.employeeId),
                comboItems: []
              } as BookingServiceEntity
            })
          })
        })
      }
      let apptTypeDetail = apptDetails?.retentionType??companyProfile.data.appointments.defaultRetentionType;
      const apptType = listApptType.find((value:ApptType) => {
        
        return value.id.trim().toLowerCase() === (apptTypeDetail.toLowerCase())
      });
      const selectedCustomer = apptDetails?.customer;
      
      
      set({
        listApptResource: listApptResource,
        listEmployeeOnWork: listEmployeeOnWork.filter((item) => isEmployeeAvailableForDay(item, get().selectedDate)),
        listCategories: listCategories,
        listItemMenu: listItemMenu,
        companyProfile: companyProfile,
        customerList: customerList,
        listApptType: listApptType,
        listBookingServices: [...listBookingServices,...get().listBookingServices],
        selectedDate: selectedDate,
        isConfirmOnline: isConfirmOnline,
        isGroupAppointment: isGroupAppointment,
        selectedCustomer: selectedCustomer,
        apptDetails: apptDetails,
        selectedApptType: { label: apptType?.name ?? "", value: apptType },
        error: null,
        isLoading: false,
      });
    }


    
    
    

    
    set({ isLoading: false });      
    }
    catch(e){
      console.log(e);
    }
  }
});


export const useCreateAppointmentStore = create<CreateAppointmentState>(createAppointmentCreator);

export const createAppointmentSelectors = {
  selectListApptResource: (state: CreateAppointmentState) => state.listApptResource,
  selectGetListApptResource: (state: CreateAppointmentState) => state.getApptResource,
  selectGetCompanyProfile: (state: CreateAppointmentState) => state.getCompanyProfile,

  selectListEmployeeOnWork: (state: CreateAppointmentState) => state.listEmployeeOnWork,
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
  selectGetApptDetails: (state: CreateAppointmentState) => state.getApptDetails,
  selectApptDetails: (state: CreateAppointmentState) => state.apptDetails,
  selectSetSelectedApptType: (state: CreateAppointmentState) => state.setSelectedApptType,
  selectInitData: (state: CreateAppointmentState) => state.initData,
  // UI State Selectors
  selectShowServiceSheet: (state: CreateAppointmentState) => state.showServiceSheet,
  selectEmployeeForAvailable: (state: CreateAppointmentState) => state.employeeForAvailable,
  selectSetShowServiceSheet: (state: CreateAppointmentState) => state.setShowServiceSheet,
  selectSetEmployeeForAvailable: (state: CreateAppointmentState) => state.setEmployeeForAvailable,
  selectServiceIndex: (state: CreateAppointmentState) => state.serviceIndex,
  selectComboIndex: (state: CreateAppointmentState) => state.comboIndex,
  selectSetServiceIndex: (state: CreateAppointmentState) => state.setServiceIndex,
  selectSetComboIndex: (state: CreateAppointmentState) => state.setComboIndex,
  selectIsShowTechnician: (state: CreateAppointmentState) => state.isShowTechnician,
  selectSetIsShowTechnician: (state: CreateAppointmentState) => state.setIsShowTechnician,
}; 

function validBookings(
  useCreateAppointmentStore: CreateAppointmentState,
  setAlertMessage: (msg: string) => void
): boolean {
  if (!useCreateAppointmentStore.selectedCustomer) {
    setAlertMessage("Please select a customer");
    return false;
  }
  const listBooking = useCreateAppointmentStore.listBookingServices.filter(item => item.service !== null);
  if (listBooking.length<1) {
    setAlertMessage("Please add at least one service");
    return false;
  }
  for (const item of listBooking) {
    if (item.service?.menuItemType !== "ServicePackage" 
        && item.service && item.technician === null) {
      setAlertMessage(
        `Please select a technician for service: ${item.service?.name}`
      );
      return false;
    }
    if(item.service?.menuItemType === "ServicePackage" 
        && item.comboItems!=null 
        && item.comboItems?.length > 0)
    {
      for(const comboItem of item.comboItems){
        if(comboItem.technician === null){
          setAlertMessage(
            `Please select a technician for service: ${comboItem.service?.name}`
          );
          return false;
        }
      }
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


// Import existing types

// Helper Functions
const timeToMinutes = (time: Hour): number => {
  return time.hours * 60 + time.minutes;
};

const getWeekday = (date: Date): number => {
  return date.getDay();
};

// Check if employee is available for a specific day
const isEmployeeAvailableForDay = (employee: EmployeeEntity, bookingDate: Date): boolean => {
  // If no workHour, assume available
  if (!employee.workHours) {
    return true;
  }

  const weekday = getWeekday(bookingDate);
  const workHour: WorkHours = employee.workHours;

  // Check if employee works on this weekday
  let isWorkingDay = false;
  let fromHour: Hour;
  let toHour: Hour;

  switch (weekday) {
    case 0: // Sunday
      isWorkingDay = workHour.isSun;
      fromHour = workHour.sunFromHour;
      toHour = workHour.sunToHour;
      break;
    case 1: // Monday
      isWorkingDay = workHour.isMon;
      fromHour = workHour.monFromHour;
      toHour = workHour.monToHour;
      break;
    case 2: // Tuesday
      isWorkingDay = workHour.isTue;
      fromHour = workHour.tueFromHour;
      toHour = workHour.tueToHour;
      break;
    case 3: // Wednesday
      isWorkingDay = workHour.isWed;
      fromHour = workHour.wedFromHour;
      toHour = workHour.wedToHour;
      break;
    case 4: // Thursday
      isWorkingDay = workHour.isThu;
      fromHour = workHour.thuFromHour;
      toHour = workHour.thuToHour;
      break;
    case 5: // Friday
      isWorkingDay = workHour.isFri;
      fromHour = workHour.friFromHour;
      toHour = workHour.friToHour;
      break;
    case 6: // Saturday
      isWorkingDay = workHour.isSat;
      fromHour = workHour.satFromHour;
      toHour = workHour.satToHour;
      break;
    default:
      return false;
  }

  // If not working day, return false
  if (!isWorkingDay) {
    return false;
  }

  // Convert to minutes for comparison
  const fromMinutes = timeToMinutes(fromHour);
  const toMinutes = timeToMinutes(toHour);

  // Get booking time in minutes
  const bookingMinutes = bookingDate.getHours() * 60 + bookingDate.getMinutes();

  // Check if booking time is within working hours
  return bookingMinutes >= fromMinutes && bookingMinutes <= toMinutes;
};

// Main function
const getAvailableEmployees = (employees: EmployeeEntity[], bookingDate: Date): EmployeeEntity[] => {
  return employees.filter(employee => 
    isEmployeeAvailableForDay(employee, bookingDate)
  );
};
