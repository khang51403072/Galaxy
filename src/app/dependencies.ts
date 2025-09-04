import { AuthUseCase } from "@/features/auth/usecase/AuthUsecase";
import { ApiHomeRepository } from "@/features/home/repositories/ApiHomeRepository";
import { HomeAPI } from "@/features/home/services/HomeApi";
import { HomeUseCase } from "@/features/home/usecase/HomeUseCase";
export const homeUsecase = new HomeUseCase(new ApiHomeRepository(HomeAPI));
