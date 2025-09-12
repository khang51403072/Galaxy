import { TicketError } from "../../ticket/types/TicketError";
import { Result } from "../../../shared/types/Result";
import { CommonRequest } from "@/types/CommonRequest";
import { SurveyListResponse } from "../types/ReviewResponse";
import { RespondRequest } from "../types/RepondRequest";

export interface ReviewRepository {
  getReview(request: CommonRequest): Promise<Result<SurveyListResponse, TicketError>>;
  respondSurvey(request: RespondRequest): Promise<Result<SurveyListResponse, TicketError>>;
} 