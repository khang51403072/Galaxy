import { create } from "zustand";
import { TicketUsecase } from "../usecase/TicketUsecase";
import { EmployeeEntity, WorkOrderEntity } from "../types/TicketResponse";
import { TicketError } from "../types/TicketError";
import { failure, isSuccess, Result } from "../../../shared/types/Result";
import { StateCreator } from "zustand/vanilla";
import { keychainHelper, KeychainObject } from "../../../shared/utils/keychainHelper";

export type TicketState = {
    workOrders: WorkOrderEntity[];
    workOrderOwners: WorkOrderEntity[];
    isLoading: boolean;
    startDate: Date;
    endDate: Date;
    selectedEmployee: EmployeeEntity | null;
    error: string | null;
    visible: boolean;
    json: KeychainObject | null; // Thêm dòng này để fix linter
    getWorkOrders: () => Promise<Result<WorkOrderEntity[], TicketError>>;
    getWorkOrderOwners: (employeeId: string) => Promise<Result<WorkOrderEntity[], TicketError>>;
    reset: () => void;
    setJson: (json: KeychainObject) => void;
}

export const ticketSelectors = {
    selectWorkOrders: (state: TicketState) => state.workOrders,
    selectWorkOrderOwners: (state: TicketState) => state.workOrderOwners,
    selectIsLoading: (state : TicketState) => state.isLoading,
    selectError: (state: TicketState) => state.error,
    selectGetWorkOrders: (state: TicketState) => state.getWorkOrders,
    selectGetWorkOrderOwners: (state: TicketState) => state.getWorkOrderOwners,
    selectVisible: (state: TicketState) => state.visible,
    selectStartDate: (state: TicketState) => state.startDate,
    selectEndDate: (state: TicketState) => state.endDate,
    selectSelectedEmployee: (state: TicketState) => state.selectedEmployee,
    selectSetJson:(state: TicketState) => state.setJson
}

const initialTicketState = {
    workOrders: [],
    workOrderOwners: [],
    isLoading: false,
    error: null,
    visible: false,
    startDate: new Date(Date.now()),
    endDate: new Date(Date.now()),
    selectedEmployee: null,
    json: null, // Không lấy từ useHomeStore.getState().json nữa
};

export const createTicketStore = (ticketUsecase: TicketUsecase): StateCreator<TicketState> => (set, get) => ({
    ...initialTicketState,
    getWorkOrders: async () : Promise<Result<WorkOrderEntity[], TicketError>> => {
        set({ isLoading: true });
        // json nên truyền từ ngoài vào hoặc lấy từ store qua selector
        const json = get().json;
        if(json==null) {
            set({ error: 'User not found' });
            set({ isLoading: false });
            return failure(new TicketError('User not found', 'USER_NOT_FOUND'));
        }
        const result = await ticketUsecase.getWorkOrders({
            employeeId: get().selectedEmployee?.id??json?.employeeId??'',
            dateStart: get().startDate.toYYYYMMDD('-'),
            dateEnd: get().endDate.toYYYYMMDD('-'),
        });
        if(isSuccess(result)) {
            const workOrders = await Promise.all(result.value.map(async (item)=>{
                const json = await parseHtmlToJson(item.detail);
                item.detail = json;
                return item;
              }))
            
            set({ workOrders: workOrders });
        } else {
            set({ error: result.error });
        }
        set({ isLoading: false });
        return result;
    },
    getWorkOrderOwners: async (employeeId: string) : Promise<Result<WorkOrderEntity[], TicketError>> => {
        set({ isLoading: true });
        const json = get().json;
        if(json==null) {
            set({ error: 'User not found' });
            set({ isLoading: false });
            return failure(new TicketError('User not found', 'USER_NOT_FOUND'));
        }
        const result = await ticketUsecase.getWorkOrderOwner({
            employeeId: employeeId,
            dateStart: get().startDate.toYYYYMMDD('-'),
            dateEnd: get().endDate.toYYYYMMDD('-'),
        });
        if(isSuccess(result)) {
            const workOrders = await Promise.all(result.value.map(async (item)=>{
                const json = await parseHtmlToJson(item.detail);
                item.detail = json;
                return item;
              }))
            
            set({ workOrderOwners: workOrders });
        } else {
            set({ error: result.error });
        }
        set({ isLoading: false });
        return result;
    },
    setJson: (json: KeychainObject) => set({ json }), // Action để nhận json từ ngoài vào
    reset: () => {
        set({ ...initialTicketState });
        // reset json về null hoặc lấy lại từ ngoài nếu cần
    },
});

