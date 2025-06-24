export interface ApiResponse<T = any> {
    result: boolean;
    errorMsg: string;
    data?: T | null;
    [key: string]: any; // mở rộng cho các field khác như employeeId, isOwner...
  }