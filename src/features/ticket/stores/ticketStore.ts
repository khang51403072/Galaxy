import { create } from "zustand";
import { TicketUsecase } from "../usecase/TicketUsecase";
import { EmployeeEntity, WorkOrderEntity } from "../types/TicketResponse";
import { TicketError } from "../types/TicketError";
import { failure, isSuccess, Result } from "../../../shared/types/Result";
import { StateCreator } from "zustand/vanilla";
import { KeychainObject } from "../../../shared/utils/keychainHelper";

export type TicketState = {
    workOrders: WorkOrderEntity[];
    workOrderOwners: WorkOrderEntity[];
    isLoading: boolean;
    startDate: Date;
    endDate: Date;
    selectedEmployee?: EmployeeEntity;
    error: string | null;
    visible: boolean;
    json: KeychainObject | null; // Thêm dòng này để fix linter
    htmlContent: string;
    getWorkOrders: () => Promise<Result<WorkOrderEntity[], TicketError>>;
    reset: () => void;
    setStartDate: (date: Date) => void
    setEndDate: (date: Date) => void
    setSelectedEmployee: (emp: EmployeeEntity) => void
    setVisible: (v: boolean) => void
}

export const ticketSelectors = {
    selectWorkOrders: (state: TicketState) => state.workOrders,
    selectIsLoading: (state : TicketState) => state.isLoading,
    selectError: (state: TicketState) => state.error,
    selectVisible: (state: TicketState) => state.visible,
    selectStartDate: (state: TicketState) => state.startDate,
    selectEndDate: (state: TicketState) => state.endDate,
    selectSelectedEmployee: (state: TicketState) => state.selectedEmployee,
}

const initialTicketState = {
    workOrders: [],
    workOrderOwners: [],
    isLoading: false,
    error: null,
    visible: false,
    startDate: new Date(Date.now()),
    endDate: new Date(Date.now()),
    selectedEmployee: ALL_EMPLOYEES_OPTION,
    htmlContent: "",
    json: null
};

export const createTicketStore = (ticketUsecase: TicketUsecase): StateCreator<TicketState> => (set, get) => ({
    ...initialTicketState,
    getWorkOrders: async () : Promise<Result<WorkOrderEntity[], TicketError>> => {
        set({ isLoading: true });
        const json = get().json;
        if(json==null) {
            set({ error: 'User not found', isLoading: false });
            return failure(new TicketError('User not found', 'USER_NOT_FOUND'));
        }
        var result;
        if (json.isOwner)
          result = await ticketUsecase.getWorkOrderOwner({
              employeeId: get().selectedEmployee?.id??"",
              dateStart: get().startDate.format("yyyy-MM-dd"),
              dateEnd: get().endDate.format("yyyy-MM-dd"),
          });
        else{
          result = await ticketUsecase.getWorkOrders({
            employeeId: json.employeeId,
            dateStart: get().startDate.format("yyyy-MM-dd"),
            dateEnd: get().endDate.format("yyyy-MM-dd"),
        });
        }
        if(isSuccess(result)) {
            set({ isLoading: false, htmlContent: combineAllTicketDetails(result.value)});
        } else {
            set({ error: result.error, isLoading: false });
        }
        return result;
    },
    
    reset: async () => {
      let user = await appConfig.getUser()
      const defaultEmployee = user?.isOwner ? ALL_EMPLOYEES_OPTION : undefined;
      set({ 
        ...initialTicketState, 
        json: user, 
        selectedEmployee: defaultEmployee 
      });
    },
    setStartDate: (date: Date) => set({startDate: date}),
    setEndDate: (date: Date) => set({endDate:date}),
    setSelectedEmployee: (emp: EmployeeEntity) => set({selectedEmployee: emp}),
    setVisible: (v: boolean) => set({visible: v})
});

// Khởi tạo real usecase ở production
import { TicketRepositoryImplement } from "../repositories/TicketRepositoryImplement";
import { TicketApi } from "../services/TicketApi";
const realTicketUsecase = new TicketUsecase(new TicketRepositoryImplement(TicketApi));
export const useTicketStore = create<TicketState>()(createTicketStore(realTicketUsecase));

import { ALL_EMPLOYEES_OPTION } from "@/shared/stores/employeeStore";
import { appConfig } from "@/shared/utils/appConfig";



/**
 * Định nghĩa type cho mỗi object trong mảng JSON của bạn để code an toàn hơn.
 */
interface TicketDetail {
  nickName: string;
  ticketNumber: number;
  detail: string;
  ticketDate: string;
  serviceStartTime: string;
  serviceEndTime: string;
}

/**
 * Trích xuất nội dung bên trong một tag HTML từ một chuỗi.
 * @param htmlString Chuỗi HTML đầy đủ.
 * @param tagName Tên của tag (ví dụ: 'body', 'style').
 * @returns Nội dung bên trong tag hoặc chuỗi rỗng nếu không tìm thấy.
 */
function extractTagContent(htmlString: string, tagName: string): string {
  // Regex để tìm nội dung giữa <tagName> và </tagName>
  // [\s\S]*? dùng để khớp với mọi ký tự, bao gồm cả dấu xuống dòng
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`);
  const match = htmlString.match(regex);
  return match ? match[1] : '';
}

/**
 * Gom nhiều chi tiết ticket (dạng chuỗi HTML) thành một tài liệu HTML duy nhất.
 * @param tickets Mảng các object ticket.
 * @returns Một chuỗi HTML duy nhất chứa tất cả các chi tiết ticket.
 */
export function combineAllTicketDetails(tickets: TicketDetail[]): string {
  if (!tickets || tickets.length === 0) {
    // Trả về một trang trống nếu không có dữ liệu
    return '<html><head><title>No Tickets</title></head><body><p>No ticket details available.</p></body></html>';
  }

  // 1. Lấy style từ ticket đầu tiên (vì tất cả đều giống nhau)
  const styleContent = extractTagContent(tickets[0].detail, 'style');

  // 2. Trích xuất và nối tất cả nội dung <body> của mỗi ticket
  const allBodyContents = tickets
    .map(ticket => extractTagContent(ticket.detail, 'body'))
    .join(''); // Nối tất cả các chuỗi body lại với nhau

  // 3. Xây dựng lại tài liệu HTML cuối cùng
  const finalHtml = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ticket Details</title>
        <style>
          ${styleContent}
        </style>
      </head>
      <body>
        ${allBodyContents}
      </body>
    </html>
  `;

  return finalHtml;
}