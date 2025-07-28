import { XDatePicker } from "@/shared/components/XDatePicker";
import XDropdown, { DropdownOption } from "@/shared/components/XDropdown";
import XIcon from "@/shared/components/XIcon";
import XInput from "@/shared/components/XInput";
import XScreen from "@/shared/components/XScreen";
import XSwitch from "@/shared/components/XSwitch";
import XText from "@/shared/components/XText";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { useEffect, useRef, useState } from "react";
import { FlatList, ScrollView, TouchableOpacity, View } from "react-native";
import { createAppointmentSelectors, ServicesEntity, useCreateAppointmentStore } from "../stores/createAppointmentStore";
import { useShallow } from "zustand/react/shallow";
import { ROUTES } from "@/app/routes";
import { goBack, navigate } from "@/app/NavigationService";
import { ApptType, createApptType } from "../types/AppointmentType";
import { appointmentSelectors, createAppointmentStore, useAppointmentStore } from "../stores/appointmentStore";
import { isSuccess } from "@/shared/types/Result";
import XNoDataView from "@/shared/components/XNoDataView";
import SelectServiceScreen from "../components/SelectServiceScreen";
import { MenuItemEntity } from "../types/MenuItemResponse";
import { employeeSelectors, useEmployeeStore } from "@/shared/stores/employeeStore";
import XBottomSheetSearch from "@/shared/components/XBottomSheetSearch";
import { useTicketStore } from "@/features/ticket/stores/ticketStore";
import { EmployeeEntity, getDisplayName, isEmployee } from "@/features/ticket/types/TicketResponse";
import XButton from "@/shared/components/XButton";


