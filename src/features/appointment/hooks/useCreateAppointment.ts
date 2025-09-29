import React, { ReactNode, useCallback, useEffect, useMemo } from "react";
import { View } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "@/shared/theme/ThemeProvider";

// Import types and utilities
import { RootStackParamList, ROUTES } from "@/app/routes";
import { goBack, navigate } from "@/app/NavigationService";
import { isFailure, isSuccess } from "@/shared/types/Result";
import { MenuItemEntity } from "../types/MenuItemResponse";
import { EmployeeEntity } from "@/features/ticket/types/TicketResponse";
import { createApptMessage } from "../types/AppointmentMessage";
import { getIsAllowDelete, getIsAllowEdit } from "../utils/createAppointmentStore.util";
import { GetApptDetailsRequest, SaveAppointmentParams } from "../stores/createAppointment/createAppointmentStore";
import { stylesMemoize } from "../screens/CreateAppointmentScreen.styles"; // You might need to adjust the path

// Import hooks and contexts
import { useXAlert } from "@/shared/components/XAlertContext";
import useSignalR from "@/shared/hooks/useSignalR";
import { useBackHandler } from "@/shared/hooks/useBackHandler";

// Import components for JSX in callbacks
import { XColumn } from "@/shared/components/XColumn";
import { XRow } from "@/shared/components/XRow";
import XText from "@/shared/components/XText";

// Import all necessary stores
import { useCreateAppointmentConfigStore } from "../stores/createAppointment/createAppointmentConfigStore";
import { useCreateAppointmentStore } from "../stores/createAppointment/createAppointmentStore";
import { useAppointmentUIStore } from "../stores/createAppointment/createAppointmentUIStore";
import { useCustomerStore } from "../stores/customerStore";
import { useHomeStore } from "@/features/home/stores/homeStore";
import { useEmployeeStore } from "@/shared/stores/employeeStore";
import { useAppointmentStore } from "../stores/appointmentStore";
import { appConfig } from "@/shared/utils/appConfig";
import { DeleteItemInfo } from "../screens/CreateAppointmentScreen";

/**
 * @description
 * This custom hook encapsulates all the business logic, state management,
 * and side effects for the Create/Edit Appointment screen.
 * It acts as a single "brain" for the UI component, making the component itself
 * lean and focused only on rendering.
 */
