import { PayrollRepository } from './PayrollRepository';
import * as PayrollApi from '../services/PayrollApi';
import { failure, Result, success } from '../../../shared/types/Result';
import { TicketError } from '../../ticket/types/TicketError';

export class PayrollRepositoryImplement implements PayrollRepository {
  async getPayroll(request: any): Promise<Result<string, TicketError>> {
    try{
      const response = await PayrollApi.getPayroll(request);
      return success(response.data as string);
    } catch (error: any) {
      return failure(new TicketError(error.message, 'GET_PAYROLL_ERROR'));
    }
  }
  async getPayrollOwner(request: any): Promise<Result<string, TicketError>> {
    try{
      const response = await PayrollApi.getPayrollOwner(request);
      return success(response.data as string);
    } catch (error: any) {
      return failure(new TicketError(error.message, 'GET_PAYROLL_OWNER_ERROR'));
    }
  }
} 