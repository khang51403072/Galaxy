import { create } from 'zustand';
import { ApptRes, WorkHours } from '../types/ApptResResponse';
import { failure, isSuccess, Result, success } from '../../../shared/types/Result';
import { AppointmentRepositoryImplement } from '../repositories/AppointmentRepositoryImplement';
import { AppointmentUsecase } from '../usecases/AppointmentUsecase';
import { CustomerEntity, CustomerResponse, CustomerPayload } from '../types/CustomerResponse';
import { ApptType, createApptType } from '../types/AppointmentType';
import { CategoryEntity } from '../types/CategoriesResponse';
import { MenuItemEntity } from '../types/MenuItemResponse';
import { EmployeeEntity } from '@/features/ticket/types/TicketResponse';
import { ApptPackageItem, ApptPayload, ApptServiceItem, DataAppt } from '../types/ApptSaveResponse';
import { CompanyProfileResponse, dateFromTimeEntity, TimeRange } from '../types/CompanyProfileResponse';
import { ApptDetail, ApptDetailsResponse, ApptServicePackage } from '../types/ApptDetailsResponse';
import { useEmployeeStore } from '@/shared/stores/employeeStore';
import { DropdownOption } from '@/shared/components/XDropdown';
import { Permissions } from '@/features/auth/types/AuthTypes';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useHomeStore } from '@/features/home/stores/homeStore';
import { appConfig } from '@/shared/utils/appConfig';


// --- TYPE DEFINITIONS ---
export type BookingServiceEntity = {
  service?: MenuItemEntity | null;
  technician?: EmployeeEntity | null;
  comboItems?: BookingServiceEntity[] | null;
};

export type UpdateBookingParams = {
  serviceIndex: number;
  e: MenuItemEntity | EmployeeEntity;
  type: 'service' | 'technician';
  comboIndex?: number;
};

// --- STATE AND ACTIONS TYPE ---
export type AppointmentFormState = {
  error: string | null;
  isLoading: boolean;
  customerList: CustomerEntity[] | null;
  selectedCustomer: CustomerEntity | null;
  isConfirmOnline: boolean;
  isGroupAppointment: boolean;
  selectedApptType: DropdownOption | null;
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

  // --- ACTIONS ---
  reset: () => void;
  // GET Data
  getListCategories: () => Promise<Result<CategoryEntity[], Error>>;
  getListItemMenu: () => Promise<Result<MenuItemEntity[], Error>>;
  getApptResource: () => Promise<Result<ApptRes[], Error>>;
  getCustomerLookup: (pageNumber?: number, pageSize?: number, phoneNumber?: string) => Promise<Result<CustomerResponse, Error>>;
  getCompanyProfile: () => Promise<Result<CompanyProfileResponse, Error>>;
  getApptDetails: (id: string) => Promise<Result<ApptDetail, Error>>;
  initData: (id?: string) => Promise<void>;
  // SET Form Data
  setIsConfirmOnline: (value: boolean) => void;
  setIsGroupAppt: (value: boolean) => void;
  setSelectedCustomer: (value: CustomerEntity) => void;
  setSelectedDate: (value: Date) => void;
  setSelectedApptType: (value: DropdownOption) => void;
  setIsAllowBookAnyway: (value: boolean) => void;
  // Logic
  saveAppointment: () => Promise<Result<DataAppt, Error>>;
  updateBookingService: (params: UpdateBookingParams) => void;
  removeBookingService: (index: number) => void;
  getIsAllowEdit: () => boolean;
};

// --- INITIAL STATE ---
export const initialFormState = {
  isLoading: false,
  error: null,
  apptDetails: null,
  isConfirmOnline: false,
  isGroupAppointment: false,
  selectedCustomer: null,
  selectedApptType: null,
  selectedDate: new Date(),
  isAllowBookAnyway: false,
  listCategories: [],
  listItemMenu: [],
  customerList: [],
  companyProfile: null,
  listApptResource: [],
  listEmployeeOnWork: [],
  listApptType: [
    createApptType("Misc", "Misc"),
    createApptType("NewCustomer", "New Customer"),
    createApptType("Request", "Choose Tech"),
    createApptType("NonRequest", "Any Tech"),
    createApptType("WalkIn", "Walk In"),
    createApptType("Online", "Online"),
  ],
  listBookingServices: [{ service: null, technician: null }],
};

