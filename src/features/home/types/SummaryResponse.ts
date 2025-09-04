/**
 * Đại diện cho một mục dữ liệu doanh thu theo ngày hoặc tuần.
 */
export interface RevenueDataItem {
  date: string;          // Chuỗi ngày tháng theo chuẩn ISO (ví dụ: "2025-08-01T00:00:00")
  displayDate: string;   // Chuỗi ngày tháng đã được định dạng để hiển thị (ví dụ: "08/01" hoặc "08/01-08/02")
  sales: number;
  tips: number;
  customerCount: number;
}

/**
 * Đại diện cho chi tiết của một loại thanh toán cụ thể (ví dụ: Visa, Mastercard).
 */
export interface PaymentTypeDetail {
  id: string;
  paymentType: string;   // Ví dụ: "Credit", "Cash"
  paymentName: string;   // Ví dụ: "Visa", "Cash"
  totalAmount: number;
  totalTip: number;
  totalTax: number;
  transactionCount: number;
}

/**
 * Đại diện cho dữ liệu tổng hợp của một loại thanh toán chính.
 */
export interface PaymentTypeData {
  paymentType: string;   // Ví dụ: "Cash", "Credit", "Gift", "Loyalty"
  totalAmount: number;
  percentage: number;
  details: PaymentTypeDetail[];
}

/**
 * Đại diện cho doanh thu của một dịch vụ cụ thể.
 */
export interface ServiceRevenueData {
  serviceName: string;
  totalSales: number;
}

/**
 * Đại diện cho dữ liệu lương tóm tắt của một kỹ thuật viên.
 */
export interface SummaryPayrollItem {
  id: string;
  technicianName: string;
  totalPayout: number;
  payrollType: 'Commission' | 'Hourly' | 'Daily' | string; // Sử dụng union type để gợi ý các giá trị phổ biến
}

/**
 * Đại diện cho dữ liệu tổng hợp lương theo từng loại.
 */
export interface PayrollTotalItem {
  payrollType: 'Commission' | 'Hourly' | 'Daily' | string;
  totalAmount: number;
  percentage: number;
}

/**
 * Interface chính, bao trùm toàn bộ cấu trúc dữ liệu JSON.
 * Đây là type bạn sẽ sử dụng để hứng dữ liệu từ API.
 */
export interface ReportData {
  totalSales: number;
  totalTips: number;
  totalGiftSales: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  revenueDataDaily: RevenueDataItem[];
  revenueDataWeekly: RevenueDataItem[];
  paymentTypeData: PaymentTypeData[];
  serviceRevenueData: ServiceRevenueData[];
  summaryPayroll: SummaryPayrollItem[];
  payrollTotal: PayrollTotalItem[];
}

export interface ApiReportResponse<T = any> {
    result: boolean;
    errorMsg: string;
    dataSource?: T | null ;
    [key: string]: any; // mở rộng cho các field khác như employeeId, isOwner...
  }