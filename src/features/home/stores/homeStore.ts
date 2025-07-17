import { StateCreator } from "zustand/vanilla";
import { ChartEntity, HomeEntity } from "../types/HomeResponse"
import { HomeError } from "../types/HomeError";
import { isSuccess, Result } from "../../../shared/types/Result";
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
    updateJson: (json: KeychainObject) => Promise<void>;
    getHomeData: () => Promise<Result<HomeEntity, HomeError>>;
    getChartData: () => Promise<Result<ChartEntity[], HomeError>>;
    setChartDisplayData: (data: ChartDisplayData[]) => void;
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
}

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
    chartDisplayData: [],
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
        if(isSuccess(result)) set({ chartData: result.value, isLoadingChart: false, error: null });
        else set({ error: result.error.message, isLoadingChart: false });
        return result;
    },
    updateJson: async (json: KeychainObject) => {
        await appConfig.saveUser(json);
        set({ json: json });
    },
    setChartDisplayData: (data) => set({ chartDisplayData: data }),
});

// Khởi tạo real usecase ở production
import { ApiHomeRepository } from '../repositories/ApiHomeRepository';
import { HomeAPI } from '../services/HomeApi';
import { appConfig } from "@/shared/utils/appConfig";
const realHomeUseCase = new HomeUseCase(new ApiHomeRepository(HomeAPI));
export const useHomeStore = create<homeState>()(createHomeStore(realHomeUseCase));
