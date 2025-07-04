export interface EmployeeInfo {
    id: string;
    firstName: string;
    lastName: string;
    nickName: string;
    avatar: string;
  }
  
  export interface HomeEntity {
  totalSale: number;
  nonCashTip: number;
  employeeInfo: EmployeeInfo;
}

export interface ChartEntity {
  saleAmount: number;
  nonCashTipAmount: number;
  businessDate?: string;
  dayOfWeek: string;
  weekStartDate?: string;
  weekEndDate?: string;
}

export interface ChartResponse {
  result: boolean;
  errorMsg: string;
  data: ChartEntity[];
}


