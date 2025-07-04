import { Result } from '../../../shared/types/Result';
import { EmployeeEntity } from '../types/TicketResponse';
import { TicketError } from '../types/TicketError';

export interface TicketRepository {
  getEmployeeLookup(): Promise<Result<EmployeeEntity[], TicketError>>;
} 