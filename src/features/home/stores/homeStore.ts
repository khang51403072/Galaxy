import { StateCreator } from "zustand/vanilla";
import { ChartEntity, HomeEntity } from "../types/HomeResponse"
import { HomeError } from "../types/HomeError";
import { isSuccess, Result, success } from "../../../shared/types/Result";
import { keychainHelper, KeychainObject } from "../../../shared/utils/keychainHelper";
import { HomeUseCase } from "../usecase/HomeUseCase";
import { create } from "zustand";

// ===== STATE =====
export type ChartDisplayData = { label: string, value: number[] };
export type homeState = {
    homeData?: HomeEntity | null;
    isOwner: boolean | null;
    isLoading: boolean;
    isLoadingChart: boolean;
    error: string | null;
    chartData: ChartEntity[] | null;
    chartDisplayData: ChartDisplayData[];
    toggleSwitch: 'week' | 'month';
    json: KeychainObject | null;
    selectedStore: StoreEntity | null;
    notificationCount: number;
    companyProfile: CompanyProfileResponse | null;
    updateJson: (json: KeychainObject) => Promise<void>;
    getHomeData: () => Promise<Result<HomeEntity, HomeError>>;
    getChartData: () => Promise<Result<ChartEntity[], HomeError>>;
    setChartDisplayData: (data: ChartDisplayData[]) => void;
    setSelectedStore: (store: StoreEntity) => void;
    setNotificationCount: (count: number) => void;
    getCompanyProfile:()=>  Promise<Result<CompanyProfileResponse, Error>> 
}

// ===== Selector =====
export const homeSelectors = {
    selectHomeData: (state: homeState) => state.homeData,
    selectIsOwner: (state: homeState) => state.isOwner,
    selectIsLoading: (state: homeState) => state.isLoading,
    selectError: (state: homeState) => state.error,
    selectGetHomeData: (state: homeState) => state.getHomeData,
    selectGetChartData: (state: homeState) => state.getChartData,
    selectIsLoadingChart: (state: homeState) => state.isLoadingChart,
    selectToggleSwitch: (state: homeState) => state.toggleSwitch,
    selectJson: (state: homeState) => state.json,
    selectChartDisplayData: (state: homeState) => state.chartDisplayData,
    selectSelectedStore: (state: homeState) => state.selectedStore,
    selectSetSelectedStore: (state: homeState) => state.setSelectedStore,
    selectNotificationCount: (state: homeState) => state.notificationCount,
    selectSetNotificationCount: (state: homeState) => state.setNotificationCount,
    selectGetCompanyProfile: (state: homeState) => state.getCompanyProfile,
    selectCompanyProfile: (state: homeState)=> state.companyProfile
}
const appointmentRepository = new AppointmentRepositoryImplement();
const appointmentUsecase = new AppointmentUsecase(appointmentRepository);
// ===== HomeStore DI Creator =====
export const createHomeStore = (homeUsecase: HomeUseCase): StateCreator<homeState> => (set, get) => ({
    homeData: null,
    chartData: null,
    isOwner: null,
    isLoading: false,
    isLoadingChart: false,
    toggleSwitch: 'week',
    error: null,
    json: null,
    selectedStore: null,
    notificationCount: 0,
    chartDisplayData: [], // Khởi tạo rỗng, sẽ được set khi có data thực sự
    companyProfile: null,
    getHomeData: async () => {
        const js = await appConfig.getUser();
        set({ isLoading: true, error: null, json: js });
        const result = js?.isOwner 
            ? await homeUsecase.getHomeDataOwner({employeeId: js.employeeId || ''}) 
            : await homeUsecase.getHomeData({employeeId: js?.employeeId || ''});
        if(isSuccess(result)) 
            set({ homeData: result.value, isLoading: false, error: null, isOwner: js?.isOwner });
        else 
            set({ error: result.error.message, isLoading: false });
        return result;
    },
    getChartData: async () => {
        set({ isLoadingChart: true, error: null });
        const json = get().json
        let result : Result<ChartEntity[], HomeError>;
        let chartType = get().toggleSwitch === 'week' ? 7 : 30;
        if(json?.isOwner) {
            result = await homeUsecase.getChartDataOwner({employeeId: json?.employeeId || '', chartType: chartType});
        } else {
            result = await homeUsecase.getChartData({employeeId: json?.employeeId || '', chartType: chartType});
        }
        if(isSuccess(result)) {
            set({ chartData: result.value, isLoadingChart: false, error: null });
            // Tự động convert data để hiển thị chart
            if (result.value && result.value.length > 0) {
                const displayData = result.value.map(item => {
                    return {
                        label: get().toggleSwitch === 'week' 
                            ? item.dayOfWeek.substring(0, 3)
                            : item.weekStartDate?.dateOfMonth() + "-" + item.weekEndDate?.dateOfMonth(),
                        value: [item.saleAmount, item.nonCashTipAmount]
                    }
                });
                set({ chartDisplayData: displayData });
            }
        } else {
            set({ error: result.error.message, isLoadingChart: false });
        }
        return result;
    },
    updateJson: async (json: KeychainObject) => {
        await appConfig.saveUser(json);
        set({ json: json });
    },
    setChartDisplayData: (data) => set({ chartDisplayData: data }),
    setSelectedStore: (store) => set({ selectedStore: store }),
    setNotificationCount: (count) => set({ notificationCount: count }),
    getCompanyProfile: async (): Promise<Result<CompanyProfileResponse, Error>> => {
        if (get().companyProfile != null) {
            return success(get().companyProfile!);
        }
        const response = await appointmentUsecase.apptCompanyProfile();
        if(isSuccess(response))
        {
            set({companyProfile: response.value})    
        }
        return response;
      },
});

// Khởi tạo real usecase ở production
import { ApiHomeRepository } from '../repositories/ApiHomeRepository';
import { HomeAPI } from '../services/HomeApi';
import { appConfig } from "@/shared/utils/appConfig";
import { StoreEntity } from "../screens/subScreen/SwitchStoreScreen";
import { CompanyProfileResponse } from "@/features/appointment/types/CompanyProfileResponse";
import { AppointmentRepositoryImplement } from "@/features/appointment/repositories/AppointmentRepositoryImplement";
import { AppointmentUsecase } from "@/features/appointment/usecases/AppointmentUsecase";
const realHomeUseCase = new HomeUseCase(new ApiHomeRepository(HomeAPI));
export const useHomeStore = create<homeState>()(createHomeStore(realHomeUseCase));