// --- STORE CREATION ---
const appointmentRepository = new AppointmentRepositoryImplement();
const appointmentUsecase = new AppointmentUsecase(appointmentRepository);

export const useCreateAppointmentStore = create<AppointmentFormState>((set, get) => ({
  ...initialFormState,

  reset: () => set({ ...initialFormState }),
  
  // --- SETTERS ---
  setSelectedDate: (value: Date) => set({ selectedDate: value }),
  setIsConfirmOnline: (value: boolean) => set({ isConfirmOnline: value }),
  setIsGroupAppt: (value: boolean) => set({ isGroupAppointment: value }),
  setSelectedApptType: (value: DropdownOption) => set({ selectedApptType: value }),
  setSelectedCustomer: (value: CustomerEntity) => set({ selectedCustomer: value }),
  setIsAllowBookAnyway: (value: boolean) => set({ isAllowBookAnyway: value }),

  // --- ASYNC ACTIONS (GET DATA) ---
  getApptDetails: async (id: string) => {
    set({ isLoading: true });
    const result = await appointmentUsecase.apptDetails(id);
    if(isSuccess(result)) {
        set({ apptDetails: result.value, isLoading: false })
        return success(result.value)
    }
    set({isLoading: false, error: result.error.message})
    return failure(result.error);
  },
  getApptResource: async () => {
    if (get().listApptResource.length > 0) return success(get().listApptResource);
    const result = await appointmentUsecase.getApptResource();
    if (isSuccess(result)) {
      return success(result.value.data);
    }
    return result;
  },
  getCompanyProfile: async () => {
    if (get().companyProfile != null) return success(get().companyProfile!);
    const response = await appointmentUsecase.apptCompanyProfile();
    return response;
  },
  getListCategories: async () => {
    if (get().listCategories.length > 0) return success(get().listCategories);
    const result = await appointmentUsecase.getCategories();
    return result;
  },
  getListItemMenu: async () => {
    if (get().listItemMenu.length > 0) return success(get().listItemMenu);
    const result = await appointmentUsecase.getMenuItems();
    return result;
  },
  getCustomerLookup: async (pageNumber: number = 1, pageSize: number = 10000, phoneNumber: string = '') => {
    const payload: CustomerPayload = { pageNumber, pageSize, phoneNumber };
    const result = await appointmentUsecase.customers(payload);
    return result;
  },
  initData: async (id?: string) => {
    try {
      set({ isLoading: true, error: null });
      const [categoriesResponse, menuItemsResponse, apptResource, companyProfileResponse, customerListResponse] = await Promise.all([
        get().getListCategories(),
        get().getListItemMenu(),
        get().getApptResource(),
        get().getCompanyProfile(),
        get().getCustomerLookup(),
      ]);

      if (isSuccess(categoriesResponse) && isSuccess(menuItemsResponse) && isSuccess(apptResource) && isSuccess(companyProfileResponse) && isSuccess(customerListResponse)) {
        // Appt Resource & Employee on Work
        const listEmployee: EmployeeEntity[] = useEmployeeStore.getState().employees;
        const listApptResourceData = apptResource.value as ApptRes[];
        const mapApptResource = new Map<string, WorkHours>();
        listApptResourceData.forEach((item) => mapApptResource.set(item.id, item.workHours));
        const listEmployeeOnWork = listEmployee.map((item) => ({ ...item, workHours: mapApptResource.get(item.id) }));
        
        // Category and Menu Item
        const listCategories = categoriesResponse.value.filter((e: CategoryEntity) => e.categoryType === "Service" || e.isHide === false);
        const listItemMenu = menuItemsResponse.value;
        
        // Company Profile & Appt Type Colors
        const companyProfile = companyProfileResponse.value;
        const listApptType = [...get().listApptType];
        if (companyProfile) {
            listApptType[0].bgColor = companyProfile.data.posTheme.miscBackColor;
            listApptType[1].bgColor = companyProfile.data.posTheme.newCustomerBackColor;
            listApptType[2].bgColor = companyProfile.data.posTheme.heldOnBackColor;
            listApptType[3].bgColor = companyProfile.data.posTheme.nonRequestBackColor;
            listApptType[4].bgColor = companyProfile.data.posTheme.walkinBackColor;
            listApptType[5].bgColor = companyProfile.data.posTheme.onlineBackColor;
        }

        const customerList = customerListResponse.value.dataSource;

        // Appt Details (for Edit mode)
        let apptDetails: ApptDetail | null = null;
        let listBookingServices: BookingServiceEntity[] = [];

        if (id) {
          const apptDetailResponse = await get().getApptDetails(id);
          if (isSuccess(apptDetailResponse)) {
            apptDetails = apptDetailResponse.value;
            apptDetails?.apptServiceItems.forEach((item) => {
              listBookingServices.push({
                service: listItemMenu.find((menu) => menu.id === item.id),
                technician: listEmployeeOnWork.find((e) => e.id === item.employeeId),
              });
            });
            apptDetails?.apptServicePackages.forEach((pkg) => {
                listBookingServices.push({
                    service: listItemMenu.find((menu) => menu.id === pkg.id),
                    technician: null,
                    comboItems: pkg.apptServiceItems.map((item) => ({
                        service: listItemMenu.find((menu) => menu.id === item.id),
                        technician: listEmployeeOnWork.find((e) => e.id === item.employeeId),
                    })),
                });
            });
          }
        }
        
        const apptTypeDetail = apptDetails?.retentionType ?? companyProfile.data.appointments.defaultRetentionType;
        const apptType = listApptType.find(value => value.id.trim().toLowerCase() === apptTypeDetail.toLowerCase());
        
        set({
            listApptResource: listApptResourceData,
            listEmployeeOnWork: listEmployeeOnWork.filter((item) => isEmployeeAvailableForDay(item, get().selectedDate)),
            listCategories: listCategories,
            listItemMenu: listItemMenu,
            companyProfile: companyProfile,
            customerList: customerList,
            listApptType: listApptType,
            listBookingServices: listBookingServices.length > 0 ? listBookingServices : get().listBookingServices,
            selectedDate: apptDetails?.apptDate ? new Date(apptDetails.apptDate) : new Date(),
            isConfirmOnline: apptDetails?.isOnlineConfirm ?? false,
            isGroupAppointment: apptDetails?.isGroupAppt ?? false,
            selectedCustomer: apptDetails?.customer ?? null,
            apptDetails: apptDetails,
            selectedApptType: { label: apptType?.name ?? "", value: apptType },
            isLoading: false,
        });
      } else {
        set({ isLoading: false, error: "Failed to initialize data." });
      }
    } catch (e: any) {
      console.error(e);
      set({ isLoading: false, error: e.message });
    }
  },

  // --- MAIN BUSINESS LOGIC ---
  saveAppointment: async () => {
    set({ isLoading: true, error: null });
    const state : AppointmentFormState = get();
    if (!validBookings(state, (msg) => set({ error: msg, isLoading: false }))) {
      return failure(new Error(state.error || "Validation failed"));
    }

    const businessHours = state.companyProfile?.data.businessHours;
    const totalDuration = state.listBookingServices.reduce((acc, item) => acc + (item.service?.duration || 0), 0);

    if (!isValidTime(state.selectedDate, totalDuration, businessHours, (msg) => set({ error: msg, isLoading: false }))) {
      return failure(new Error(state.error || "Invalid time"));
    }
    
    // --- Build Payload ---
    const apptServiceItems: ApptServiceItem[] = [];
    const apptServicePackages: ApptPackageItem[] = [];
    let startTime = new Date(state.selectedDate.getTime());

    for (const item of state.listBookingServices) {
      if (!item.service) continue;

      const startTimeEntity = { hours: startTime.getHours(), minutes: startTime.getMinutes(), seconds: 0, nanos: 0 };

      if (item.service.menuItemType === "ServicePackage") {
        const comboItems = item.comboItems || [];
        const apptServiceItemsTmp  = comboItems.map(combo => {
          const serviceItem : ApptServiceItem = {
            id: combo.service?.id || "", 
            name: combo.service?.name || "", 
            duration: combo.service?.duration || 0,
            startTime: startTimeEntity, 
            price: combo.service?.regularPrice || 0, employeeId: combo.technician?.id || "",
            note: state.selectedCustomer?.notes??'',
            apptServicePackageId: item?.service?.id??"", // Thêm
            apptServicePackageName: item?.service?.name??"", // Thêm
            position: 1
          };
          if(state.isGroupAppointment) {
            startTime.setMinutes(startTime.getMinutes() + (combo.service?.duration || 0));
          }
          return serviceItem;
        });
        apptServicePackages.push({
            id: item.service.id, name: item.service.name, price: item.service.regularPrice, duration: item.service.duration,
            apptServicePackageFilter: "", apptServiceItems: apptServiceItemsTmp,
        });
      } else {
        apptServiceItems.push({
          note: '',
          position:1,
          apptServicePackageId: '', // Thêm
                apptServicePackageName: '', // Thêm
          id: item.service.id, name: item.service.name, duration: item.service.duration, startTime: startTimeEntity,
          price: item.service.regularPrice, employeeId: item.technician?.id || "",
        });
        if(state.isGroupAppointment){
          startTime.setMinutes(startTime.getMinutes() + (item.service.duration || 0));
        }
      }
    }
    
    const payloadSave: ApptPayload = {
      id: state.apptDetails?.id || "",
      apptDate: state.selectedDate.toISOString().split('T')[0],
      retentionType: state.selectedApptType?.value?.id || "",
      isOnlineConfirm: state.isConfirmOnline,
      isGroupAppt: state.isGroupAppointment,
      apptStatus: "New",
      apptConfirmStatus: "None",
      apptServiceItems: apptServiceItems,
      apptServicePackages: apptServicePackages,
      customer: {
        id: state.selectedCustomer?.id || "",
        firstName: state.selectedCustomer?.firstName || "", lastName: state.selectedCustomer?.lastName || "",
        fullName: state.selectedCustomer?.firstName+" "+ state.selectedCustomer?.lastName|| "", email: state.selectedCustomer?.email || "",
        cellPhone: state.selectedCustomer?.cellPhone || "",
      },
      customerNote: state.selectedCustomer?.notes || "",
      allowBookAnyway: state.isAllowBookAnyway,
    };

    const result = await appointmentUsecase.saveAppointment(payloadSave);
    if (isSuccess(result)) {
      set({ isLoading: false });
      return success(result.value.data);
    } else {
      set({ isLoading: false, error: result.error.message });
      return result;
    }
  },

  updateBookingService: (params: UpdateBookingParams) => {
    const { type, e, serviceIndex, comboIndex } = params;
    const { listBookingServices, listItemMenu } = get();

    let newList: BookingServiceEntity[];
    if (type === 'technician') {
        newList = listBookingServices.map((item, i) => {
            if (i !== serviceIndex) return item;
            if (comboIndex != null && comboIndex > -1 && item.comboItems) {
                return { ...item, comboItems: item.comboItems.map((combo, j) => j === comboIndex ? { ...combo, technician: e as EmployeeEntity } : combo) };
            }
            return { ...item, technician: e as EmployeeEntity };
        });
    } else { // type === 'service'
        const service = e as MenuItemEntity;
        const technician = listBookingServices[serviceIndex]?.technician;
        let comboItems: BookingServiceEntity[] = [];
        if (service.menuItemType === 'ServicePackage') {
            const mapIds = new Set(service.servicePackageMaps.map(map => map.mapMenuItemId));
            comboItems = listItemMenu.filter((item: MenuItemEntity) => mapIds.has(item.id))
                                      .map((item: MenuItemEntity) => ({ service: item, technician: null }));
        }

        const newItem: BookingServiceEntity = { service, technician, comboItems };
        
        // Replace existing item or the last placeholder item
        const isReplacingPlaceholder = serviceIndex === listBookingServices.length - 1 && !listBookingServices[serviceIndex].service;
        if (isReplacingPlaceholder) {
            newList = [...listBookingServices.slice(0, -1), newItem, { service: null, technician: null }];
        } else {
            newList = listBookingServices.map((item, i) => i === serviceIndex ? newItem : item);
        }
    }
    set({ listBookingServices: newList });
  },

  removeBookingService: (index: number) => {
    set((state) => ({
      listBookingServices: state.listBookingServices.filter((_, i) => i !== index),
    }));
  },
  
  getIsAllowEdit: () => {
    const { apptDetails } = get();
    if (apptDetails === null) return true;
    
    const roles = useHomeStore?.getState()?.json?.listRole || []; // Example auth store access
    if(roles.includes(Permissions.MOVE_APPOINTMENT)){
      return true;
    }

    const status = apptDetails.apptStatus.toLowerCase();
    if (status === "checkout" || status === "cancel") {
      return false;
    }
    
    // Default should be true if not checked out or cancelled. 
    // The original logic returned false here, which seems like a potential bug.
    // If only checkout/cancel prevents editing, then others should be editable.
    return true; 
  },
}));

