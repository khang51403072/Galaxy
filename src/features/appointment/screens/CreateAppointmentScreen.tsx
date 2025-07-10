import XDatePicker from "@/shared/components/XDatePicker";
import XDropdown from "@/shared/components/XDropdown";
import XIcon from "@/shared/components/XIcon";
import XInput from "@/shared/components/XInput";
import XScreen from "@/shared/components/XScreen";
import XSwitch from "@/shared/components/XSwitch";
import XText from "@/shared/components/XText";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { createAppointmentSelectors, useCreateAppointmentStore } from "../stores/createAppointmentStore";
import { useShallow } from "zustand/react/shallow";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "@/app/routes";



export default function CreateAppointmentScreen() {
    const theme = useTheme();
    const navigation = useNavigation();
    // Tạo ref cho từng XDatePicker
    const {getApptResource} = useCreateAppointmentStore(useShallow((state) => ({
        getApptResource: createAppointmentSelectors.selectGetApptResource(state),
    })));



    const customerPicker = ()=>{
        return (
            <TouchableOpacity style={{}} onPress={async () => {
                //navigate sang màn hình select customer
                navigation.navigate(ROUTES.SELECT_CUSTOMER as never);
            }}>
                <XInput value={""} editable={false} placeholder="Choose Customer" pointerEvents="none"/>
            </TouchableOpacity>
        )
    }
    const dropdownPicker = ()=>{
        return (
            <XDropdown value={""} placeholder="Choose Service" options={[]} onSelect={()=>{}} />
        )
            
    }
    const confirmOnlineToggle = ()=>{
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <XText variant="createAppointmentContent">Confirm Online</XText>
                <XSwitch value={false} onValueChange={()=>{}} />
            </View>
        )
    }

    const groupApptToggle = ()=>{
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <XText variant="createAppointmentContent">Group Appointment</XText>
                <XSwitch value={false} onValueChange={()=>{}} />
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
                    value={new Date()}
                    onChange={() => {}}
                    // pickerRef={datePickerRef}
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
            <XDatePicker mode="time" style={{ width: '40%' }} value={new Date()} onChange={()=>{}}  format={(date)=>{
                // timePickerRef.current?.focus();
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }} />
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
            <View style={{ gap: theme.spacing.sm }}>
                {customerPicker()     }
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