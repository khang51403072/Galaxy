
// Lớp cho mỗi mục trong danh sách "attendances"
export interface Attendance {
  id: string | null;
  employeeId: string | null;
  firstName: string | null;
  lastName: string | null;
  nickName: string | null;
  avatar: string | null;
  businessDate: string | null;
  clockInDt: string | null;
  clockOutDt: string | null; // Có thể null
  isMultiClockIn: boolean;
}

// Lớp cho đối tượng "cashReceived"
export interface CashReceived {
  employeeId: string | null;
  employeeName: string | null;
  tip: number;
  cashReceived: number;
  date: string | null;
}

// Lớp cho đối tượng "dropCash"
export interface DropCash {
  employeeId: string | null;
  employeeName: string | null;
  cashInAmount: number;
  cashOutAmount: number;
  date: string | null;
}

// Lớp cho mỗi mục trong danh sách "techniciansReport"
export interface TechnicianReport {
  id: string | null;
  employeeId: string | null;
  report: string | null;
  cashReceived: CashReceived | null;
  dropCash: DropCash | null;
}

// Lớp cho mỗi mục trong danh sách "techniciansDetailSummaryReport"
export interface TechnicianDetailSummaryReport {
  employeeId: string | null;
  employeeName: string | null;
  report: string | null;
}

// Interface gốc, chứa toàn bộ dữ liệu từ API
export interface CloseOutOwnerModel {
  attendances: Attendance[];
  salesReport: string | null;
  technicianSummaryReport: string | null;
  techniciansReport: TechnicianReport[];
  techniciansDetailSummaryReport: TechnicianDetailSummaryReport[];
}