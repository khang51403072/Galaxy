import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

// --- IMPORT CÁC COMPONENT GIAO DIỆN ---
import XScreen from "@/shared/components/XScreen";
import XText from "@/shared/components/XText";
import XIcon from "@/shared/components/XIcon";
import XButton from "@/shared/components/XButton";
import XBottomSheetSearch from "@/shared/components/XBottomSheetSearch";
import { XDivider } from "@/shared/components/XDivider";
import SelectServiceScreen from "../components/SelectServiceScreen";
import ServiceList from "../components/ServiceList";
import AppointmentTypeDropdown from "../components/AppTypeDropdown";
import { ConfirmOnlineToggle, GroupApptToggle } from "../components/AppointmentToggles";
import { CustomerPicker } from "../components/AppointmentPickers";
import { DatePickerField, TimePickerField } from "../components/DateTimePickerField";

// --- IMPORT HOOK "BỘ NÃO" DUY NHẤT ---
import { useCreateAppointment } from "../hooks/useCreateAppointment";
import { XColumn } from "@/shared/components/XColumn";
import { XRow } from "@/shared/components/XRow";
import { ApptDetail } from "../types/ApptDetailsResponse";

/**
 * @description
 * Create/Edit Appointment Screen.
 * This is now a "Dumb" or "Presentational" component. Its sole responsibility
 * is to render the UI based on the state provided by the `useAppointment` hook
 * and to delegate all user interactions to the actions provided by that hook.
 * It contains no business logic, no side effects, and no direct store access.
 */
export default function CreateAppointmentScreen() {
    // --- 1. LẤY TOÀN BỘ STATE VÀ ACTIONS TỪ CUSTOM HOOK ---
    // Component không cần biết logic bên trong hook hoạt động như thế nào.
    const { state, actions } = useCreateAppointment();

    // --- 2. TẠO CÁC GIÁ TRỊ DERIVED CHO UI (NẾU CẦN) ---
    // Logic này đơn giản và gắn liền với UI, nên có thể giữ lại đây.
    const dropdownOptions = useMemo(() =>
        state.listApptType.map((e) => ({ label: e.name, value: e })),
        [state.listApptType]
    );

    const trashButton = useMemo(() => 
        {
            
            return (
                <TouchableOpacity onPress={actions.onTrashButtonClick} >
                    <XIcon name="trash" />
                </TouchableOpacity>
            )
        }, [actions.onTrashButtonClick]);


    // --- 3. RENDER GIAO DIỆN DỰA TRÊN STATE ---
    // Toàn bộ phần JSX bên dưới chỉ đọc dữ liệu từ `state` và gọi hàm từ `actions`.
    return (
        <XScreen
            title={state.isEditMode ? "Edit Appointment" : "Booking Appointment"}
            loading={state.isLoading}
            error={state.error}
            scrollable={true}
            footer={state.isAllowEdit && <XButton title="Save" onPress={actions.handleSave} />}
            rightIcon={state.isAllowDelete ? trashButton : undefined}
        >
            <View style={state.styles.container}>
                {/* Lớp che mờ khi không được phép chỉnh sửa */}
                {!state.isAllowEdit && <View style={state.styles.mask} />}

                {/* Phần thông tin khách hàng và loại cuộc hẹn */}
                <CustomerPicker customer={state.selectedCustomer} onSelect={actions.navigateToSelectCustomer} />
                <AppointmentTypeDropdown
                    selectedApptType={state.selectedApptType as any}
                    dropdownOptions={dropdownOptions as any}
                    handleApptTypeSelect={actions.setSelectedApptType}
                />
                <ConfirmOnlineToggle value={state.isConfirmOnline} onChange={actions.setIsConfirmOnline} />
                <GroupApptToggle value={state.isGroupAppt} onChange={actions.setIsGroupAppt} />
                <XDivider />

                {/* Phần chọn ngày giờ */}
                <DatePickerField value={state.selectedDate} onChange={actions.handleDateChange} />
                <TimePickerField value={state.selectedDate} onChange={actions.handleTimeChange} />
                <XDivider />

                {/* Phần danh sách dịch vụ */}
                <View style={state.styles.menuHeader}>
                    <XIcon name="menu" width={16} height={16} color={state.theme.colors.primaryMain} />
                    <XText variant="titleRegular">Service</XText>
                </View>

                <ServiceList
                    services={state.listServices}
                    listEmployeeOnWork={state.listEmployeeOnWork}
                    onSelectService={actions.openServiceSheet}
                    onRemoveService={actions.removeBookingService}
                    onSelectTechnician={actions.handleSelectTechnician}
                />
            </View>

            {/* Các Bottom Sheet để chọn dịch vụ và kỹ thuật viên */}
            <SelectServiceScreen
                visible={state.showServiceSheet}
                onClose={actions.closeServiceSheet}
                onSelect={actions.handleSelectServiceItem}
            />

            <XBottomSheetSearch
                visible={state.isShowTechnician}
                onClose={actions.closeTechnicianSheet}
                data={state.employeeForAvailable}
                onSelect={actions.handleSelectEmployeeItem}
                placeholder="Search..."
                title="Technician"
            />
        </XScreen>
    );
}


export const DeleteItemInfo  = (styles: any, apptDetails?: ApptDetail|null) => <XColumn style={styles.deleteApptChildren}>
                    <XRow justify="center">
                        <XText variant="titleMedium">Customer: </XText>
                        <XText variant="titleRegular">{apptDetails?.customer.firstName} {apptDetails?.customer.lastName}</XText>
                    </XRow>
                    <XRow justify="center">
                        <XText variant="titleMedium">Date & Time: </XText>
                        <XText variant="titleRegular">{new Date(apptDetails?.apptDate ?? '').toLocaleDateString()}</XText>
                    </XRow>
                </XColumn>