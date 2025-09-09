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
import { useCreateAppointmentStore } from "../stores/createAppointmentStore";
import { useAppointmentUIStore } from "../stores/createAppointmentUIStore";
import { useCustomerStore } from "../stores/customerStore";
import { XColumn } from "@/shared/components/XColumn";
import { XRow } from "@/shared/components/XRow";
import { toDate } from "date-fns";
import { createApptMessage } from "../types/AppointmentMessage";
import {XDivider} from "@/shared/components/XDivider";
// --- Component ---
export default function CreateAppointmentScreen() {
    const route = useRoute<RouteProp<RootStackParamList, 'CreateAppointment'>>();
    const { apptId } = route.params || {};
    
    const theme = useTheme();
    const styles = useMemo(
        () => StyleSheet.create({
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
                backgroundColor: 'rgba(255, 255, 255, 0.7)', // Thêm độ trong suốt
                zIndex: 10,
            },
            deleteApptChildren: { 
                backgroundColor: theme.colors.primaryOpacity5, 
                paddingVertical: theme.spacing.xs, 
                paddingHorizontal: theme.spacing.xs
            },

        }), [theme]);
    const { showAlert, showConfirm } = useXAlert();
    const { sendMessage } = useSignalR();
    const navigation = useNavigation();

    // --- LẤY STATE & ACTIONS TỪ FORM STORE ---
    const { 
        selectedApptType, listApptType, isLoading, listServices, selectedDate,
        isConfirmOnline, isGroupAppt, error, listEmployeeOnWork, apptDetails,
        setSelectedApptType, setSelectedDate, setIsConfirmOnline, setIsGroupAppt,
        reset, saveAppointment, initData, getIsAllowEdit,
        updateBookingService, removeBookingService, getIsAllowDelete, deleteAppt
    } = useCreateAppointmentStore(
        useShallow((s) => ({
            selectedApptType: s.selectedApptType,
            listApptType: s.listApptType,
            isLoading: s.isLoading,
            listServices: s.listBookingServices,
            selectedDate: s.selectedDate,
            isConfirmOnline: s.isConfirmOnline,
            isGroupAppt: s.isGroupAppointment,
            error: s.error,
            listEmployeeOnWork: s.listEmployeeOnWork,
            apptDetails: s.apptDetails,
            setSelectedApptType: s.setSelectedApptType,
            setSelectedDate: s.setSelectedDate,
            setIsConfirmOnline: s.setIsConfirmOnline,
            setIsGroupAppt: s.setIsGroupAppt,
            reset: s.reset,
            saveAppointment: s.saveAppointment,
            initData: s.initData,
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
    
    const {selectedCustomer, resetCustomerState} = 
    useCustomerStore(
        useShallow(
        (state)=> ({selectedCustomer: state.selectedCustomer, resetCustomerState: state.reset})
    ))
    // Các hook khác không thay đổi
    const { getAppointmentList } = useAppointmentStore(
        useShallow((s) => ({ getAppointmentList: s.getAppointmentList }))
    );
    
    useBackHandler(navigation, reset);

    const isAllowEdit = useMemo(() => getIsAllowEdit(), [apptDetails, getIsAllowEdit]);
    const isAllowDelete = useMemo(  () => getIsAllowDelete(), [apptDetails, getIsAllowDelete]);

    useEffect(() => {
        initData(apptId);
        // Clean up store khi unmount
        return () => {
            reset();
            resetCustomerState();
        }
    }, [apptId, initData, reset]);

    useEffect(() => {
        if (!isLoading && selectedCustomer == null && !apptId) {
            navigate(ROUTES.SELECT_CUSTOMER as never);
        }
    }, [isLoading, selectedCustomer, apptId]);
   
    const dropdownOptions = useMemo(() => 
        listApptType.map((e) => ({label: e.name, value: e})), 
        [listApptType]
    );

    // --- Memoized Callbacks - Cập nhật để dùng actions từ các store mới ---
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
        async ()  =>{
            let result = await deleteAppt();
            if(isSuccess(result) && result.value.result) {
                const json = await appConfig.getUser();
                getAppointmentList(json);
                goBack()
            }
            else if (isSuccess(result)) {
                showAlert({message: result.value.errorMsg, type: 'error'})
            }
            else if(isFailure(result)) {
                showAlert({message: result.error.message, type: 'error'})
            }
        },[deleteAppt, showAlert,getAppointmentList]
    )
    
    const onTrashButtonClick = useCallback(
        async ()  =>{
            showConfirm({
                title: 'Delete Appointment',
                message: 'Are you sure you want to delete this appointment?',
                confirmText: 'Delete',
                cancelText: 'Cancel',
                onConfirm: onDeleteAppointment,
                onCancel: ()=>{},
                children: <XColumn style={styles.deleteApptChildren}>
                    <XRow justify="center">
                        <XText variant="titleMedium">Customer: </XText>
                        <XText variant="titleRegular">{apptDetails?.customer.firstName+' '+apptDetails?.customer.lastName}</XText>
                    </XRow>
                    <XRow justify="center">
                        <XText variant="titleMedium">Date & Time: </XText>
                        <XText variant="titleRegular">{apptDetails?.apptDate.toDate()?.format('MMM dd, HH:mm AM')}</XText>
                    </XRow>
                </XColumn>
            })
        },[apptDetails]);

    const trashButton = useMemo(
        ()=>{
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
            footer={isAllowEdit && <XButton title="Save" onPress={handleSave}/>}
            rightIcon= {isAllowDelete && trashButton}
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
                <XDivider/>
                <DatePickerField value={selectedDate} onChange={handleDateChange} />
                <TimePickerField value={selectedDate} onChange={handleTimeChange} />
                <XDivider/>
                
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

