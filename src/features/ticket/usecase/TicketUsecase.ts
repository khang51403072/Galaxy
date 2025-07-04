import { TicketRepositoryImplement } from '../repositories/TicketRepositoryImplement';
import { TicketApi } from '../services/TicketApi';
import { Result } from '../../../shared/types/Result';
import { EmployeeEntity } from '../types/TicketResponse';
import { TicketRepository } from '../repositories/TicketRepository';


export class TicketUsecase {
  constructor(private ticketRepository: TicketRepository) {}

  async getEmployeeLookup(): Promise<Result<EmployeeEntity[], any>> {
    return await this.ticketRepository.getEmployeeLookup();
  }
} 