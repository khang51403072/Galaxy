import { create } from 'zustand';
import { failure, isSuccess, Result, success } from '../../../../shared/types/Result';
import { ApptType } from '../../types/AppointmentType';
import { MenuItemEntity } from '../../types/MenuItemResponse';
import { EmployeeEntity } from '@/features/ticket/types/TicketResponse';
import { ApptPackageItem, ApptPayload, ApptServiceItem, DataAppt } from '../../types/ApptSaveResponse';
import { CompanyProfileResponse } from '../../types/CompanyProfileResponse';
import { ApptDetail } from '../../types/ApptDetailsResponse';
import { DropdownOption } from '@/shared/components/XDropdown';
import { LoginEntity, Permissions } from '@/features/auth/types/AuthTypes';
import { AppointmentResponse } from '../../types/AppointmentResponse';
import { DeleteAppointmentRequest } from '../../types/DeleteAppointmentRequest';
import { appConfig } from '@/shared/utils/appConfig';
import { isEmployeeAvailableForDay, validBookings } from '../../utils/createAppointmentStore.util';
import { StoreItemEntity } from '@/features/auth/usecase/AuthUsecase';
import { CustomerEntity } from '../../types/CustomerResponse';
import { KeychainObject } from '@/shared/utils/keychainHelper';
import { appointmentUsecase } from '@/app/dependencies';
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
  listItemMenu: MenuItemEntity[]
};

export type SaveAppointmentParams = {
  selectedCustomer?: CustomerEntity;
  companyProfile?: CompanyProfileResponse;
}

export interface GetApptDetailsRequest {
  apptId: string;
  listEmployee: EmployeeEntity[];
  listItemMenu: MenuItemEntity[];
  companyProfile?: CompanyProfileResponse;
  listApptType: ApptType[];
}

