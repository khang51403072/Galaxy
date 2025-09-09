import { CommonRequest } from "@/types/CommonRequest";
import { ReviewRepository } from "../repositories/ReviewRepository";

export class ReviewUsecase {
  constructor(private repository: ReviewRepository) {}
  async getSurvey(request: CommonRequest) {
    return await this.repository.getReview(request);
  }

  
} 