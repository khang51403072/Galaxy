import XIcon from "@/shared/components/XIcon";
import XScreen from "@/shared/components/XScreen";
import XText from "@/shared/components/XText";
import { useTheme, Theme } from "@/shared/theme/ThemeProvider";
import React, { useCallback, useEffect, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { RootStackParamList, ROUTES } from "@/app/routes";
import { goBack, navigate } from "@/app/NavigationService";
import { useAppointmentStore } from "../stores/appointmentStore";
import { isFailure, isSuccess } from "@/shared/types/Result";
import SelectServiceScreen from "../components/SelectServiceScreen";
import { MenuItemEntity } from "../types/MenuItemResponse";
import XBottomSheetSearch from "@/shared/components/XBottomSheetSearch";
import { EmployeeEntity } from "@/features/ticket/types/TicketResponse";
import XButton from "@/shared/components/XButton";
import { useXAlert } from "@/shared/components/XAlertContext";
import { appConfig } from "@/shared/utils/appConfig";
import useSignalR from "@/shared/hooks/useSignalR";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useBackHandler } from "@/shared/hooks/useBackHandler";
import ServiceList from "../components/ServiceList";
import AppointmentTypeDropdown from "../components/AppTypeDropdown";
import { ConfirmOnlineToggle, GroupApptToggle } from "../components/AppointmentToggles";
import { CustomerPicker } from "../components/AppointmentPickers";
import { DatePickerField, TimePickerField } from "../components/DateTimePickerField";

