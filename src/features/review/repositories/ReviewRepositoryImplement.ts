import { failure, Result, success } from "@/shared/types/Result";
import { ReviewRepository } from "./ReviewRepository";
import { SurveyListResponse } from "../types/ReviewResponse";
import { ReviewAPI } from "../services/ReviewApi";
import { TicketError } from "@/features/ticket/types/TicketError";
import { CommonRequest } from "@/types/CommonRequest";
import { HomeAPI } from "@/features/home/services/HomeApi";

export class ReviewRepositoryImplement implements ReviewRepository {
  constructor(private api: typeof ReviewAPI) {}
  async getReview(request: CommonRequest): Promise<Result<SurveyListResponse, TicketError>> {
    try{
      const response = await this.api.getReview(request);
      return success(response.dataSource as SurveyListResponse);
    } catch (error: any) {
      return failure(new TicketError(error.message, 'GET_PAYROLL_ERROR'));
    }
  }
  
} 