export function useCreateAppointment() {
    // --- 1. SETUP & CONTEXT ---
    const route = useRoute<RouteProp<RootStackParamList, 'CreateAppointment'>>();
    const { apptId } = route.params || {};
    const navigation = useNavigation();
    const theme = useTheme();
    const { showAlert, showConfirm } = useXAlert();
    const { sendMessage } = useSignalR();

    // --- 2. STATE AGGREGATION FROM STORES ---
    // Config Store
    const { listApptType, isLoading: isLoadingConfig, listEmployeeOnWork, listItemMenu, companyProfile, loadConfigData } = useCreateAppointmentConfigStore(
        useShallow((state) => ({
            listApptType: state.listApptType,
            isLoading: state.isLoading,
            listEmployeeOnWork: state.listEmployeeOnWork,
            listItemMenu: state.listItemMenu,
            companyProfile: state.companyProfile,
            loadConfigData: state.loadConfigData,
        }))
    );

    // Appointment Form Store
    const formState = useCreateAppointmentStore(
        useShallow((s) => ({
            isLoading: s.isLoading,
            error: s.error,
            listServices: s.listBookingServices,
            selectedDate: s.selectedDate,
            isConfirmOnline: s.isConfirmOnline,
            isGroupAppt: s.isGroupAppointment,
            apptDetails: s.apptDetails,
            selectedApptType: s.selectedApptType,
        }))
    );
    const {
        reset: resetForm,
        saveAppointment,
        getApptDetails,
        updateBookingService,
        removeBookingService,
        deleteAppt,
        setSelectedApptType,
        setSelectedDate,
        setIsConfirmOnline,
        setIsGroupAppt,
    } = useCreateAppointmentStore.getState();

    // UI Store
    const uiState = useAppointmentUIStore(
        useShallow((s) => ({
            showServiceSheet: s.showServiceSheet,
            employeeForAvailable: s.employeeForAvailable,
            serviceIndex: s.serviceIndex,
            comboIndex: s.comboIndex,
            isShowTechnician: s.isShowTechnician,
        }))
    );
    const { openServiceSheet, closeServiceSheet, openTechnicianSheet, closeTechnicianSheet } = useAppointmentUIStore.getState();

    // Other Stores
    const { selectedCustomer, reset: resetCustomerState } = useCustomerStore(useShallow((s) => ({ selectedCustomer: s.selectedCustomer, reset: s.reset })));
    const { selectedStore, json } = useHomeStore(useShallow((s) => ({ selectedStore: s.selectedStore, json: s.json })));
    const { listEmployee } = useEmployeeStore(useShallow((s) => ({ listEmployee: s.employees })));
    const { getAppointmentList } = useAppointmentStore.getState();


    // --- 3. CORE LOGIC & SIDE EFFECTS ---

    // Effect for initial data loading and cleanup on unmount
    useEffect(() => {
        loadConfigData(listEmployee);
        return () => {
            resetForm();
            resetCustomerState();
        };
    }, [loadConfigData, listEmployee, resetForm, resetCustomerState]);

    // Effect for initializing the form (Edit vs. Create) after config is loaded
    useEffect(() => {
        if (isLoadingConfig || !companyProfile) {
            return; // Guard clause: wait for config data
        }

        const initAppointment = async () => {
            if (apptId) {
                const params: GetApptDetailsRequest = {
                    apptId,
                    listEmployee: listEmployeeOnWork,
                    listItemMenu,
                    companyProfile,
                    listApptType,
                };
                const result = await getApptDetails(params);
                if (isSuccess(result)) {
                    useCustomerStore.getState().setSelectedCustomer(result.value.customer);
                }
            } else {
                // Logic for new appointment
                const apptTypeDetail = companyProfile.data.appointments.defaultRetentionType;
                const apptType = listApptType.find(value => value.id.trim().toLowerCase() === apptTypeDetail?.toLowerCase());
                setSelectedApptType({ label: apptType?.name ?? "", value: apptType });
            }
        };

        initAppointment();
    }, [apptId, isLoadingConfig, companyProfile, getApptDetails]); // Dependencies are crucial here

    // Effect to navigate to customer selection for new appointments
    useEffect(() => {
        if (!formState.isLoading && selectedCustomer == null && !apptId) {
            navigate(ROUTES.SELECT_CUSTOMER as never);
        }
    }, [formState.isLoading, selectedCustomer, apptId]);
    
    // Handle Android back button press
    useBackHandler(navigation, resetForm);


    // --- 4. MEMOIZED VALUES & DERIVED STATE ---
    const isEditMode = !!apptId;
    const isAllowEdit = useMemo(() => getIsAllowEdit({ json, apptDetails: formState.apptDetails }), [formState.apptDetails, json]);
    const isAllowDelete = useMemo(() => getIsAllowDelete({ json, apptDetails: formState.apptDetails }), [formState.apptDetails, json]);
    const styles = useMemo(() => stylesMemoize(theme), [theme]);


    // --- 5. MEMOIZED CALLBACKS (EVENT HANDLERS) ---
    const handleSave = useCallback(async () => {
        const params: SaveAppointmentParams = { selectedCustomer, companyProfile };
        const result = await saveAppointment(params);

        if (isSuccess(result)) {
            sendMessage([{ type: "SendMessage", data: createApptMessage(result.value) }]);
            showAlert({
                title: "Successfully",
                message: "Appointment saved successfully",
                onClose: async () => {
                    const userJson = await appConfig.getUser();
                    getAppointmentList(userJson);
                    goBack();
                }
            });
        } else if (isFailure(result)) {
            showAlert({ title: "Error", message: result.error.message, type: 'error' });
        }
    }, [saveAppointment, selectedCustomer, companyProfile, showAlert, getAppointmentList, sendMessage]);

    const onDeleteAppointment = useCallback(async () => {
        const result = await deleteAppt(selectedStore);
        if (isSuccess(result) && result.value.result) {
            showAlert({
                title: 'Deleted',
                message: 'Appointment deleted successfully.',
                onClose: async () => {
                    const userJson = await appConfig.getUser();
                    getAppointmentList(userJson);
                    goBack();
                }
            });
        } else {
            const errorMessage = isSuccess(result) ? result.value.errorMsg : result.error.message;
            showAlert({ message: errorMessage, type: 'error' });
        }
    }, [deleteAppt, showAlert, getAppointmentList, selectedStore]);
    
    const onTrashButtonClick = useCallback(() => {
        const info = DeleteItemInfo(styles, formState.apptDetails)
        showConfirm({
            title: 'Delete Appointment',
            message: 'Are you sure you want to delete this appointment?',
            confirmText: 'Delete',
            onConfirm: onDeleteAppointment,
            childrenBottom: info
        });
    }, [formState.apptDetails, showConfirm, onDeleteAppointment, styles]);

    const handleDateChange = useCallback((date: Date) => {
        const newDate = new Date(formState.selectedDate);
        newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        setSelectedDate(newDate);
    }, [setSelectedDate, formState.selectedDate]);

    const handleTimeChange = useCallback((time: Date) => {
        const newDate = new Date(formState.selectedDate);
        newDate.setHours(time.getHours(), time.getMinutes());
        setSelectedDate(newDate);
    }, [setSelectedDate, formState.selectedDate]);

    const handleSelectTechnician = useCallback((index: number, comboIdx = -1) => {
        const service = comboIdx === -1
            ? formState.listServices[index].service
            : formState.listServices[index].comboItems?.[comboIdx]?.service;
        if (!service) return;

        const allowedEmployeesIds = service.allowedEmployees || [];
        const employeeList = allowedEmployeesIds.length > 0
            ? listEmployeeOnWork.filter((emp) => allowedEmployeesIds.includes(emp.id))
            : listEmployeeOnWork;

        openTechnicianSheet({ employees: employeeList, serviceIndex: index, comboIndex: comboIdx });
    }, [formState.listServices, listEmployeeOnWork, openTechnicianSheet]);

    const handleSelectServiceItem = useCallback((service: MenuItemEntity) => {
        updateBookingService({ serviceIndex: uiState.serviceIndex, e: service, type: 'service', listItemMenu });
        closeServiceSheet();
    }, [updateBookingService, uiState.serviceIndex, closeServiceSheet, listItemMenu]);

    const handleSelectEmployeeItem = useCallback((item: EmployeeEntity) => {
        updateBookingService({ serviceIndex: uiState.serviceIndex, e: item, type: 'technician', comboIndex: uiState.comboIndex, listItemMenu });
        closeTechnicianSheet();
    }, [updateBookingService, uiState.serviceIndex, uiState.comboIndex, closeTechnicianSheet, listItemMenu]);


    // --- 6. RETURN THE PUBLIC API FOR THE COMPONENT ---
    return {
        // All the data the component needs to render
        state: {
            ...formState,
            ...uiState,
            theme,
            isEditMode,
            isAllowEdit,
            isAllowDelete,
            styles,
            selectedCustomer,
            listApptType,
            listEmployeeOnWork,
            isLoading: formState.isLoading || isLoadingConfig,
        },
        // All the functions the component can call
        actions: {
            handleSave,
            onTrashButtonClick,
            handleDateChange,
            handleTimeChange,
            handleSelectTechnician,
            handleSelectServiceItem,
            handleSelectEmployeeItem,
            // Pass through simple store actions
            setSelectedApptType,
            setIsConfirmOnline,
            setIsGroupAppt,
            openServiceSheet,
            closeServiceSheet,
            closeTechnicianSheet,
            removeBookingService,
            navigateToSelectCustomer: () => navigate(ROUTES.SELECT_CUSTOMER as never),
        },
    };
}