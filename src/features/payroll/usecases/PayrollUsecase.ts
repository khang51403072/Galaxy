import { PayrollRepository } from '../repositories/PayrollRepository';

export class PayrollUsecase {
  constructor(private repository: PayrollRepository) {}

  async getPayroll(request: any) {
    return this.repository.getPayroll(request);
  }

  async getPayrollOwner(request: any) {
    return this.repository.getPayrollOwner(request);
  }
} 