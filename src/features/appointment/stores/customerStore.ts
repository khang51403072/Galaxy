import { create } from 'zustand';
import { failure, isSuccess, Result, success } from '@/shared/types/Result';
import { CustomerEntity, CustomerResponse, CustomerPayload } from '../types/CustomerResponse';
import { AppointmentRepositoryImplement } from '../repositories/AppointmentRepositoryImplement';
import { AppointmentUsecase } from '../usecases/AppointmentUsecase';

// --- Định nghĩa State và Actions cho Customer Store ---
export interface SearchableCustomerEntity extends CustomerEntity {
  searchableString: string; // Thuộc tính mới dùng riêng cho việc tìm kiếm
} 

/**
 * Chuyển đổi danh sách khách hàng gốc thành danh sách có thể tìm kiếm hiệu quả.
 * Thêm một trường `searchableString` đã được chuẩn hóa.
 * @param customers Danh sách khách hàng gốc từ API.
 * @returns Danh sách khách hàng đã được xử lý.
 */
export function processCustomersForSearch(customers: CustomerEntity[]): SearchableCustomerEntity[] {
  return customers.map(customer => {
    // Ghép các trường cần tìm kiếm và chuyển sang chữ thường
    // Dùng `|| ''` để phòng trường hợp giá trị là null/undefined
    const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.toLowerCase();
    
    // Chuẩn hóa số điện thoại: chỉ giữ lại các chữ số
    const phone = (customer.cellPhone || '').replace(/\D/g, ''); 

    // Tạo chuỗi tìm kiếm tổng hợp
    const searchableString = `${fullName} ${phone}`;
    
    // Trả về object mới với thuộc tính đã thêm
    return {
      ...customer,
      searchableString: searchableString
    };
  });
}
type CustomerState = {
  customerList: CustomerEntity[]; // List of customers from cached or api
  cachedCustomerList: SearchableCustomerEntity[];//cached 10000 user for local search
  isLoading: boolean;
  searchString: string;
  error: string | null;
  selectedCustomer?: CustomerEntity;
  // --- Actions ---
  searchCustomer: (searchString?: string) => Promise<CustomerEntity[]>;
  getCustomerLookup: (pageNumber?: number, pageSize?: number, phoneNumber?: string) => Promise<Result<CustomerResponse, Error>>;
  setSelectedCustomer: (customer?: CustomerEntity ) => void;
  reset: ()=>void;
  setSearchString: (searchString: string) => void;
  setIsLoading: (isLoading: boolean)=>void
};

// --- State ban đầu ---
const initialCustomerState = {
    customerList: [],
    selectedCustomer: undefined,
    isLoading: false,
    error: null,
    searchString: ''
};

// --- Khởi tạo Usecase (có thể đưa ra ngoài để dùng chung) ---
const appointmentRepository = new AppointmentRepositoryImplement();
const appointmentUsecase = new AppointmentUsecase(appointmentRepository);

// --- Tạo Store ---
export const useCustomerStore = create<CustomerState>((set, get) => ({
    ...initialCustomerState,
    cachedCustomerList: [],
    reset: () => set({...initialCustomerState, customerList: get().cachedCustomerList }),
    setSelectedCustomer: (customer) => set({selectedCustomer: customer}),
    setIsLoading: (isLoading) => set({isLoading: isLoading}),
    setSearchString: (searchString) => set({searchString: searchString}),
    searchCustomer: async (searchString) => {
        //find in cached customer list
        // Chuẩn hóa từ khóa tìm kiếm giống như cách đã làm trong hàm xử lý
        const normalizedSearchTerm = searchString?.toLowerCase();

        let filterList = get().cachedCustomerList.filter(customer => 
            // Chỉ cần tìm trên một thuộc tính duy nhất!
            customer.searchableString.includes(normalizedSearchTerm??' ')
        );

        if(filterList.length>0) 
        {
            set({customerList: filterList})
            return filterList;
        }
            
        //search online
        await get().getCustomerLookup(1, 10, searchString)
        return get().customerList;

    }, 
    
    getCustomerLookup: async (pageNumber: number = 1, pageSize: number = 1000, phoneNumber: string = '') => {
        set({ isLoading: true, error: null });
        const payload: CustomerPayload = { pageNumber, pageSize, phoneNumber };
        const result = await appointmentUsecase.customers(payload);
        if (isSuccess(result)) {
            let customerList = processCustomersForSearch(result.value.dataSource).sort(
                (a,b)=> (a.firstName+''+a.lastName).localeCompare(b.firstName+''+b.lastName))
            set({ customerList: customerList, isLoading: false });
            if(get().cachedCustomerList.length==0) set({cachedCustomerList: customerList})
            return success(result.value);
        } else {
            set({ error: result.error.message, isLoading: false });
            return failure(result.error);
        }
    },
}));