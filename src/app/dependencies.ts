import { AuthUseCase } from "@/features/auth/usecase/AuthUsecase";
import { ApiHomeRepository } from "@/features/home/repositories/ApiHomeRepository";
import { HomeAPI } from "@/features/home/services/HomeApi";
import { HomeUseCase } from "@/features/home/usecase/HomeUseCase";
import { ReviewRepositoryImplement } from "@/features/review/repositories/ReviewRepositoryImplement";
import { ReviewAPI } from "@/features/review/services/ReviewApi";
import { ReviewUsecase } from "@/features/review/usecases/ReviewUsecase";
export const homeUsecase = new HomeUseCase(new ApiHomeRepository(HomeAPI));
export const reviewUsecase = new ReviewUsecase(new ReviewRepositoryImplement(ReviewAPI));