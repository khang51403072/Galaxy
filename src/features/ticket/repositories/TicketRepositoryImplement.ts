import { TicketRepository } from './TicketRepository';
import { TicketApi } from '../services/TicketApi';
import { Result, success, failure } from '../../../shared/types/Result';
import { TicketError } from '../types/TicketError';
import { EmployeeEntity } from '../types/TicketResponse';

export class TicketRepositoryImplement implements TicketRepository {
  constructor(private ticketApi: typeof TicketApi) {}

  

  async getEmployeeLookup(): Promise<Result<EmployeeEntity[], TicketError>> {
    try {
      const response = await this.ticketApi.getEmployeeLookup();
      if (!response.result || !response.data) {
        return failure(new TicketError(response.errorMsg || 'Lấy danh sách nhân viên thất bại', 'EMPLOYEE_LOOKUP_ERROR'));
      }
      return success(response.data);
    } catch (error: any) {
      return failure(new TicketError(error.message, 'SERVER_ERROR'));
    }
  }
} 