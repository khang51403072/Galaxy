import { TicketError } from "../../ticket/types/TicketError";
import { Result } from "../../../shared/types/Result";

export interface PayrollRepository {
  getPayroll(request: any): Promise<Result<string, TicketError>>;
  getPayrollOwner(request: any): Promise<Result<string, TicketError>>;
} 