// --- STATE AND ACTIONS TYPE ---
export type AppointmentFormState = {
  error: string | null;
  isLoading: boolean;
  isConfirmOnline: boolean;
  isGroupAppointment: boolean;
  selectedApptType: DropdownOption | null;
  listBookingServices: BookingServiceEntity[];
  selectedDate: Date;
  isAllowBookAnyway: boolean;
  apptDetails: ApptDetail | null;
  // --- ACTIONS ---
  reset: () => void;
  // GET Data
  getApptDetails: (rq: GetApptDetailsRequest) => Promise<Result<ApptDetail, Error>>;
  deleteAppt: (selectedStore: StoreItemEntity | null) => Promise<Result<AppointmentResponse, Error>>;
  // SET Form Data
  setIsConfirmOnline: (value: boolean) => void;
  setIsGroupAppt: (value: boolean) => void;
  setSelectedDate: (value: Date) => void;
  setSelectedApptType: (value: DropdownOption) => void;
  setIsAllowBookAnyway: (value: boolean) => void;
  // Logic
  saveAppointment: (params: SaveAppointmentParams) => Promise<Result<DataAppt, Error>>;
  updateBookingService: (params: UpdateBookingParams) => void;
  removeBookingService: (index: number) => void;
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
  listBookingServices: [{ service: null, technician: null }],
}; 
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
  getApptDetails: async (rq: GetApptDetailsRequest) => {
    set({ isLoading: true });
    const newState: Partial<AppointmentFormState> = { isLoading: false }
    // Appt Details (for Edit mode)
    let apptDetails: ApptDetail | null = null;
    let listBookingServices: BookingServiceEntity[] = [];
    ///Load Appt detail
    const apptDetailResponse = await appointmentUsecase.apptDetails(rq?.apptId);
    if (isSuccess(apptDetailResponse)) {
      apptDetails = apptDetailResponse.value;
      ///Load service 
      apptDetails?.apptServiceItems.forEach((item) => {
        listBookingServices.push({
          service: rq.listItemMenu.find((menu) => menu.id === item.id),
          technician: rq.listEmployee.find((e) => e.id === item.employeeId),
        });
      });
      ///load service package (combo)
      apptDetails?.apptServicePackages.forEach((pkg) => {
        listBookingServices.push({
          service: rq.listItemMenu.find((menu) => menu.id === pkg.id),
          technician: null,
          comboItems: pkg.apptServiceItems.map((item) => ({
            service: rq.listItemMenu.find((menu) => menu.id === item.id),
            technician: rq.listEmployee.find((e) => e.id === item.employeeId),
          })),
        });
      });
      //set list booking service
      newState.listBookingServices = listBookingServices;
      newState.selectedDate = apptDetails?.apptDate ? new Date(apptDetails.apptDate) : new Date(),
        newState.isConfirmOnline = apptDetails?.isOnlineConfirm ?? false;
      newState.isGroupAppointment = apptDetails?.isGroupAppt ?? false;
      newState.apptDetails = apptDetails;
      //set Appointment Default
      const apptTypeDetail = apptDetails?.retentionType ?? rq?.companyProfile?.data.appointments.defaultRetentionType;
      const apptType = rq.listApptType.find(value => value.id.trim().toLowerCase() === apptTypeDetail?.toLowerCase());
      newState.selectedApptType = { label: apptType?.name ?? "", value: apptType };
    }

    set({
      ...newState
    });
    return apptDetailResponse
  },

  // --- MAIN BUSINESS LOGIC ---
  saveAppointment: async (params: SaveAppointmentParams) => {
    set({ isLoading: true, error: null });
    const state: AppointmentFormState = get();
    ///validate booking service list
    let bookingErrorMsg = validBookings({ state: state, selectedCustomer: params.selectedCustomer, selectedDate: state.selectedDate, companyProfile: params.companyProfile, listBookingServices: state.listBookingServices })
    if (bookingErrorMsg) {
      return failure(new Error(bookingErrorMsg));
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
        const apptServiceItemsTmp = comboItems.map(combo => {
          const serviceItem: ApptServiceItem = {
            id: combo.service?.id || "",
            name: combo.service?.name || "",
            duration: combo.service?.duration || 0,
            startTime: startTimeEntity,
            price: combo.service?.regularPrice || 0, employeeId: combo.technician?.id || "",
            note: params.selectedCustomer?.notes ?? "",
            apptServicePackageId: item?.service?.id ?? "", // Thêm
            apptServicePackageName: item?.service?.name ?? "", // Thêm
            position: 1,
            isProxyBooking: false
          };
          if (state.isGroupAppointment) {
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
          position: 1,
          apptServicePackageId: '', // Thêm
          apptServicePackageName: '', // Thêm
          id: item.service.id, name: item.service.name, duration: item.service.duration, startTime: startTimeEntity,
          price: item.service.regularPrice, employeeId: item.technician?.id || "",
          isProxyBooking: false
        });
        if (state.isGroupAppointment) {
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
        id: params.selectedCustomer?.id || "",
        firstName: params.selectedCustomer?.firstName || "", lastName: params.selectedCustomer?.lastName || "",
        fullName: params.selectedCustomer?.firstName + " " + params.selectedCustomer?.lastName || "",
        email: params.selectedCustomer?.email || "",
        cellPhone: params.selectedCustomer?.cellPhone || "",
      },
      customerNote: params.selectedCustomer?.notes || "",
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
    const { listBookingServices } = get();

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
        comboItems = params.listItemMenu.filter((item: MenuItemEntity) => mapIds.has(item.id))
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
  deleteAppt: async (selectedStore) => {
    set({ isLoading: true })
    let user: LoginEntity = await appConfig.getUser()
    let rq: DeleteAppointmentRequest = {
      id: get().apptDetails?.id ?? '',
      deletedBy: {
        id: user.userId,
        name: selectedStore ? selectedStore.empUser.split('@')[0] : user.userName
      }
    }
    let result = await appointmentUsecase.deleteAppt(rq);
    set({ isLoading: false })
    return result
  }
}));



