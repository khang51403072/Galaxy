import { WorkHours } from "@/features/appointment/types/ApptResResponse";

/**
 * Định nghĩa các thuộc tính của EmployeeEntity
 * Khi thêm mới thuộc tính, phải bổ sung vào hàm isEmployee
 */
export interface EmployeeEntity {
    __type: 'employee';
    id: string;
    firstName: string;
    lastName: string;
    nickName: string;
    image: string;
    avatar: string;
    isUnassigned: boolean;
    workHours?: WorkHours;
  }


/**
 * Kiểm tra xem một đối tượng có phải là EmployeeEntity không
 * @param obj - Đối tượng cần kiểm tra
 * @returns true nếu obj là EmployeeEntity, false nếu không
 */
export function isEmployee(obj: any): obj is EmployeeEntity {
  return (
    obj &&
    obj.__type === 'employee'
  );
}

export interface WorkOrderEntity {
  nickName: string;
  ticketNumber: number;
  detail: any;
  ticketDate: string;
  serviceStartTime: string;
  serviceEndTime: string;
}
export function getDisplayName(employee: EmployeeEntity): string {
  if (!employee.nickName || employee.nickName.trim() === "") {
    return `${employee.firstName} ${employee.lastName}`;
  } else {
    return employee.nickName;
  }
}


  