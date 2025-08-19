import XIcon from "@/shared/components/XIcon";
import XScreen from "@/shared/components/XScreen";
import XText from "@/shared/components/XText";
import { useTheme, Theme } from "@/shared/theme/ThemeProvider";
import { useCallback, useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useCreateAppointmentStore } from "../stores/createAppointmentStore";
import { useShallow } from "zustand/react/shallow";
import { RootStackParamList, ROUTES } from "@/app/routes";
import { goBack, navigate } from "@/app/NavigationService";
import { useAppointmentStore } from "../stores/appointmentStore";
import { isSuccess } from "@/shared/types/Result";
import SelectServiceScreen from "../components/SelectServiceScreen";
import { MenuItemEntity } from "../types/MenuItemResponse";
import XBottomSheetSearch from "@/shared/components/XBottomSheetSearch";
import { EmployeeEntity } from "@/features/ticket/types/TicketResponse";
import XButton from "@/shared/components/XButton";
import { useXAlert } from "@/shared/components/XAlertContext";
import { appConfig } from "@/shared/utils/appConfig";
import useSignalR from "@/shared/hooks/useSignalR";
import { DataAppt } from "../types/ApptSaveResponse";
import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useBackHandler } from "@/shared/hooks/useBackHandler";
import ServiceList from "../components/ServiceList";
import AppointmentTypeDropdown from "../components/AppTypeDropdown";
import { ConfirmOnlineToggle, GroupApptToggle } from "../components/AppointmentToggles";
import { CustomerPicker } from "../components/AppointmentPickers";
import { DatePickerField, TimePickerField } from "../components/DateTimePickerField";

// --- Helper Functions ---
interface ApptMessage {
    message: string;
    date: string;
    actionType: string;
    apptId: string;
    customerId: string;
}

function createApptMessage(data: DataAppt): ApptMessage {
    return {
        message: "appointment-booking",
        date: data.apptDate,
        actionType: "save-apt",
        apptId: data.id,
        customerId: data.customer.id,
    };
}

