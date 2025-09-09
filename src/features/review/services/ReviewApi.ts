import { CommonRequest } from "../../../types/CommonRequest";
import { httpClient } from "../../../core/network/HttpClient";
import { API_ENDPOINTS } from "../../../core/network/endpoints";
import { ApiResponse } from "../../../core/network/ApiResponse";
import { SurveyListResponse } from "../types/ReviewResponse";

export interface ApiReviewResponse<T = any> {
    result: boolean;
    errorMsg: string;
    dataSource?: T | null|undefined;
    [key: string]: any; // mở rộng cho các field khác như employeeId, isOwner...
  }
type ReviewResponse = ApiReviewResponse<SurveyListResponse>;


export const ReviewAPI= {
    getReview : async (request: CommonRequest):Promise<ReviewResponse> =>  {
        const response = await httpClient.post<ReviewResponse>(API_ENDPOINTS.REVIEW.GET_SERVEY_DATE_RANGE, request);
        return response.data;
    }
}



