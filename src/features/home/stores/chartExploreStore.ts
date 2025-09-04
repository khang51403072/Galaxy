import { StateCreator } from "zustand/vanilla";
import { ChartEntity, HomeEntity } from "../types/HomeResponse"
import { HomeUseCase } from "../usecase/HomeUseCase";
import { create } from "zustand";
import { ChartDisplayData, useHomeStore } from "./homeStore";
import { homeUsecase } from "@/app/dependencies";
import { isSuccess } from "@/shared/types/Result";
import { SummaryRequest } from "../types/HomeRequest";
import { ReportData } from "../types/SummaryResponse";
import { DropdownOption } from "@/shared/components/XDropdown";
export const dropdownOptions = [
    "This week",
    "Last week",
    "This month",
    "Last month",
]
// Định nghĩa các type để code an toàn và dễ đọc hơn
type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
type DateRangeOption = 'This week' | 'Last week' | 'This month' | 'Last month';


/**
 * Helper function để định dạng một đối tượng Date thành chuỗi "yyyy-MM-dd".
 * @param date - Đối tượng Date cần định dạng.
 * @returns Chuỗi ngày tháng đã được định dạng.
 */
function formatDate(date: Date): string {
    const year = date.getFullYear();
    // getMonth() trả về từ 0-11, nên cần +1. padStart để thêm '0' nếu cần.
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Tính toán ngày bắt đầu và kết thúc cho một khoảng thời gian được chọn,
 * dựa trên ngày bắt đầu của tuần được tùy chỉnh.
 *
 * @param weekStartsOn - Ngày bắt đầu của tuần ('Sunday', 'Monday', ...).
 * @param option - Khoảng thời gian cần tính ('This week', 'Last week', ...).
 * @returns Một object chứa startDate và endDate theo định dạng "yyyy-MM-dd".
 */
export function calculateDateRange(weekStartsOn: DayOfWeek, option: DateRangeOption): SummaryRequest {
    // Ánh xạ tên ngày sang chỉ số (0=Chủ nhật, 1=Thứ hai, ...)
    const dayIndexMap: { [key in DayOfWeek]: number } = {
        'Sunday': 0,
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5,
        'Saturday': 6,
    };

    const startDayIndex = dayIndexMap[weekStartsOn];
    if (startDayIndex === undefined) {
        throw new Error("Invalid weekStartsOn value. Please use a full day name like 'Monday'.");
    }

    const today = new Date();
    // Xóa thông tin giờ, phút, giây để tránh lỗi tính toán do chênh lệch thời gian
    today.setHours(0, 0, 0, 0);

    let fromDate: Date;
    let toDate: Date;

    switch (option) {
        case "This week": {
            const todayDayIndex = today.getDay();
            let diff = todayDayIndex - startDayIndex;
            
            // Nếu diff < 0, có nghĩa là ngày bắt đầu của tuần nằm trong tuần trước (ví dụ: hôm nay là CN, tuần bắt đầu từ T2)
            if (diff < 0) {
                diff += 7;
            }

            fromDate = new Date(today);
            fromDate.setDate(today.getDate() - diff);

            toDate = new Date(fromDate);
            toDate.setDate(fromDate.getDate() + 6);
            break;
        }

        case "Last week": {
            const todayDayIndex = today.getDay();
            let diff = todayDayIndex - startDayIndex;
            if (diff < 0) {
                diff += 7;
            }

            // Lùi về ngày bắt đầu của tuần này, sau đó lùi thêm 7 ngày
            fromDate = new Date(today);
            fromDate.setDate(today.getDate() - diff - 7);

            toDate = new Date(fromDate);
            toDate.setDate(fromDate.getDate() + 6);
            break;
        }

        case "This month": {
            // Ngày bắt đầu là ngày 1 của tháng hiện tại
            fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
            // Ngày kết thúc là ngày 0 của tháng tiếp theo (tức là ngày cuối cùng của tháng này)
            toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            break;
        }

        case "Last month": {
            // Ngày bắt đầu là ngày 1 của tháng trước
            fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            // Ngày kết thúc là ngày 0 của tháng này (tức là ngày cuối cùng của tháng trước)
            toDate = new Date(today.getFullYear(), today.getMonth(), 0);
            break;
        }
        
        default:
            throw new Error("Invalid option provided.");
    }
    
    return {
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),
    };
}
// ===== STATE =====
export type chartExploreState = {
    chartData: ChartEntity[] | null;
    chartDisplayData: ChartDisplayData[];
    isLoading: boolean;
    toggleSwitch: 'week' | 'month';
    reportData?: ReportData | null;
    selectedOption?: DropdownOption;
    setSelectedOption:(value: DropdownOption)=>void;
    getChartExplore: (option: string) => void
}

// ===== HomeStore DI Creator =====
export const createChartExploreStore = (): StateCreator<chartExploreState> => (set, get) => ({
    chartData: [],
    chartDisplayData: [],
    isLoading: false,
    toggleSwitch: 'week',
    reportData: null,
    selectedOption: {label: dropdownOptions[0], value: dropdownOptions[0]},
    setSelectedOption: (value) => set({selectedOption: value}),
    getChartExplore: async (option) => {
        try{
            set({isLoading: true})
            const homeStoreState = useHomeStore.getState();
            const weekStartsOn: DayOfWeek =  (homeStoreState.companyProfile?.data.weekStartsOn??"Monday") as DayOfWeek;
            const rq = calculateDateRange(weekStartsOn,option as DateRangeOption) 
            const result = await homeUsecase.getSummaryData(rq);
            console.log("result",result)
            if(isSuccess(result))
            {   
                let chartDisplayData
                if(option == dropdownOptions[0] || option == dropdownOptions[1])
                {
                    chartDisplayData  =  result.value.revenueDataDaily.map(
                        e=>({ label: e.displayDate, value: [e.sales, e.tips] } as ChartDisplayData )
                    )
                }
                else {
                    chartDisplayData  =  result.value.revenueDataWeekly.map(
                        e=>({ label: e.displayDate.replace('-', '\n'), value: [e.sales, e.tips] } as ChartDisplayData )
                    )
                }
               
                console.log("chartDisplayData",chartDisplayData)
                set({isLoading: false, chartDisplayData: chartDisplayData, reportData: result.value})
            }
            else{
                set({isLoading: false})
            }
        }
        catch (e)
        {
            console.log('getChartExplore',e)
        }
        
    }
});

export const useChartExploreStore = create<chartExploreState>()(createChartExploreStore());
