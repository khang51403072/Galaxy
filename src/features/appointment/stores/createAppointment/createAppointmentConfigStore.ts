import { create } from 'zustand';
import { ApptRes, WorkHours } from '../../types/ApptResResponse';
import { isFailure } from '../../../../shared/types/Result';
import { ApptType, createApptType } from '../../types/AppointmentType';
import { CategoryEntity } from '../../types/CategoriesResponse';
import { MenuItemEntity } from '../../types/MenuItemResponse';
import { EmployeeEntity } from '@/features/ticket/types/TicketResponse';
import { CompanyProfileResponse } from '../../types/CompanyProfileResponse';
import { appointmentUsecase } from '@/app/dependencies';
// --- STATE AND ACTIONS TYPE ---
export type CreateAppointmentConfigState = {
    error: string | null;
    isLoading: boolean;
    listApptType: ApptType[];
    listCategories: CategoryEntity[];
    listItemMenu: MenuItemEntity[];
    listEmployeeOnWork: EmployeeEntity[];
    companyProfile?: CompanyProfileResponse;
    listApptResource: ApptRes[];

    // --- ACTIONS ---
    reset: () => void;
    loadConfigData: (listEmployee: EmployeeEntity[]) => Promise<void>;
};

// --- INITIAL STATE ---
export const initialFormState = {
    isLoading: false,
    error: null,
    listCategories: [],
    listItemMenu: [],
    companyProfile: undefined,
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
};

export const useCreateAppointmentConfigStore = create<CreateAppointmentConfigState>((set, get) => ({
    ...initialFormState,
    reset: () => set({ ...initialFormState }),
    loadConfigData: async (listEmployee: EmployeeEntity[]) => {
        set({ isLoading: true, error: null });
        const newState: Partial<CreateAppointmentConfigState> = { isLoading: false }
        if (get().listApptResource.length > 0 && get().listItemMenu.length > 0 
            && get().listCategories.length > 0 && get().companyProfile != null) return set({...newState})
        
        const [categoriesResponse, menuItemsResponse, apptResource, companyProfileResponse] = await Promise.all([
            appointmentUsecase.getCategories(),
            appointmentUsecase.getMenuItems(),
            appointmentUsecase.getApptResource(),
            appointmentUsecase.apptCompanyProfile(),
        ]);
        if (isFailure(categoriesResponse)) {
            newState.error = categoriesResponse.error.message;
            return set({ ...newState })
        }
        if (isFailure(menuItemsResponse)) {
            newState.error = menuItemsResponse.error.message;
            return set({ ...newState })
        }
        if (isFailure(apptResource)) {
            newState.error = apptResource.error.message;
            return set({ ...newState })
        }
        if (isFailure(companyProfileResponse)) {
            newState.error = companyProfileResponse.error.message;
            return set({ ...newState })
        }

        ////category and menu
        newState.listItemMenu = menuItemsResponse.value;
        newState.listCategories = categoriesResponse.value.filter((e: CategoryEntity) => e.categoryType === "Service" || e.isHide === false);
        // Company Profile & Appt Type Colors
        newState.companyProfile = companyProfileResponse.value;
        newState.listApptType = [...get().listApptType];
        if (newState.companyProfile) {
            newState.listApptType[0].bgColor = newState.companyProfile.data.posTheme.miscBackColor;
            newState.listApptType[1].bgColor = newState.companyProfile.data.posTheme.newCustomerBackColor;
            newState.listApptType[2].bgColor = newState.companyProfile.data.posTheme.heldOnBackColor;
            newState.listApptType[3].bgColor = newState.companyProfile.data.posTheme.nonRequestBackColor;
            newState.listApptType[4].bgColor = newState.companyProfile.data.posTheme.walkinBackColor;
            newState.listApptType[5].bgColor = newState.companyProfile.data.posTheme.onlineBackColor;
        }
        // Appt Resource & Employee on Work
        newState.listApptResource = apptResource.value.data as ApptRes[];
        const mapApptResource = new Map<string, WorkHours>();
        newState.listApptResource.forEach((item) => mapApptResource.set(item.id, item.workHours));
        newState.listEmployeeOnWork = listEmployee.map((item) => ({ ...item, workHours: mapApptResource.get(item.id) }));
        set({...newState});
    },

}));



