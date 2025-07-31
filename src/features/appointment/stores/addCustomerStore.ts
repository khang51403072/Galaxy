import { create } from 'zustand';
import { AppointmentUsecase } from '../usecases/AppointmentUsecase';
import { AppointmentRepositoryImplement } from '../repositories/AppointmentRepositoryImplement';
import { isSuccess } from '@/shared/types/Result';
import { CustomerSavePayload } from '../types/CustomerResponse';

export type Gender = {
    label: string;
    value: string;
}

export type CustomerFormData = {
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    gender: Gender | null;
    notes: string;
    phone: string;
}

type AddCustomerState = {
    formData: CustomerFormData;
    isLoading: boolean;
    error: string | null;
    
    // Actions
    updateField: (field: keyof CustomerFormData, value: any) => void;
    resetForm: () => void;
    saveCustomer: () => Promise<boolean>;
    
    // Selectors
    isFormValid: () => boolean;
    getValidationErrors: () => string[];
}

const initialFormData: CustomerFormData = {
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    gender: null,
    notes: '',
    phone: '',
};

export const createAddCustomerStore = (appointmentUsecase: AppointmentUsecase) => 
    create<AddCustomerState>((set, get) => ({
        formData: initialFormData,
        isLoading: false,
        error: null,
        
        updateField: (field: keyof CustomerFormData, value: any) => {
            set((state) => ({
                formData: {
                    ...state.formData,
                    [field]: value
                }
            }));
        },
        
        resetForm: () => {
            set({
                formData: initialFormData,
                error: null
            });
        },
        
        saveCustomer: async () => {
            const { formData } = get();
            
            // Validation
            const errors = get().getValidationErrors();
            if (errors.length > 0) {
                set({ error: errors[0] });
                return false;
            }
            
            set({ isLoading: true, error: null });
            
            try {
                const payload: CustomerSavePayload = {
                    firstName: formData.firstName,
                    fullName: formData.firstName + ' ' + formData.lastName,
                    id: '',
                    cellPhone: formData.phone,
                };
                
                // Add optional fields
                if (formData.dob) {
                    const dobParts = formData.dob.split('/');
                    const dobDay = parseInt(dobParts[0]);
                    const dobMonth = parseInt(dobParts[1]);
                    if (dobDay && dobMonth) {
                        payload.dobDay = dobDay;
                        payload.dobMonth = dobMonth;
                    }
                }
                
                if (formData.notes) {
                    payload.notes = formData.notes;
                }
                
                if (formData.gender) {
                    payload.gender = formData.gender.value;
                }
                
                if (formData.email) {
                    payload.email = formData.email;
                }
                
                if (formData.lastName) {
                    payload.lastName = formData.lastName;
                }
                
                const result = await appointmentUsecase.customerSave(payload);
                
                if (isSuccess(result)) {
                    set({ isLoading: false, error: null });
                    return true;
                } else {
                    set({ 
                        isLoading: false, 
                        error: result.error.message || 'Failed to save customer' 
                    });
                    return false;
                }
            } catch (error) {
                set({ 
                    isLoading: false, 
                    error: error instanceof Error ? error.message : 'Unknown error' 
                });
                return false;
            }
        },
        
        isFormValid: () => {
            const { formData } = get();
            return (
                formData.phone.trim() !== '' && 
                formData.phone.length >= 10 &&
                formData.firstName.trim() !== ''
            );
        },
        
        getValidationErrors: () => {
            const { formData } = get();
            const errors: string[] = [];
            
            if (formData.phone.trim() === '' || formData.phone.length < 10) {
                errors.push('Please enter a valid phone number');
            }
            
            if (formData.firstName.trim() === '') {
                errors.push('Please enter first name');
            }
            
            return errors;
        }
    }));

// Khởi tạo store instance
const appointmentRepository = new AppointmentRepositoryImplement();
const appointmentUsecase = new AppointmentUsecase(appointmentRepository);
export const useAddCustomerStore = createAddCustomerStore(appointmentUsecase);

// Selectors
export const addCustomerSelectors = {
    selectFormData: (state: AddCustomerState) => state.formData,
    selectIsLoading: (state: AddCustomerState) => state.isLoading,
    selectError: (state: AddCustomerState) => state.error,
    selectUpdateField: (state: AddCustomerState) => state.updateField,
    selectResetForm: (state: AddCustomerState) => state.resetForm,
    selectSaveCustomer: (state: AddCustomerState) => state.saveCustomer,
    selectIsFormValid: (state: AddCustomerState) => state.isFormValid(),
    selectGetValidationErrors: (state: AddCustomerState) => state.getValidationErrors(),
};
