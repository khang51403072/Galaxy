import { TicketRepositoryImplement } from '../repositories/TicketRepositoryImplement';
import { TicketApi } from '../services/TicketApi';
import { Result } from '../../../shared/types/Result';
import { EmployeeEntity, WorkOrderEntity } from '../types/TicketResponse';
import { TicketRepository } from '../repositories/TicketRepository';
import { TicketRequest } from '../types/TicketRequest';


export class TicketUsecase {
  constructor(private ticketRepository: TicketRepository) {}

  async getEmployeeLookup(): Promise<Result<EmployeeEntity[], any>> {
    return await this.ticketRepository.getEmployeeLookup();
  }

  async getWorkOrders(request: TicketRequest  ): Promise<Result<WorkOrderEntity[], any>> {
    return await this.ticketRepository.getWorkOrders(request);
  }

  async getWorkOrderOwner(): Promise<Result<WorkOrderEntity[], any>> {
    return await this.ticketRepository.getWorkOrderOwner();
  }
} 