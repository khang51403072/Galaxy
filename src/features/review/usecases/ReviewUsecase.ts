import { CommonRequest } from "@/types/CommonRequest";
import { ReviewRepository } from "../repositories/ReviewRepository";
import { RespondRequest } from "../types/RepondRequest";

export class ReviewUsecase {
  constructor(private repository: ReviewRepository) {}
  async getSurvey(request: CommonRequest) {
    return await this.repository.getReview(request);
  }

  async respondSurvey(request: RespondRequest) {
    return await this.repository.respondSurvey(request);
  }
  
} 