// --- IMPORT CÁC STORE MỚI ---
import { GetApptDetailsRequest, useCreateAppointmentStore } from "../stores/createAppointment/createAppointmentStore";
import { useAppointmentUIStore } from "../stores/createAppointment/createAppointmentUIStore";
import { useCustomerStore } from "../stores/customerStore";
import { XColumn } from "@/shared/components/XColumn";
import { XRow } from "@/shared/components/XRow";
import { createApptMessage } from "../types/AppointmentMessage";
import { XDivider } from "@/shared/components/XDivider";
import { stylesMemoize } from "./CreateAppointmentScreen.styles";
import { useHomeStore } from "@/features/home/stores/homeStore";
import { useCreateAppointmentConfigStore } from "../stores/createAppointment/createAppointmentConfigStore";
import { useEmployeeStore } from "@/shared/stores/employeeStore";
// --- Component ---
export default function CreateAppointmentScreen() {
    const route = useRoute<RouteProp<RootStackParamList, 'CreateAppointment'>>();
    const { apptId } = route.params || {};
    const theme = useTheme();

    // --- LẤY STATE & ACTIONS TỪ FORM STORE ---

    const {
        listApptType, isLoading: isLoadingConfig, listEmployeeOnWork, listItemMenu, companyProfile,
        loadConfigData
    } = useCreateAppointmentConfigStore(
        useShallow((state) => ({
            listApptType: state.listApptType,
            isLoading: state.isLoading,
            listEmployeeOnWork: state.listEmployeeOnWork,
            listItemMenu: state.listItemMenu,
            companyProfile: state.companyProfile,
            loadConfigData: state.loadConfigData,
        }))
    );

    const {
        selectedApptType, isLoading, listServices, selectedDate,
        isConfirmOnline, isGroupAppt, error, apptDetails,
        setSelectedApptType, setSelectedDate, setIsConfirmOnline, setIsGroupAppt,
        reset, saveAppointment, getApptDetails, getIsAllowEdit,
        updateBookingService, removeBookingService, getIsAllowDelete, deleteAppt
    } = useCreateAppointmentStore(
        useShallow((s) => ({
            selectedApptType: s.selectedApptType,
            isLoading: s.isLoading,
            listServices: s.listBookingServices,
            selectedDate: s.selectedDate,
            isConfirmOnline: s.isConfirmOnline,
            isGroupAppt: s.isGroupAppointment,
            error: s.error,
            apptDetails: s.apptDetails,
            setSelectedApptType: s.setSelectedApptType,
            setSelectedDate: s.setSelectedDate,
            setIsConfirmOnline: s.setIsConfirmOnline,
            setIsGroupAppt: s.setIsGroupAppt,
            reset: s.reset,
            saveAppointment: s.saveAppointment,
            getApptDetails: s.getApptDetails,
            getIsAllowEdit: s.getIsAllowEdit,
            updateBookingService: s.updateBookingService,
            removeBookingService: s.removeBookingService,
            getIsAllowDelete: s.getIsAllowDelete,
            deleteAppt: s.deleteAppt
        }))
    );

    // --- LẤY STATE & ACTIONS TỪ UI STORE ---
    const {
        showServiceSheet, employeeForAvailable, serviceIndex,
        comboIndex, isShowTechnician, openServiceSheet,
        closeServiceSheet, openTechnicianSheet, closeTechnicianSheet,
    } = useAppointmentUIStore(
        useShallow((s) => ({
            showServiceSheet: s.showServiceSheet,
            employeeForAvailable: s.employeeForAvailable,
            serviceIndex: s.serviceIndex,
            comboIndex: s.comboIndex,
            isShowTechnician: s.isShowTechnician,
            openServiceSheet: s.openServiceSheet,
            closeServiceSheet: s.closeServiceSheet,
            openTechnicianSheet: s.openTechnicianSheet,
            closeTechnicianSheet: s.closeTechnicianSheet,
        }))
    );

    const { selectedCustomer, resetCustomerState } = useCustomerStore(
        useShallow(
            (state) => ({ selectedCustomer: state.selectedCustomer, resetCustomerState: state.reset })
        ))


    ////Home store
    const { selectedStore, json } = useHomeStore(
        useShallow(
            (state) => ({ selectedStore: state.selectedStore, json: state.json })
        ))

    const { getAppointmentList } = useAppointmentStore(
        useShallow((s) => ({ getAppointmentList: s.getAppointmentList }))
    );

    const { listEmployee } = useEmployeeStore(useShallow(s => ({ listEmployee: s.employees })))
    // const { sendMessage } = useSignalR();
    const navigation = useNavigation();
    const { showAlert, showConfirm } = useXAlert();
    useBackHandler(navigation, reset);

    const isAllowEdit = useMemo(() => getIsAllowEdit(json), [apptDetails, getIsAllowEdit]);
    const isAllowDelete = useMemo(() => getIsAllowDelete(json), [apptDetails, getIsAllowDelete]);
    const styles = useMemo(
        () => stylesMemoize(theme), [theme]
    );

    useEffect(() => {
        const init = async () => {
            await loadConfigData(listEmployee)
            if (!apptId) {
                const params: GetApptDetailsRequest = {
                    apptId: apptId ?? "",
                    listEmployee: listEmployee,
                    listItemMenu: listItemMenu,
                    companyProfile: companyProfile,
                    listApptType: listApptType

                }
                const result = await getApptDetails(params);
                if (isSuccess(result)) {
                    useCustomerStore.setState({ selectedCustomer: result.value.customer })
                }
            }
        }
        init();
        // Clean up store khi unmount
        return () => {
            reset();
            resetCustomerState();
        }
    }, [apptId, reset]);

    useEffect(() => {
        if (!isLoading && selectedCustomer == null && !apptId) {
            navigate(ROUTES.SELECT_CUSTOMER as never);
        }
    }, [isLoading, selectedCustomer]);

    const dropdownOptions = useMemo(() =>
        listApptType.map((e) => ({ label: e.name, value: e })),
        [listApptType]
    );

    // --- Memoized Callbacks - Cập nhật để dùng actions từ các store mới ---
    const handleSave = useCallback(async () => {
        const result = await saveAppointment(selectedCustomer);
        if (isSuccess(result)) {
            // sendMessage([{ type: "SendMessage", data: createApptMessage(result.value) }]);
            showAlert({
                title: "Successfully",
                message: "Appointment created successfully",
                onClose: async () => {
                    const json = await appConfig.getUser();
                    getAppointmentList(json);
                    goBack();
                }
            });
        }
    }, [saveAppointment, showAlert, getAppointmentList]);

    const handleNavigateToSelectCustomer = useCallback(() => navigate(ROUTES.SELECT_CUSTOMER as never), []);

    const handleDateChange = useCallback((date: Date) => {
        const newDate = new Date(selectedDate);
        newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        setSelectedDate(newDate);
    }, [setSelectedDate, selectedDate]);

    const handleTimeChange = useCallback((time: Date) => {
        const newDate = new Date(selectedDate);
        newDate.setHours(time.getHours(), time.getMinutes());
        setSelectedDate(newDate);
    }, [setSelectedDate, selectedDate]);

    const handleSelectTechnician = useCallback((index: number, comboIdx = -1) => {
        const service = comboIdx === -1
            ? listServices[index].service
            : listServices[index].comboItems?.[comboIdx]?.service;

        if (!service) return;

        const allowedEmployeesIds = service.allowedEmployees || [];
        // Nếu không có allowedEmployees, hiển thị tất cả nhân viên đang làm việc
        const listEmployee = allowedEmployeesIds.length > 0
            ? listEmployeeOnWork.filter((emp) => allowedEmployeesIds.includes(emp.id))
            : listEmployeeOnWork;

        openTechnicianSheet({ employees: listEmployee, serviceIndex: index, comboIndex: comboIdx });
    }, [listServices, listEmployeeOnWork, openTechnicianSheet]);

    const handleSelectServiceItem = useCallback((service: MenuItemEntity) => {
        updateBookingService({ serviceIndex, e: service, type: 'service' });
        closeServiceSheet(); // Tự động đóng sau khi chọn
    }, [updateBookingService, serviceIndex, closeServiceSheet]);

    const handleSelectEmployeeItem = useCallback((item: EmployeeEntity) => {
        updateBookingService({ serviceIndex, e: item, type: 'technician', comboIndex });
        closeTechnicianSheet(); // Tự động đóng sau khi chọn
    }, [updateBookingService, serviceIndex, comboIndex, closeTechnicianSheet]);

    const onDeleteAppointment = useCallback(
        async () => {
            let result = await deleteAppt(selectedStore);
            if (isSuccess(result) && result.value.result) {
                const json = await appConfig.getUser();
                getAppointmentList(json);
                goBack()
            }
            else if (isSuccess(result)) {
                showAlert({ message: result.value.errorMsg, type: 'error' })
            }
            else if (isFailure(result)) {
                showAlert({ message: result.error.message, type: 'error' })
            }
        }, [deleteAppt, showAlert, getAppointmentList]
    )

    const onTrashButtonClick = useCallback(
        async () => {
            showConfirm({
                title: 'Delete Appointment',
                message: 'Are you sure you want to delete this appointment?',
                confirmText: 'Delete',
                cancelText: 'Cancel',
                onConfirm: onDeleteAppointment,
                onCancel: () => { },
                childrenBottom: <XColumn style={styles.deleteApptChildren}>
                    <XRow justify="center">
                        <XText variant="titleMedium">Customer: </XText>
                        <XText variant="titleRegular">{apptDetails?.customer.firstName + ' ' + apptDetails?.customer.lastName}</XText>
                    </XRow>
                    <XRow justify="center">
                        <XText variant="titleMedium">Date & Time: </XText>
                        <XText variant="titleRegular">{apptDetails?.apptDate.toDate()?.format('MMM dd, HH:mm AM')}</XText>
                    </XRow>
                </XColumn>
            })
        }, [apptDetails]);

    const trashButton = useMemo(
        () => {
            return <TouchableOpacity onPress={
                onTrashButtonClick
            }> <XIcon name="trash"></XIcon></TouchableOpacity>
        },
        [isAllowEdit]
    )
    return (
        <XScreen
            title={apptId ? "Edit Appointment" : "Booking Appointment"}
            loading={isLoading}
            error={error}
            scrollable={true}
            footer={isAllowEdit && <XButton title="Save" onPress={handleSave} />}
            rightIcon={isAllowDelete && trashButton}
        >
            <View style={styles.container}>
                {!isAllowEdit &&
                    <View style={styles.mask} />
                }
                <CustomerPicker customer={selectedCustomer} onSelect={handleNavigateToSelectCustomer} />
                <AppointmentTypeDropdown
                    selectedApptType={selectedApptType as any}
                    dropdownOptions={dropdownOptions as any}
                    handleApptTypeSelect={setSelectedApptType}
                />
                <ConfirmOnlineToggle value={isConfirmOnline} onChange={setIsConfirmOnline} />
                <GroupApptToggle value={isGroupAppt} onChange={setIsGroupAppt} />
                <XDivider />
                <DatePickerField value={selectedDate} onChange={handleDateChange} />
                <TimePickerField value={selectedDate} onChange={handleTimeChange} />
                <XDivider />

                <View style={styles.menuHeader}>
                    <XIcon name="menu" width={16} height={16} color={theme.colors.primaryMain} />
                    <XText variant="titleRegular">Service</XText>
                </View>

                <ServiceList
                    services={listServices}
                    listEmployeeOnWork={listEmployeeOnWork}
                    onSelectService={openServiceSheet} // Sử dụng trực tiếp action mới
                    onRemoveService={removeBookingService}
                    onSelectTechnician={handleSelectTechnician}
                />
            </View>

            <SelectServiceScreen
                visible={showServiceSheet}
                onClose={closeServiceSheet} // Sử dụng action mới
                onSelect={handleSelectServiceItem}
            />

            <XBottomSheetSearch
                visible={isShowTechnician}
                onClose={closeTechnicianSheet} // Sử dụng action mới
                data={employeeForAvailable}
                onSelect={handleSelectEmployeeItem}
                placeholder="Search..."
                title="Technician"
            />
        </XScreen>
    );
}