// --- SELECTORS ---
export const createAppointmentSelectors = {
  // state
  state: (state: AppointmentFormState) => state,
  isLoading: (state: AppointmentFormState) => state.isLoading,
  error: (state: AppointmentFormState) => state.error,
  selectedCustomer: (state: AppointmentFormState) => state.selectedCustomer,
  listBookingServices: (state: AppointmentFormState) => state.listBookingServices,
  listCategories:(state: AppointmentFormState) => state.listCategories,
  listItemMenu: (state: AppointmentFormState) => state.listItemMenu,
  // ... add more specific selectors if needed for performance
  
  // actions
  actions: (state: AppointmentFormState) => ({
    reset: state.reset,
    initData: state.initData,
    saveAppointment: state.saveAppointment,
    // ... other actions
  })
};

// --- HELPER FUNCTIONS ---
function validBookings(state: AppointmentFormState, setAlertMessage: (msg: string) => void): boolean {
  if (!state.selectedCustomer) {
    setAlertMessage("Please select a customer");
    return false;
  }
  const listBooking = state.listBookingServices.filter(item => item.service !== null);
  if (listBooking.length < 1) {
    setAlertMessage("Please add at least one service");
    return false;
  }
  for (const item of listBooking) {
    if (item.service?.menuItemType !== "ServicePackage" && !item.technician) {
      setAlertMessage(`Please select a technician for service: ${item.service?.name}`);
      return false;
    }
    if (item.service?.menuItemType === "ServicePackage" && item.comboItems?.some(c => !c.technician)) {
        const unassignedService = item.comboItems.find(c=>!c.technician)?.service?.name
        setAlertMessage(`Please select a technician for service: ${unassignedService}`);
        return false;
    }
  }
  return true;
}