// Khởi tạo real usecase ở production
import { TicketRepositoryImplement } from "../repositories/TicketRepositoryImplement";
import { TicketApi } from "../services/TicketApi";
import { useHomeStore } from "@/features/home/stores/homeStore";
const realTicketUsecase = new TicketUsecase(new TicketRepositoryImplement(TicketApi));
export const useTicketStore = create<TicketState>()(createTicketStore(realTicketUsecase));

import { Parser } from 'htmlparser2';

interface Service {
  qtyLeft?: string;
  columnRight?: string;
  name?: string;
}

// Hàm chuyển đổi HTML sang JSON
const parseHtmlToJson = (htmlString: string) => {
  return new Promise((resolve, reject) => {
    const jsonResult = {
      title: '',
      time: '',
      services: [] as Service[],
      ServiceDeductions: '',
      NonCashTip: '',
      Total: '',
    };

    let currentService: Service = {};
    let currentSummary: Service = {};
    let isInServicesTable = false;
    let isInSummaryTable = false;
    let countTable = 0;
    const parser = new Parser({
      onopentag(name, attribs) {
        if (name === 'div' && attribs.class === 'ticket-name') {
          parser.ontext = (text) => {
            jsonResult.title += " "+text.trim();
          };
        }
        if (name === 'div' && attribs.class === 'time') {
          parser.ontext = (text) => {
            jsonResult.time += ' '+text.trim();
          };
        }
        if (name === 'table' && attribs.class === 'table-work-order') {
          countTable++;
          if (!isInServicesTable&& countTable == 1) {
            isInServicesTable = true;
          } else if (!isInSummaryTable&& countTable == 2) {
            isInSummaryTable = true;
          }
        }
        if (countTable == 1 && isInServicesTable && name === 'tr') {
          currentService = {};
        }
        if (countTable == 1 && isInServicesTable && name === 'td') {
          if (attribs.class === 'qty-left') {
            parser.ontext = (text) => {
              currentService.qtyLeft += text.trim();
            };
          } 
          else if (attribs.class === 'column-right') {
            parser.ontext = (text) => {
              currentService.columnRight = (currentService.columnRight??'')+ text.trim();
            };
          }
          else if (!attribs.class) {
            parser.ontext = (text) => {
              currentService.name = (currentService.name??'')+ text.trim();
            };
          } 
        }

        if (countTable == 2 && isInSummaryTable && name === 'tr') {
          currentSummary = {};
        }
        if (countTable == 2 && isInSummaryTable && name === 'td') {
          if (attribs.class === 'qty-left') {
            parser.ontext = (text) => {
              currentSummary.qtyLeft += text.trim();
            };
          } 
          else if (attribs.class === 'column-right') {
            parser.ontext = (text) => {
              currentSummary.columnRight = (currentSummary.columnRight??'')+ text.trim();
            };
          }
          else if (!attribs.class) {
            parser.ontext = (text) => {
              currentSummary.name = (currentSummary.name??'')+ text.trim();
            };
          } 
          
        }
        // if (isInSummaryTable && name === 'tr') {
        //   let summaryKey = '';
        //   parser.ontext = (text) => {
        //     const trimmedText = text.trim();
        //     if (trimmedText) {
        //       if (!summaryKey) {
        //         summaryKey = trimmedText.replace(/\s/g, '');
        //       } else {
        //         jsonResult[summaryKey as keyof typeof jsonResult] = trimmedText as never;
        //         summaryKey = '';
        //       }
        //     }
        //   };
        // }
      },
      onclosetag(name) {
        if (isInServicesTable && name === 'tr') {
          if (currentService.qtyLeft && currentService.name && currentService.columnRight) {
            jsonResult.services.push(currentService as never);
          }
          
        }
        if (isInSummaryTable && name === 'tr' && currentSummary.name && currentSummary.columnRight) {
          if(currentSummary.name.includes('Deductions')){
            jsonResult.ServiceDeductions = currentSummary.columnRight;
          }
          else if(currentSummary.name.includes('Tip')){
            jsonResult.NonCashTip = currentSummary.columnRight;
          }
          else if(currentSummary.name.includes('Total')){
            jsonResult.Total = currentSummary.columnRight;
          }
        }
        if (name === 'table') {
          if (isInServicesTable) {
            isInServicesTable = false;
          } else if (isInSummaryTable) {
            isInSummaryTable = false;
          }
        }
      },
      onend() {
        resolve(jsonResult);
      },
      onerror(error) {
        reject(error);
      },
    });

    parser.write(htmlString);
    parser.end();
  });
};

