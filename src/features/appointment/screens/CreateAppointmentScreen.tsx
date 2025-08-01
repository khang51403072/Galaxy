import { XDatePicker } from "@/shared/components/XDatePicker";
import XDropdown, { DropdownOption } from "@/shared/components/XDropdown";
import XIcon from "@/shared/components/XIcon";
import XInput from "@/shared/components/XInput";
import XScreen from "@/shared/components/XScreen";
import XSwitch from "@/shared/components/XSwitch";
import XText from "@/shared/components/XText";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { BackHandler, FlatList, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { createAppointmentSelectors, BookingServiceEntity, useCreateAppointmentStore } from "../stores/createAppointmentStore";
import { useShallow } from "zustand/react/shallow";
import { RootStackParamList, ROUTES } from "@/app/routes";
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
import { useXAlert } from "@/shared/components/XAlertContext";
import { appConfig } from "@/shared/utils/appConfig";
import useSignalR from "@/shared/hooks/useSignalR";
import { DataAppt } from "../types/ApptSaveResponse";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useBackHandler } from "@/shared/hooks/useBackHandler";
import { Permissions } from "@/features/auth/types/AuthTypes";
interface ApptMessage {
    message: string
    date: string
    actionType: string
    apptId: string
    customerId: string
}

function createApptMessage(data: DataAppt): ApptMessage {
    return {
        message: "appointment-booking",
        date: data.apptDate,
        actionType: "save-apt",
        apptId: data.id,
        customerId: data.customer.id
    }
}
// Định nghĩa type cho params

type UpdateBookingParams = {
  arr: BookingServiceEntity[];
  serviceIndex: number;
  e: MenuItemEntity | EmployeeEntity;
  type: 'service' | 'technician';
  comboIndex?: number;
  listItemMenu?: MenuItemEntity[];
};

/**
 * Cập nhật hoặc thêm mới BookingServiceEntity trong danh sách dịch vụ booking.
 *
 * - Nếu type === 'technician':
 *     + Nếu comboIndex được truyền vào: cập nhật technician cho comboItem tại comboIndex trong service cha (serviceIndex).
 *     + Nếu không: cập nhật technician cho service cha tại serviceIndex.
 * - Nếu type === 'service':
 *     + Nếu là service dạng combo (ServicePackage): sinh comboItems từ listItemMenu dựa trên servicePackageMaps (tối ưu hiệu năng với Set).
 *     + Nếu serviceIndex là cuối cùng: thêm newItem vào áp chót.
 *     + Nếu không: cập nhật newItem tại serviceIndex.
 *
 * @param params - Đối tượng chứa các tham số cập nhật
 * @returns Mảng BookingServiceEntity mới đã được cập nhật
 */
const updateBookingServices = ({
  arr,
  serviceIndex,
  e,
  type,
  comboIndex,
  listItemMenu = [],
}: UpdateBookingParams): BookingServiceEntity[] => {
  if (type === 'technician') {
    return arr.map((item, i) => {
      if (i !== serviceIndex) return item;
      if (comboIndex !== undefined && item.comboItems) {
        return {
          ...item,
          comboItems: item.comboItems.map((combo, j) =>
            j === comboIndex ? { ...combo, technician: e as EmployeeEntity } : combo
          ),
        };
      }
      return { ...item, technician: e as EmployeeEntity };
    });
  }

  // type === 'service'
  const service = e as MenuItemEntity;
  const technician = arr[serviceIndex]?.technician;
  let comboItems: BookingServiceEntity[] = [];
  if (service.menuItemType === 'ServicePackage') {
    const mapIds = new Set(service.servicePackageMaps.map(map => map.mapMenuItemId));
    comboItems = listItemMenu
      .filter(item => mapIds.has(item.id))
      .map(item => ({
        service: item,
        technician: null,
      }));
  }
  const newItem: BookingServiceEntity = { service, technician, comboItems };

  if (serviceIndex === arr.length - 1) {
    return [
      ...arr.slice(0, arr.length - 1),
      newItem,
      arr[arr.length - 1],
    ];
  }
  return arr.map((item, i) => (i === serviceIndex ? newItem : item));
};