export default function CreateAppointmentScreen() {
    const theme = useTheme();
   
    const [showServiceSheet, setShowServiceSheet] = useState(false);
    const {employees} = useEmployeeStore(useShallow((state)=>({
        employees: employeeSelectors.selectEmployees(state)
    })))
    const {
        getApptResource, selectedCustomer,selectedApptType,listApptType, 
        getListCategories, getListItemMenu, listCategories,
        listItemMenu,isLoading, listServices,selectedDate,setSelectedDate,
        isConfirmOnline,setIsConfirmOnline,
        isGroupAppt,setIsGroupAppt, 
        getCustomerLookup,
        saveAppointment,
        error,
        reset
    } = useCreateAppointmentStore(useShallow((state) => ({
        getApptResource: createAppointmentSelectors.selectGetApptResource(state),
        selectedCustomer: createAppointmentSelectors.selectSelectedCustomer(state),
        selectedApptType: createAppointmentSelectors.selectSelectedApptType(state),
        listApptType: createAppointmentSelectors.selectListApptType(state),
        getListCategories: createAppointmentSelectors.selectGetListCategories(state),
        getListItemMenu: createAppointmentSelectors.selectGetListItemMenu(state),
        listCategories: createAppointmentSelectors.selectListCategories(state),
        listItemMenu: createAppointmentSelectors.selectListItemMenu(state),
        isLoading: createAppointmentSelectors.selectIsLoading(state),
        listServices: createAppointmentSelectors.selectListService(state),
        selectedDate: createAppointmentSelectors.selectSelectedDate(state),
        setSelectedDate: createAppointmentSelectors.selectSetSelectedDate(state),
        isConfirmOnline: createAppointmentSelectors.selectIsConfirmOnline(state),
        setIsConfirmOnline: createAppointmentSelectors.selectSetIsConfirmOnline(state),
        isGroupAppt: createAppointmentSelectors.selectIsGroupAppt(state),
        setIsGroupAppt: createAppointmentSelectors.selectSetIsGroupAppt(state),
        getCustomerLookup: createAppointmentSelectors.selectGetCustomerLookup(state),
        saveAppointment: createAppointmentSelectors.selectSaveAppointment(state),
        error: createAppointmentSelectors.selectError(state),
        reset: createAppointmentSelectors.selectReset(state)
    })));

    const {getCompanyProfile} = useAppointmentStore(useShallow(
        (state)=>({
            getCompanyProfile: appointmentSelectors.selectGetCompanyProfile(state)
        })
    ));
    useEffect(()=>{
        reset();
        loadCompanyProfile();
        
    },[])

    const loadCompanyProfile = async () => {
        await getCustomerLookup();
        
        if(selectedCustomer == null){
            navigate(ROUTES.SELECT_CUSTOMER as never);
        }
        const profile = await getCompanyProfile();
        if(isSuccess(profile)) {
            let tmplist = listApptType
            tmplist[0].bgColor = profile.value.data.posTheme.miscBackColor
            tmplist[1].bgColor = profile.value.data.posTheme.newCustomerBackColor
            tmplist[2].bgColor = profile.value.data.posTheme.heldOnBackColor
            tmplist[3].bgColor = profile.value.data.posTheme.nonRequestBackColor
            tmplist[4].bgColor = profile.value.data.posTheme.walkinBackColor
            tmplist[5].bgColor = profile.value.data.posTheme.onlineBackColor
            const apptType = listApptType.find((value,index)=>{
                return value.id.trim().toLowerCase() === profile.value.data.appointments.defaultRetentionType.trim().toLowerCase()
            });
            useCreateAppointmentStore.setState({
                listApptType: tmplist,
                selectedApptType: apptType}) 
            // AppointmentSetting.workHour = config.businessHours
            // AppointmentSetting.allowAddEditInPast   = config.appointments.isAllowAppointmentPriorToCurrentDate
        }
        getListItemMenu();
        getListCategories(); 
        
    }
    const customerPicker = async ()=>{
        
        return (
            <TouchableOpacity style={{
               
            }} onPress={
                async () => {
                navigate(ROUTES.SELECT_CUSTOMER as never);
            }}>
                <XInput value={selectedCustomer?.firstName} editable={false} placeholder="Choose Customer" pointerEvents="none"/>
            </TouchableOpacity>
        )
    }
    const dropdownPicker = async () =>{
        const selectedOption:DropdownOption = {label: selectedApptType?.name??"", value: selectedApptType}
      

        return (
            <XDropdown 
            value={selectedOption}
            renderItem={
                (item, isSelected) =>{
                    return <View 
                    style={{
                        borderBottomColor: theme.colors.border,
                        borderBottomWidth:1,
                        paddingVertical: theme.spacing.sm,
                        paddingLeft: theme.spacing.sm, 
                        flexDirection:"row", 
                        alignItems:'center', 
                        justifyContent:"flex-start"}}>
                        <View style={{
                            marginEnd:theme.spacing.sm, 
                            borderRadius:theme.spacing.sm,
                            height:theme.spacing.md, width:theme.spacing.md, 
                            backgroundColor: (item.value as ApptType ).bgColor
                        }}></View>
                        <XText variant="content400">{item.label}</XText>
                    </View>
                }
            }
            
            placeholder="Choose Service" options={listApptType.map((e)=>({label: e.name, value: e}))} onSelect={(value)=>{
                useCreateAppointmentStore.setState({selectedApptType: value.value})

            }} />
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
            <View style={{ height: 1, backgroundColor: theme.colors.border}} />
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
                    onChange={(date)=>{
                        date.setHours(selectedDate.getHours(),selectedDate.getMinutes(),0,0);
                        setSelectedDate(date);
                        
                    }}
                    mode='date'
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
                <XDatePicker mode="time" style={{ width: '40%' }} value={selectedDate} onChange={
                    (date)=>{
                        date.setDate(selectedDate.getDate());
                        setSelectedDate(date);
                    }
                } />
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
    let [serviceIndex, setServiceIndex] = useState(0);
    /**
     * Nếu index là phần tử cuối cùng (length-1), thêm newItem vào vị trí áp chót.
     * Ngược lại, cập nhật phần tử ở index thành newItem.
     * @param {Array} arr - Mảng gốc
     * @param {number} index - Vị trí index
     * @param {*} newItem - Phần tử mới hoặc giá trị cập nhật
     * @returns {Array} - Mảng mới đã được cập nhật hoặc chèn phần tử
     */
    const updateOrInsertPenultimate = (arr: ServicesEntity[], index:number, e: MenuItemEntity|EmployeeEntity):ServicesEntity[] => {
        if (index === arr.length - 1) {

            const newItem = isEmployee(e) 
                ? {service: null, technician: e} 
                : {service: e, technician: null}
            // Thêm vào áp chót
            if (arr.length < 1) return [newItem];
            if (arr.length === 1) return [newItem, ...arr];
            return [
                ...arr.slice(0, arr.length - 1),
                newItem,
                arr[arr.length - 1]
            ];
        } else {
            const newItem = isEmployee(e) 
                ? {service: arr[index].service, technician: e} 
                : {service: e, technician: arr[index].technician}
            // Cập nhật phần tử ở index
            return arr.map((item, i) => (i === index ? newItem : item));
        }
    }    

    const handleSelectItemMenu = (e: MenuItemEntity) => {
        setShowServiceSheet(false);
        const newList = updateOrInsertPenultimate(listServices, serviceIndex, e)
        useCreateAppointmentStore.setState({listBookingServices: newList})
    }

    const handleSelectEmployee = (e: EmployeeEntity) => {
        setIsShowTechnician(false);
        const newList = updateOrInsertPenultimate(listServices, serviceIndex, e)
        useCreateAppointmentStore.setState({listBookingServices: newList})
    }
    const [isShowTechnician, setIsShowTechnician] = useState(false);
    const technicianPicker = ()=>{
        return (
            <XBottomSheetSearch
                visible={isShowTechnician}
                onClose={() => {
                    setIsShowTechnician(false);
                }}
                data={employees}
                onSelect={(item) => {
                    handleSelectEmployee(item);
                }}
                placeholder="Search..."
                title="Technician "
            /> 
        )
    }
    const listServiceComponent = () =>{
        return listServices.map((e, index)=>{
            return <View
            key={index}
            style={{
                gap: theme.spacing.sm
            }}>
                <TouchableOpacity  onPress={
                    async () => {
                    setServiceIndex(index)
                    setShowServiceSheet(true)
                    
                }}>
                    <XInput value={e?.service?.name} editable={false} 
                        placeholder="Add Service" pointerEvents="none" 
                        iconRight= {e.service ? "closeCircle" : "addCircle"}
                        onIconRightPress={()=>{
                            if(e.service) {
                                useCreateAppointmentStore.setState({
                                    listBookingServices: listServices.filter((item, i) => i !== index)
                                })
                            } else {
                                setServiceIndex(index)
                                setShowServiceSheet(true)
                            }
                        }}
                    />
                </TouchableOpacity>
                
                {
                    e.service && <TouchableOpacity onPress={
                        async () => {
                        setServiceIndex(index)
                        setIsShowTechnician(true);
                        
                    }}>
                        <XInput value={ e.technician ? getDisplayName(e.technician) : ""} 
                            editable={false} placeholder="Choose Technician" pointerEvents="none"/>
                    </TouchableOpacity>
                }
            </View>
        })
    }
    
    
    return (
        <XScreen 
            title="Booking Appointment" 
            loading = {isLoading} 
            error={error}
            scrollable={true}
            footer={<XButton title="Save" onPress={
                async () => {
                   
                    const result = await saveAppointment();
                    
                }
            } />}
            >    
            <View style={{ gap: theme.spacing.md, paddingTop: theme.spacing.md, flex: 1 }}>
                
                
                {customerPicker()}
                {dropdownPicker()}
                {confirmOnlineToggle()}
                {groupApptToggle()}
                {divider()}
                {datePicker()}
                {timePicker()}
                {divider()}
                {menuText()}
                {listServiceComponent()}
            </View>
        
            <SelectServiceScreen
                visible={showServiceSheet}
                onClose={() => setShowServiceSheet(false)}
                onSelect={(service) => {
                   handleSelectItemMenu(service);
                }}
            />
            {technicianPicker()}
            
        </XScreen>
    )
}   

