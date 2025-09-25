import { create } from 'zustand';
import { ApptRes, WorkHours } from '../types/ApptResResponse';
import { failure, isSuccess, Result, success } from '../../../shared/types/Result';
import { AppointmentRepositoryImplement } from '../repositories/AppointmentRepositoryImplement';
import { AppointmentUsecase } from '../usecases/AppointmentUsecase';
import { ApptType, createApptType } from '../types/AppointmentType';
import { CategoryEntity } from '../types/CategoriesResponse';
import { MenuItemEntity } from '../types/MenuItemResponse';
import { EmployeeEntity } from '@/features/ticket/types/TicketResponse';
import { ApptPackageItem, ApptPayload, ApptServiceItem, DataAppt } from '../types/ApptSaveResponse';
import { CompanyProfileResponse} from '../types/CompanyProfileResponse';
import { ApptDetail} from '../types/ApptDetailsResponse';
import { useEmployeeStore } from '@/shared/stores/employeeStore';
import { DropdownOption } from '@/shared/components/XDropdown';
import { LoginEntity, Permissions } from '@/features/auth/types/AuthTypes';
import { useHomeStore } from '@/features/home/stores/homeStore';
import { useCustomerStore } from './customerStore';
import { AppointmentResponse } from '../types/AppointmentResponse';
import { DeleteAppointmentRequest } from '../types/DeleteAppointmentRequest';
import { appConfig } from '@/shared/utils/appConfig';
import { isEmployeeAvailableForDay, isValidTime, validBookings } from '../utils/createAppointmentStore.util';
import { StoreItemEntity } from '@/features/auth/usecase/AuthUsecase';
import { CustomerEntity } from '../types/CustomerResponse';
import { KeychainObject } from '@/shared/utils/keychainHelper';


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
  getCompanyProfile: () => Promise<Result<CompanyProfileResponse, Error>>;
  getApptDetails: (id: string) => Promise<Result<ApptDetail, Error>>;
  initData: (id?: string) => Promise<void>;
  deleteAppt: (selectedStore: StoreItemEntity|null) => Promise<Result<AppointmentResponse, Error>>;
  // SET Form Data
  setIsConfirmOnline: (value: boolean) => void;
  setIsGroupAppt: (value: boolean) => void;
  setSelectedDate: (value: Date) => void;
  setSelectedApptType: (value: DropdownOption) => void;
  setIsAllowBookAnyway: (value: boolean) => void;
  // Logic
  saveAppointment: (selectedCustomer?:CustomerEntity) => Promise<Result<DataAppt, Error>>;
  updateBookingService: (params: UpdateBookingParams) => void;
  removeBookingService: (index: number) => void;
  getIsAllowEdit: (json:KeychainObject | null) => boolean;
  getIsAllowDelete: (json:KeychainObject | null) => boolean
};

// --- INITIAL STATE ---
export const initialFormState = {
  isLoading: false,
  error: null,
  apptDetails: null,
  isConfirmOnline: false,
  isGroupAppointment: false,
  selectedApptType: null,
  selectedDate: new Date(),
  isAllowBookAnyway: false,
  listCategories: [],
  listItemMenu: [],
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
  initData: async (id?: string) => {
    try {
      set({ isLoading: true, error: null });
      const [categoriesResponse, menuItemsResponse, apptResource, companyProfileResponse] = await Promise.all([
        get().getListCategories(),
        get().getListItemMenu(),
        get().getApptResource(),
        get().getCompanyProfile(),
      ]);

      if (isSuccess(categoriesResponse) 
        && isSuccess(menuItemsResponse) 
        && isSuccess(apptResource) 
        && isSuccess(companyProfileResponse)) {
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
            listApptType: listApptType,
            listBookingServices: listBookingServices.length > 0 ? listBookingServices : get().listBookingServices,
            selectedDate: apptDetails?.apptDate ? new Date(apptDetails.apptDate) : new Date(),
            isConfirmOnline: apptDetails?.isOnlineConfirm ?? false,
            isGroupAppointment: apptDetails?.isGroupAppt ?? false,
            apptDetails: apptDetails,
            selectedApptType: { label: apptType?.name ?? "", value: apptType },
            isLoading: false,
        });
        useCustomerStore.setState({selectedCustomer: apptDetails?.customer})
      } else {
        set({ isLoading: false, error: "Failed to initialize data." });
      }
    } catch (e: any) {
      console.error(e);
      set({ isLoading: false, error: e.message });
    }
  },

  // --- MAIN BUSINESS LOGIC ---
  saveAppointment: async (selectedCustomer) => {
    set({ isLoading: true, error: null });
    const state : AppointmentFormState = get();
    if (!validBookings(state, (msg) => set({ error: msg, isLoading: false }), selectedCustomer)) {
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
            note: selectedCustomer?.notes??"",
            apptServicePackageId: item?.service?.id??"", // Thêm
            apptServicePackageName: item?.service?.name??"", // Thêm
            position: 1,
            isProxyBooking: false
          };
          if(state.isGroupAppointment) {
            startTime.setMinutes(startTime.getMinutes() + (combo.service?.duration || 0));
          }
          return serviceItem;
        });
        apptServicePackages.push({
            id: item.service.id, name: item.service.name, price: item.service.regularPrice, duration: item.service.duration,
            apptServicePackageFilter: "", apptServiceItems: apptServiceItemsTmp,
            isProxyBooking: false
        });
      } else {
        apptServiceItems.push({
          note: '',
          position:1,
          apptServicePackageId: '', // Thêm
                apptServicePackageName: '', // Thêm
          id: item.service.id, name: item.service.name, duration: item.service.duration, startTime: startTimeEntity,
          price: item.service.regularPrice, employeeId: item.technician?.id || "",
          isProxyBooking: false
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
        id: selectedCustomer?.id || "",
        firstName: selectedCustomer?.firstName || "", lastName: selectedCustomer?.lastName || "",
        fullName: selectedCustomer?.firstName+" "+ selectedCustomer?.lastName|| "", 
        email: selectedCustomer?.email || "",
        cellPhone: selectedCustomer?.cellPhone || "",
      },
      customerNote: selectedCustomer?.notes || "",
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
  
  getIsAllowEdit: (json) => {
    const { apptDetails } = get();
    if (apptDetails === null) return true;
    
    const status = apptDetails.apptStatus.toLowerCase();
    if (status === "checkout" || status === "cancel") {
      return false;
    }

    const roles = json?.listRole || []; // Example auth store access
    if(roles.includes(Permissions.MOVE_APPOINTMENT)){
      return true;
    }

    return false; 
  },
  getIsAllowDelete: (json) => {
    const { apptDetails } = get();
    let user:LoginEntity|null =  json as LoginEntity
    if (apptDetails === null) return false;
    //check status first
    const status = apptDetails.apptStatus.toLowerCase();
    if (status != "checkin" && status != "checkout" && status != "completed") {
      return true;
    }
    /// is owner
    if(user.isOwner) return true;
    ///list role have DELETE_APPOINTMENT flag
    if(user?.listRole?.includes(Permissions.DELETE_APPOINTMENT)){
      return true;
    }

    return false; 
  },
  deleteAppt: async (selectedStore) => {
    set({isLoading: true})
    let user:LoginEntity = await appConfig.getUser()
    let rq: DeleteAppointmentRequest = {
      id: get().apptDetails?.id??'',
      deletedBy: {
        id: user.userId,
        name:  selectedStore? selectedStore.empUser.split('@')[0]: user.userName
      }
    }
    let result = await appointmentUsecase.deleteAppt(rq);
    set({isLoading: false})
    return result
  }
}));



