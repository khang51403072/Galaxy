export interface EmployeeEntity {
    id: string;
    firstName: string;
    lastName: string;
    nickName: string;
    image: string;
    avatar: string;
    isUnassigned: boolean;
  }

export function getDisplayName(employee: EmployeeEntity): string {
  if (!employee.nickName || employee.nickName.trim() === "") {
    return `${employee.firstName} ${employee.lastName}`;
  } else {
    return employee.nickName;
  }
}

export interface WorkOrderEntity {
  nickName: string;
  ticketNumber: number;
  detail: string;
  ticketDate: string;
  serviceStartTime: string;
  serviceEndTime: string;
}



  