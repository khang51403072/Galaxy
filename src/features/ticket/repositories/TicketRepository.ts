import { Result } from '../../../shared/types/Result';
import { EmployeeEntity, WorkOrderEntity } from '../types/TicketResponse';
import { TicketError } from '../types/TicketError';
import { TicketRequest } from '../types/TicketRequest';

export interface TicketRepository {
  getEmployeeLookup(): Promise<Result<EmployeeEntity[], TicketError>>;
  getWorkOrders(request: TicketRequest): Promise<Result<WorkOrderEntity[], TicketError>>;
  getWorkOrderOwner(): Promise<Result<WorkOrderEntity[], TicketError>>;
} 