export default function CreateAppointmentScreen() {
    const route = useRoute<RouteProp<RootStackParamList, 'CreateAppointment'>>();
  
    // Lấy tham số
    const { apptId } = route.params || {};
    
  
    const theme = useTheme();
    const {showAlert} = useXAlert();
    
    const {sendMessage} = useSignalR();
    
    // Tách actions ra riêng
    const { 
        setSelectedApptType, 
        setShowServiceSheet, 
        setIsShowTechnician, 
        setServiceIndex, 
        setComboIndex,
        setSelectedDate,
        setIsConfirmOnline,
        setIsGroupAppt,
        setEmployeeForAvailable,
        reset,
        saveAppointment,
        initData,
    } = useCreateAppointmentStore(
        useShallow((state) => ({
            setSelectedApptType: createAppointmentSelectors.selectSetSelectedApptType(state),
            setShowServiceSheet: createAppointmentSelectors.selectSetShowServiceSheet(state),
            setIsShowTechnician: createAppointmentSelectors.selectSetIsShowTechnician(state),
            setServiceIndex: createAppointmentSelectors.selectSetServiceIndex(state),
            setComboIndex: createAppointmentSelectors.selectSetComboIndex(state),
            setSelectedDate: createAppointmentSelectors.selectSetSelectedDate(state),
            setIsConfirmOnline: createAppointmentSelectors.selectSetIsConfirmOnline(state),
            setIsGroupAppt: createAppointmentSelectors.selectSetIsGroupAppt(state),
            setEmployeeForAvailable: createAppointmentSelectors.selectSetEmployeeForAvailable(state),
            reset: createAppointmentSelectors.selectReset(state),
            getApptDetails: createAppointmentSelectors.selectGetApptDetails(state),
            getCustomerLookup: createAppointmentSelectors.selectGetCustomerLookup(state),
            getApptResource: createAppointmentSelectors.selectGetApptResource(state),
            getListItemMenu: createAppointmentSelectors.selectGetListItemMenu(state),
            getListCategories: createAppointmentSelectors.selectGetListCategories(state),
            saveAppointment: createAppointmentSelectors.selectSaveAppointment(state),
            initData: createAppointmentSelectors.selectInitData(state),
        }))
    );
    const {
        
    } = useCreateAppointmentStore(useShallow((state) => ({
        
    })));

    const {
         selectedCustomer,selectedApptType,listApptType, 
          listCategories,
        listItemMenu,isLoading, listServices,selectedDate,
        isConfirmOnline,
        isGroupAppt, 
        
     
        error,
        listEmployeeOnWork,
      
        
        apptDetails,
        showServiceSheet,
        employeeForAvailable,
        serviceIndex,
        comboIndex,
        isShowTechnician
    } = useCreateAppointmentStore(useShallow((state) => ({
        listEmployeeOnWork: createAppointmentSelectors.selectListEmployeeOnWork(state),
        selectedCustomer: createAppointmentSelectors.selectSelectedCustomer(state),
        selectedApptType: createAppointmentSelectors.selectSelectedApptType(state),
        listApptType: createAppointmentSelectors.selectListApptType(state),
        listCategories: createAppointmentSelectors.selectListCategories(state),
        listItemMenu: createAppointmentSelectors.selectListItemMenu(state),
        isLoading: createAppointmentSelectors.selectIsLoading(state),
        listServices: createAppointmentSelectors.selectListService(state),
        selectedDate: createAppointmentSelectors.selectSelectedDate(state),
        isConfirmOnline: createAppointmentSelectors.selectIsConfirmOnline(state),
        isGroupAppt: createAppointmentSelectors.selectIsGroupAppt(state),
        error: createAppointmentSelectors.selectError(state),
        apptDetails: createAppointmentSelectors.selectApptDetails(state),
        showServiceSheet: createAppointmentSelectors.selectShowServiceSheet(state),
        employeeForAvailable: createAppointmentSelectors.selectEmployeeForAvailable(state),
        serviceIndex: createAppointmentSelectors.selectServiceIndex(state),
        comboIndex: createAppointmentSelectors.selectComboIndex(state),
        isShowTechnician: createAppointmentSelectors.selectIsShowTechnician(state)
    })));

    const {getCompanyProfile, getAppointmentList, json} = useAppointmentStore(useShallow(
        (state)=>({
            getCompanyProfile: appointmentSelectors.selectGetCompanyProfile(state),
            getAppointmentList: appointmentSelectors.selectGetAppointmentList(state),
            json: appointmentSelectors.selectJson(state)
        })
    ));
    const navigation = useNavigation();
    // Sử dụng custom hook để handle back events
    useBackHandler(navigation, () => {
        reset();
        console.log('back handler');
    });
    const dropdownOptions = useMemo(() => 
        listApptType.map((e) => ({label: e.name, value: e})), 
        [listApptType]
    );
    useEffect(()=>{
        loadCompanyProfile();
    },[])

    const loadCompanyProfile = async () => {
        await initData(apptId);
     
        if(selectedCustomer == null && !apptId){
            navigate(ROUTES.SELECT_CUSTOMER as never);
        }
       
    }
    const customerPicker = ()=>{
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
    const handleApptTypeSelect = useCallback((value: DropdownOption ) => {
        setSelectedApptType(value)
    }, [setSelectedApptType]);


    const MemoizedDropdown = useMemo(() =>{
        return (
            <XDropdown 
            value={selectedApptType}
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
            
            placeholder="Choose Service" options={dropdownOptions} 
            onSelect={handleApptTypeSelect} />
        )
            
    }, [selectedApptType, dropdownOptions, handleApptTypeSelect, theme]);
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
    const  divider = <View style={{ height: 1, backgroundColor: theme.colors.border}} />

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
                        date.setMonth(selectedDate.getMonth());
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
  
    const handleSelectItemMenu = (e: MenuItemEntity) => {
        setShowServiceSheet(false);
        const newList = updateBookingServices({
            arr: listServices,
            serviceIndex: serviceIndex,
            e: e,
            type: 'service',
            listItemMenu: listItemMenu
        });
        useCreateAppointmentStore.setState({listBookingServices: newList})
    }

    const handleSelectEmployee = (e: EmployeeEntity) => {
        setIsShowTechnician(false);
        const newList = updateBookingServices({
            arr: listServices,
            serviceIndex: serviceIndex,
            e: e,
            type: 'technician',
            listItemMenu: listItemMenu
        });
        useCreateAppointmentStore.setState({listBookingServices: newList})
    }

    const handleSelectEmployeeCombo = (e: EmployeeEntity) => {
        setIsShowTechnician(false);
        const newList = updateBookingServices({
            arr: listServices,
            serviceIndex: serviceIndex,
            e: e,
            type: 'technician',
            listItemMenu: listItemMenu,
            comboIndex: comboIndex
        });
        setComboIndex(-1);
        useCreateAppointmentStore.setState({listBookingServices: newList})
    }
    const technicianPicker = ()=>{
        return (
            <XBottomSheetSearch
                visible={isShowTechnician}
                onClose={() => {
                    setIsShowTechnician(false);
                }}
                data={employeeForAvailable}
                onSelect={(item) => {
                    if(comboIndex == -1){
                        handleSelectEmployee(item);
                    } else {
                        handleSelectEmployeeCombo(item);
                    }
                }}
                placeholder="Search..."
                title="Technician "
            /> 
        )
    }


    const renderService = (e: BookingServiceEntity, index: number) =>{
        if(e?.service?.menuItemType == 'ServicePackage'){
            return (
                <View style={{
                    flexDirection: 'column', alignItems: 'flex-start', 
                    justifyContent: 'flex-start', gap: 10}}>
                    <TouchableOpacity 
                        onPress={
                            async () => {
                            setServiceIndex(index)
                            setShowServiceSheet(true)
                        }}
                        style={{
                            width: '100%',
                        }}
                    >
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
                        {e.comboItems?.map(
                            (item, comboIndex)=>{
                                return (
                                    <View
                                    key={item.service?.id}
                                    style={{
                                        
                                        flexDirection: 'column', alignItems: 'flex-start',
                                        paddingLeft: theme.spacing.lg,
                                        width: '100%',
                                        justifyContent: 'flex-start', gap: 10}}>
                                        <XInput value={item?.service?.name} editable={false} 
                                            placeholder="Add Service" pointerEvents="none" 
                                        />
                                        <TouchableOpacity 
                                        style={{
                                            width: '100%',
                                        }}
                                        onPress={
                                            async () => {
                                                setServiceIndex(serviceIndex)
                                                setComboIndex(comboIndex)
                                                const setEmployee = new Set(item.service?.allowedEmployees);
                                                const listEmployee = listEmployeeOnWork.filter((employee)=>{
                                                    return setEmployee.has(employee.id)
                                                });
                                                setEmployeeForAvailable(listEmployee);
                                                setIsShowTechnician(true);
                                        }}>
                                        <XInput value={ item.technician ? getDisplayName(item.technician) : ""} 
                                            editable={false} placeholder="Choose Technician" pointerEvents="none"/>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    )}
                </View>
                
            )
        }

        return (
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
        )
            
                    
    }
    const listServiceComponent = () =>{
        return listServices.map((e, index)=>{
            return <View
                key={index}
                style={{
                    gap: theme.spacing.sm
                }}>
                    {renderService(e, index)}
                    {
                        e.service && e.service?.menuItemType !== "ServicePackage" && <TouchableOpacity onPress={
                            async () => {
                            setServiceIndex(index)
                            setComboIndex(-1);
                            const setEmployee = new Set(e.service?.allowedEmployees);
                            const listEmployee = listEmployeeOnWork.filter((item)=>{
                                return setEmployee.has(item.id)
                            });
                            setEmployeeForAvailable(listEmployee);
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
        <>
        
        <XScreen 
            title="Booking Appointment" 
            loading = {isLoading} 
            error={error}
            scrollable={true}
            // onBackPress={() => {
            //     reset();
            //     goBack();
            // }}
            footer={<XButton title="Save" onPress={
                async () => {
                    
                    const result = await saveAppointment();
                    if(isSuccess(result)){  
                        sendMessage([
                            {
                                type: "SendMessage",
                                data: createApptMessage(result.value)
                            }
                        ]);
                        
                        showAlert({
                            title: "Successfully",
                            message: "Appointment created successfully",
                            type: "success",
                            onClose: async () => {
                                goBack();
                                const json = await appConfig.getUser()
                                getAppointmentList(json)
                            }
                        });
                    }
                }
            } />}
            >   
            <DisableMaskAdvanced 
            children={
                <View style={{ gap: theme.spacing.md, paddingTop: theme.spacing.md, flex: 1 }}>
                {customerPicker()}
                {MemoizedDropdown}
                {confirmOnlineToggle()}
                {groupApptToggle()}
                {divider}
                {datePicker()}
                {timePicker()}
                {divider}
                {menuText()}
                {listServiceComponent()}
            </View> 
             }
            enabled={json?.listRole.includes(Permissions.MOVE_APPOINTMENT)}>
                
            </DisableMaskAdvanced>
            
            
            {/** BottomSheet */}
            <SelectServiceScreen
                visible={showServiceSheet}
                onClose={() => setShowServiceSheet(false)}
                onSelect={(service) => {
                   handleSelectItemMenu(service);
                }}
            />
            {technicianPicker()}
            {/** BottomSheet */}
        </XScreen>
        </>
    )
}   

interface DisableMaskProps {
    enabled?: boolean;
    children: React.ReactNode;
  }
const DisableMaskAdvanced: React.FC<DisableMaskProps> = ({ enabled = true, children }) => {
    return (
      <View style={styles.container}>
        {children}
        {!enabled && (
          <View 
            style={styles.mask}
            pointerEvents="none" // Cho phép touch events pass through
          />
        )}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      position: 'relative',
    },
    mask: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#FFFFFF1A',
      zIndex: 1000,
      pointerEvents: 'none', // Quan trọng!
    },
  });