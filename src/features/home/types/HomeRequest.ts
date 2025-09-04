export interface HomeOwnerRequest {
  employeeId: string;
}

export interface HomeChartRequest {
  employeeId: string;
  chartType?: number;
}



export interface SummaryRequest {
  fromDate: string; //yyyy-MM-dd
  toDate?: string;
}