function isValidTime(selectedDate: Date, totalDuration: number, businessHours: any, setAlertMessage: (msg: string) => void): boolean {
  const timeRange = getWorkHourByDay(businessHours, selectedDate);
  if (!timeRange) {
    setAlertMessage("This day is not a working day.");
    return false;
  }
  const bookingEnd = new Date(selectedDate.getTime() + totalDuration * 60000);
  const workEnd = dateFromTimeEntity(selectedDate, timeRange.end);
  if (bookingEnd > workEnd) {
    setAlertMessage("Appointment time must not exceed the end of the working day.");
    return false;
  }
  return true;
}

function getWorkHourByDay(workHours: any, date: Date): TimeRange | null {
  if (!workHours) return null;
  const day = date.getDay();
  const days = [
      { check: workHours.isSun, from: workHours.sunFromHour, to: workHours.sunToHour },
      { check: workHours.isMon, from: workHours.monFromHour, to: workHours.monToHour },
      { check: workHours.isTue, from: workHours.tueFromHour, to: workHours.tueToHour },
      { check: workHours.isWed, from: workHours.wedFromHour, to: workHours.wedToHour },
      { check: workHours.isThu, from: workHours.thuFromHour, to: workHours.thuToHour },
      { check: workHours.isFri, from: workHours.friFromHour, to: workHours.friToHour },
      { check: workHours.isSat, from: workHours.satFromHour, to: workHours.satToHour }
  ];
  const currentDay = days[day];
  return currentDay.check ? { start: currentDay.from, end: currentDay.to } : null;
}

const isEmployeeAvailableForDay = (employee: EmployeeEntity, bookingDate: Date): boolean => {
  if (!employee.workHours) return true;
  const workHourForDay = getWorkHourByDay(employee.workHours, bookingDate);
  return !!workHourForDay; // Simple check if they work on that day. Time check can be more granular if needed.
};