// --- Component ---
export default function CreateAppointmentScreen() {
    const route = useRoute<RouteProp<RootStackParamList, 'CreateAppointment'>>();
    const { apptId } = route.params || {};
    
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const { showAlert } = useXAlert();
    const { sendMessage } = useSignalR();
    
    // Lấy state và actions từ store. Giữ cấu trúc phẳng để tránh tạo object mới.
    const { 
        selectedCustomer, selectedApptType, listApptType, 
        listItemMenu, isLoading, listServices, selectedDate,
        isConfirmOnline, isGroupAppt, error, listEmployeeOnWork,
        showServiceSheet, employeeForAvailable, serviceIndex,
        comboIndex, isShowTechnician, apptDetails,
        
        setSelectedApptType, setShowServiceSheet, setIsShowTechnician, 
        setServiceIndex, setComboIndex, setSelectedDate,
        setIsConfirmOnline, setIsGroupAppt, setEmployeeForAvailable,
        reset, saveAppointment, initData, getIsAllowEdit,
        updateBookingService, removeBookingService,
    } = useCreateAppointmentStore(
        useShallow((s) => ({
            selectedCustomer: s.selectedCustomer,
            selectedApptType: s.selectedApptType,
            listApptType: s.listApptType,
            listItemMenu: s.listItemMenu,
            isLoading: s.isLoading,
            listServices: s.listBookingServices,
            selectedDate: s.selectedDate,
            isConfirmOnline: s.isConfirmOnline,
            isGroupAppt: s.isGroupAppointment,
            error: s.error,
            listEmployeeOnWork: s.listEmployeeOnWork,
            showServiceSheet: s.showServiceSheet,
            employeeForAvailable: s.employeeForAvailable,
            serviceIndex: s.serviceIndex,
            comboIndex: s.comboIndex,
            isShowTechnician: s.isShowTechnician,
            apptDetails: s.apptDetails, // Cần apptDetails để tính isAllowEdit

            setSelectedApptType: s.setSelectedApptType,
            setShowServiceSheet: s.setShowServiceSheet,
            setIsShowTechnician: s.setIsShowTechnician,
            setServiceIndex: s.setServiceIndex,
            setComboIndex: s.setComboIndex,
            setSelectedDate: s.setSelectedDate,
            setIsConfirmOnline: s.setIsConfirmOnline,
            setIsGroupAppt: s.setIsGroupAppt,
            setEmployeeForAvailable: s.setEmployeeForAvailable,
            reset: s.reset,
            saveAppointment: s.saveAppointment,
            initData: s.initData,
            getIsAllowEdit: s.getIsAllowEdit,
            updateBookingService: s.updateBookingService,
            removeBookingService: s.removeBookingService,
        }))
    );

    const { getAppointmentList } = useAppointmentStore(
        useShallow((s) => ({ getAppointmentList: s.getAppointmentList }))
    );
    
    const navigation = useNavigation();
    useBackHandler(navigation, reset);

    // GIẢI PHÁP 2: Dùng useMemo để tính toán state thay vì dùng useState
    // Giá trị này sẽ tự động cập nhật khi apptDetails thay đổi mà không gây re-render lặp
    const isAllowEdit = useMemo(() => getIsAllowEdit(), [apptDetails, getIsAllowEdit]);

    // useEffect để load data
    useEffect(() => {
        initData(apptId);
    }, [apptId, initData]);

    // useEffect thứ hai để xử lý logic điều hướng KHI state thay đổi
    useEffect(() => {
        // Chỉ kiểm tra khi quá trình loading ban đầu đã kết thúc
        if (!isLoading && selectedCustomer == null && !apptId) {
            navigate(ROUTES.SELECT_CUSTOMER as never);
        }
        // Effect này chạy lại mỗi khi isLoading hoặc selectedCustomer thay đổi
    }, [isLoading, selectedCustomer, apptId]);
   
    const dropdownOptions = useMemo(() => 
        listApptType.map((e) => ({label: e.name, value: e})), 
        [listApptType]
    );

    // --- Memoized Callbacks ---
    const handleSave = useCallback(async () => {
        const result = await saveAppointment();
        if (isSuccess(result)) {  
            sendMessage([{ type: "SendMessage", data: createApptMessage(result.value) }]);
            showAlert({
                title: "Successfully",
                message: "Appointment created successfully",
                onClose: async () => {
                    goBack();
                    const json = await appConfig.getUser();
                    getAppointmentList(json);
                }
            });
        }
    }, [saveAppointment, sendMessage, showAlert, getAppointmentList]);

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
    
    const handleSelectService = useCallback((index: number) => {
        setServiceIndex(index);
        setShowServiceSheet(true);
    }, [setServiceIndex, setShowServiceSheet]);

    const handleSelectTechnician = useCallback((index: number, comboIndex = -1) => {
        setServiceIndex(index);
        setComboIndex(comboIndex);
        const service = comboIndex === -1
            ? listServices[index].service
            : listServices[index].comboItems?.[comboIndex]?.service;
        const allowedEmployees = service?.allowedEmployees || [];
        const setEmployee = new Set(allowedEmployees);
        const listEmployee = listEmployeeOnWork.filter((emp) => setEmployee.has(emp.id));
        setEmployeeForAvailable(listEmployee);
        setIsShowTechnician(true);
    }, [setServiceIndex, setComboIndex, listServices, listEmployeeOnWork, setEmployeeForAvailable, setIsShowTechnician]);
    
    const handleSelectServiceItem = useCallback((service: MenuItemEntity) => {
       updateBookingService({ serviceIndex, e: service, type: 'service' });
    }, [updateBookingService, serviceIndex]);

    const handleSelectEmployeeItem = useCallback((item: EmployeeEntity) => {
        updateBookingService({ serviceIndex, e: item, type: 'technician', comboIndex });
    }, [updateBookingService, serviceIndex, comboIndex]);

    const handleCloseServiceSheet = useCallback(() => setShowServiceSheet(false), [setShowServiceSheet]);
    const handleCloseTechnicianSheet = useCallback(() => setIsShowTechnician(false), [setIsShowTechnician]);

    return (
        <XScreen 
            title="Booking Appointment" 
            loading={isLoading} 
            error={error}
            scrollable={true}
            footer={isAllowEdit && <XButton title="Save" onPress={handleSave} />}
        >   
            <View style={styles.container}>
                {!isAllowEdit &&
                    <View style={styles.customerDetailsContainer}>
                        <XIcon name="customer" height={24} width={24} color={theme.colors.primaryMain} />
                        <XText variant="titleRegular" color={theme.colors.gray700}>Customer Details</XText>
                    </View>
                }
                <CustomerPicker customer={selectedCustomer} onSelect={handleNavigateToSelectCustomer} />
                <AppointmentTypeDropdown
                    selectedApptType={selectedApptType as any}
                    dropdownOptions={dropdownOptions as any}
                    handleApptTypeSelect={setSelectedApptType}
                />
                <ConfirmOnlineToggle value={isConfirmOnline} onChange={setIsConfirmOnline} />
                <GroupApptToggle value={isGroupAppt} onChange={setIsGroupAppt} />
                
                <View style={styles.divider} />
                
                <DatePickerField value={selectedDate} onChange={handleDateChange} />
                <TimePickerField value={selectedDate} onChange={handleTimeChange} />
                
                <View style={styles.divider} />
                
                <View style={styles.menuHeader}>
                    <XIcon name="menu" width={16} height={16} color={theme.colors.primaryMain} />
                    <XText variant="titleRegular">Service</XText>
                </View>

                <ServiceList
                    services={listServices}
                    listEmployeeOnWork={listEmployeeOnWork}
                    onSelectService={handleSelectService}
                    onRemoveService={removeBookingService}
                    onSelectTechnician={handleSelectTechnician}
                />
            </View> 
            
            <SelectServiceScreen
                visible={showServiceSheet}
                onClose={handleCloseServiceSheet}
                onSelect={handleSelectServiceItem}
            />
            
            <XBottomSheetSearch
                visible={isShowTechnician}
                onClose={handleCloseTechnicianSheet}
                data={employeeForAvailable}
                onSelect={handleSelectEmployeeItem}
                placeholder="Search..."
                title="Technician"
            /> 
            
            
        </XScreen>
    );
}   

// --- Styles ---
const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        gap: theme.spacing.md,
        paddingTop: theme.spacing.md,
        flex: 1,
    },
    customerDetailsContainer: {
        gap: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.gray200,
    },
    menuHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#FFFFFF80',
        zIndex: 1000,
    },
});