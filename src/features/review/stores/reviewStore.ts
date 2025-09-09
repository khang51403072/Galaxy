import { DropdownOption } from '@/shared/components/XDropdown';
import { create } from 'zustand';
import { SurveyItem, SurveyListResponse } from '../types/ReviewResponse';
import { reviewUsecase } from '@/app/dependencies';
import { CommonRequest } from '@/types/CommonRequest';
import { isSuccess } from '@/shared/types/Result';

const defaultOptions = 
  {label: "Last 7 days", value: 7}
/**
 * Đếm số lượng comment có nội dung cho mỗi mức rating (1-5 sao).
 *
 * @param surveys - Mảng các đối tượng SurveyItem.
 * @returns Một object chứa số lượng comment cho mỗi mức rating và tổng số.
 */
export function countCommentsByRating(surveys: SurveyItem[]): any {
  // 1. Khởi tạo một đối tượng để lưu kết quả, bắt đầu tất cả bằng 0.
  const counts = {
    star1: 0,
    star2: 0,
    star3: 0,
    star4: 0,
    star5: 0,
    total: 0,
  };

  // Xử lý trường hợp đầu vào không hợp lệ
  if (!surveys || surveys.length === 0) {
    return counts;
  }

  // 2. Lặp qua từng mục khảo sát trong mảng
  for (const survey of surveys) {
    // 3. Chỉ xử lý nếu 'comment' không phải null và có nội dung thực sự (sau khi đã cắt bỏ khoảng trắng)
    if (survey.comment && survey.comment.trim() !== '') {
      
      // Tăng tổng số comment hợp lệ
      counts.total++;

      // 4. Dùng switch-case để tăng biến đếm tương ứng với rating
      switch (survey.rating) {
        case 1:
          counts.star1++;
          break;
        case 2:
          counts.star2++;
          break;
        case 3:
          counts.star3++;
          break;
        case 4:
          counts.star4++;
          break;
        case 5:
          counts.star5++;
          break;
        default:
          // Bỏ qua các rating không hợp lệ (ví dụ: 0 hoặc lớn hơn 5)
          break;
      }
    }
  }

  // 5. Trả về đối tượng kết quả
  return counts;
}
export type ReviewState = {
  selectedFilterDuration: DropdownOption;
  summaryAverageScore: number;
  isLoading: boolean;
  error: string | null;
  totalScore: number;
  json?: string | null;
  listOfSurvey: SurveyItem[];
  starTotal5: number,
  starTotal4: number
  starTotal3: number
  starTotal2: number
  starTotal1: number
  selectedStar?: string
  setSelectedFilterDuration: (v: DropdownOption) => void,
  getSurvey: () => void,
  setSelectedStar: (v?:string) => void
};



const initialState = {
  isLoading: false,
  error: null,
  json: undefined,
  selectedFilterDuration: defaultOptions,
  totalScore: 0,
  summaryAverageScore: 0,
  listOfSurvey: [],
  starTotal5: 0,
  starTotal4: 0,
  starTotal3: 0,
  starTotal2: 0,
  starTotal1: 0,
  selectedStar: undefined
};

// Refactor: nhận payrollUsecase, ticketUsecase từ ngoài vào
export const createReviewStore = () => (set: any, get: any) => ({
  ...initialState,
  setSelectedFilterDuration: (v:DropdownOption) => set({selectedFilterDuration: v}),
  getSurvey: async () => {
    set({isLoading: true})
    let endDate = new Date()
    let startDate = new Date()
    startDate.setDate(endDate.getDate()-get().selectedFilterDuration.value)
    let rq: CommonRequest = {
      dateStart: startDate.format('yyyy-MM-dd'),
      dateEnd: endDate.format('yyyy-MM-dd')
    }
    let result = await reviewUsecase.getSurvey(rq)
    if(isSuccess(result))
    {
      let listOfSurvey = result.value
      let sum = listOfSurvey.reduce<number>((l,r)=>l+r.rating,0)
      let counts = countCommentsByRating(listOfSurvey)
      set({
        isLoading: false, 
        listOfSurvey: listOfSurvey, 
        totalScore: listOfSurvey.length, 
        summaryAverageScore: counts.total/listOfSurvey.length,
        starTotal1: counts.star1,
        starTotal2: counts.star2,
        starTotal3: counts.star3,
        starTotal4: counts.star4,
        starTotal5: counts.star5,
      })
    }
    else{
      set({isLoading: false, error: result.error.message});
    }
   
  },
  setSelectedStar: (v?:string) => set({selectedStar: v})

});

export const useReviewStore = create<ReviewState>()(createReviewStore()); 
