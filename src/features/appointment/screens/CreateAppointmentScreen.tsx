import XDatePicker from "@/shared/components/XDatePicker";
import XDropdown from "@/shared/components/XDropdown";
import XIcon from "@/shared/components/XIcon";
import XInput from "@/shared/components/XInput";
import XScreen from "@/shared/components/XScreen";
import XSwitch from "@/shared/components/XSwitch";
import XText from "@/shared/components/XText";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { createAppointmentSelectors, useCreateAppointmentStore } from "../stores/createAppointmentStore";
import { useShallow } from "zustand/react/shallow";
import { ROUTES } from "@/app/routes";
import { navigate } from "@/app/NavigationService";
import { createApptType } from "../types/AppointmentType";



export default function CreateAppointmentScreen() {
    const theme = useTheme();
    const [isConfirmOnline, setIsConfirmOnline] = useState(false)
    const [isGroupAppt, setIsGroupAppt] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())
    // Tạo ref cho từng XDatePicker
    const {getApptResource, selectedCustomer} = useCreateAppointmentStore(useShallow((state) => ({
        getApptResource: createAppointmentSelectors.selectGetApptResource(state),
        selectedCustomer: createAppointmentSelectors.selectSelectedCustomer(state)
    })));


    const listApptType = [
        createApptType("Misc", "Misc",),
        createApptType("NewCustomer", "New Customer", ),
        createApptType("Request", "Choose Tech"),
        createApptType("NonRequest", "Any Tech",),
        createApptType("WalkIn", "Walk In"),
        createApptType("Online", "Online"),
      ];
    const customerPicker = ()=>{
        return (
            <TouchableOpacity style={{}} onPress={
                async () => {
                navigate(ROUTES.SELECT_CUSTOMER as never);
            }}>
                <XInput value={selectedCustomer?.firstName} editable={false} placeholder="Choose Customer" pointerEvents="none"/>
            </TouchableOpacity>
        )
    }
    const dropdownPicker = ()=>{
        return (
            <XDropdown value={""} placeholder="Choose Service" options={listApptType.map((e)=>({label: e.name, value: e}))} onSelect={()=>{}} />
        )
            
    }
    const confirmOnlineToggle = ()=>{
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <XText variant="createAppointmentContent">Confirm Online</XText>
                <XSwitch value={isConfirmOnline} onValueChange={setIsConfirmOnline} />
            </View>
        )
    }

    const groupApptToggle = ()=>{
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <XText variant="createAppointmentContent">Group Appointment</XText>
                <XSwitch value={isGroupAppt} onValueChange={setIsGroupAppt} />
            </View>
        )
    }
    const  divider = ()=>{
        return (
            <View style={{ height: 1, backgroundColor: theme.colors.border, marginVertical: 10 }} />
        )
    }

    const datePicker = ()=>{
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <XIcon name="date" width={16} height={16} />
                    <XText variant="createAppointmentContent">Date</XText>
                </View>
                <XDatePicker
                    style={{ width: '40%' }}
                    value={selectedDate}
                    onChange={setSelectedDate}
                />
            </View>
        )
    }
    const timePicker = ()=>{
        return (
            
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <XIcon name="time" width={16} height={16} />
                <XText variant="createAppointmentContent">Time</XText>
            </View>
            <XDatePicker mode="time" style={{ width: '40%' }} value={new Date()} onChange={()=>{}} />
        </View>
        )
    }
    const menuText = ()=>{
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <XIcon name="menu" width={16} height={16} />
                <XText variant="createAppointmentContent">Service</XText>
            </View>
            <View style={{ width: '40%' }}>
                
            </View>
        </View>

        )
    }
    return (
        <XScreen title="Booking Appointment" >    
            <View style={{ gap: theme.spacing.md, paddingTop: theme.spacing.md }}>
                {customerPicker()}
                {dropdownPicker()}
                {confirmOnlineToggle()}
                {groupApptToggle()}
                {divider()}
                {datePicker()}
                {timePicker()}
                {divider()}
                {menuText()}
            </View>
        </XScreen>
    )
}   