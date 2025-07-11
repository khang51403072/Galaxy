import { StateCreator } from "zustand/vanilla";
import { ChartEntity, HomeEntity } from "../types/HomeResponse"
import { HomeError } from "../types/HomeError";
import { isSuccess, Result } from "../../../shared/types/Result";
import { HomeAPI } from "../services/HomeApi";
import { keychainHelper, KeychainObject } from "../../../shared/utils/keychainHelper";
import { HomeUseCase } from "../usecase/HomeUseCase";
import { HomeRepository } from "../repositories/HomeRepository";
import { ApiHomeRepository } from "../repositories/ApiHomeRepository";
import { create } from "zustand";


// ===== STATE =====
export type homeState = {
    homeData?: HomeEntity | null;
    isOwner: boolean | null;
    isLoading: boolean;
    isLoadingChart: boolean;
    error: string | null;
    chartData: ChartEntity[] | null;
    toggleSwitch: 'week' | 'month';
    json: KeychainObject | null;
    updateJson: (json: KeychainObject) => Promise<void>;
    getHomeData: () => Promise<Result<HomeEntity, HomeError>>;
    getChartData: () => Promise<Result<ChartEntity[], HomeError>>;
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
}

// ===== HomeCreator =====
const homeStoreCreator: StateCreator<homeState> = (set, get) => {
    let homeUsecase:HomeUseCase;
    let homeRepository:HomeRepository;
    const loadModules = async () => {
        if(homeRepository == null) {
            homeRepository = new ApiHomeRepository(HomeAPI);
        }

        if(homeUsecase == null) {
            homeUsecase = new HomeUseCase(homeRepository);
        }
    }
    loadModules();
    return {
        homeData: null,
        chartData: null,
        isOwner: null,
        isLoading: false,
        isLoadingChart: false,
        toggleSwitch: 'week',
        error: null,
        json: null,
        getHomeData: async () => {
            set({ isLoading: true, error: null });
            const json = await keychainHelper.getObject();
            const result = json?.isOwner ? await homeUsecase?.getHomeDataOwner({employeeId: json?.employeeId || ''}) : await homeUsecase?.getHomeData({employeeId: json?.employeeId || ''});
            if(isSuccess(result)) set({ homeData: result.value, isLoading: false, error: null, isOwner: json?.isOwner });
            else set({ error: result.error.message, isLoading: false });
            return result;
        },
        getChartData: async () => {
            set({ isLoadingChart: true, error: null });
            const json = await keychainHelper.getObject();
            let result : Result<ChartEntity[], HomeError>;
            let chartType = get().toggleSwitch === 'week' ? 7 : 30;
            if(json?.isOwner) {
                result = await homeUsecase?.getChartDataOwner({employeeId: json?.employeeId || '', chartType: chartType});
                
            } else {
                result = await homeUsecase?.getChartData({employeeId: json?.employeeId || '', chartType: chartType});
            }
            if(isSuccess(result)) set({ chartData: result.value, isLoadingChart: false, error: null });
            else set({ error: result.error.message, isLoadingChart: false });
            return result;
        },
        updateJson: async (json: KeychainObject) => {
            await keychainHelper.saveObject(json);
            set({ json: json });
        }
    }
}

export const useHomeStore = create<homeState>()(homeStoreCreator);
