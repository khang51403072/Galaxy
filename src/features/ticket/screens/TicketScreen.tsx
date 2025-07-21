import XScreen from "../../../shared/components/XScreen";
import XText from "../../../shared/components/XText";
import XBottomSheetSearch from "../../../shared/components/XBottomSheetSearch";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, useWindowDimensions, View } from "react-native";
import XInput from "../../../shared/components/XInput";
import { ticketSelectors, TicketState, useTicketStore } from "../stores/ticketStore";
import { useShallow } from "zustand/react/shallow";
import { getDisplayName, WorkOrderEntity } from "../types/TicketResponse";
import WebView from "react-native-webview";
import XIcon from "../../../shared/components/XIcon";
import { useTheme } from "../../../shared/theme/ThemeProvider";
import { useEmployeeStore, employeeSelectors } from '@/shared/stores/employeeStore';
import { homeSelectors, useHomeStore } from "@/features/home/stores/homeStore";
import XNoDataView from "@/shared/components/XNoDataView";
import XRenderHTML from "@/shared/components/XRenderHTML";
import { XDateTimePicker } from "@/shared/components/XDatePicker";

export default function  TicketScreen() {
  const {width} = useWindowDimensions();
  const theme = useTheme();
  const jsonHome = useHomeStore(homeSelectors.selectJson);

  const {setJson, json,isLoading, error, visible, getWorkOrders, getWorkOrderOwners, workOrderOwners, workOrders, startDate, endDate, selectedEmployee} = useTicketStore(useShallow(
      (state: TicketState) => ({
          json: state.json,
          getWorkOrderOwners: state.getWorkOrderOwners,
          getWorkOrders: state.getWorkOrders,
          isLoading: state.isLoading,
          error: state.error,
          visible: state.visible,
          startDate: state.startDate,
          endDate: state.endDate,
          selectedEmployee: state.selectedEmployee,
          workOrderOwners: state.workOrderOwners,
          workOrders: state.workOrders,
          setJson: state.setJson
      })
  ));
  // Dùng EmployeeStore dùng chung
  const employees = useEmployeeStore(employeeSelectors.selectEmployees);
  const fetchEmployees = useEmployeeStore(employeeSelectors.selectFetchEmployees);
  const isEmployeeLoading = useEmployeeStore(employeeSelectors.selectIsLoading);
    
  useEffect(() => {
    useTicketStore.getState().reset();
    console.log("json", json)
    if(jsonHome) setJson(jsonHome)
      console.log("jsonHome", jsonHome)
  }, []);
  const dashed = <View
    style={{
      borderBottomWidth: 1,
      borderColor: '#aaa',
      borderStyle: 'dashed',
      marginVertical: 16,
    }}
  />
  const serviceLine = (item: WorkOrderEntity)=>{
    return <View style={{flexDirection: "row", alignItems:'flex-start'}}>
      <XText variant="contentTitle">{item.ticketDate}   </XText>
      <XText variant="contentTitle">{item.ticketDate}   {item.serviceStartTime} - {item.serviceEndTime}</XText>
      <XText variant="contentTitle">{item.ticketDate}   {item.serviceStartTime} - {item.serviceEndTime}</XText>
      
    </View>
  }
  // Hàm renderItem nhận đầu vào là html
  const renderItem = ({ item }: { item: { detail: string } }) => (
    <View style={{ marginVertical: 8, backgroundColor: '#fff', borderRadius: 8, padding: 8, overflow: 'hidden', ...theme.shadows.sm }}>
      <XRenderHTML html={item.detail} width={undefined} />
    </View>
  );
  return (
    <XScreen title="Tickets" loading={isLoading} error={error} style={{ flex: 1 }}> 
      {/* View header */}
      <View style={{ flexDirection: 'column', paddingTop: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: theme.spacing.sm,}}>
      {json?.isOwner ? 
        <TouchableOpacity style={{marginBottom: theme.spacing.md}} onPress={async () => {
          useTicketStore.setState({visible: true});
          await fetchEmployees();
        }}>
          <XInput value={selectedEmployee != null ? getDisplayName(selectedEmployee) : ""} editable={false} placeholder="Choose Technician"  label="Technician" pointerEvents="none"/>
        </TouchableOpacity>:null}
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-end' }}>
          <XDateTimePicker
            // label="Date"
            value={startDate ?? new Date()}
            onChange={(date) => useTicketStore.setState({startDate: date})}
            placeholder="Chọn ngày sinh"
            // minimumDate={new Date(1900, 0, 1)}
            // maximumDate={new Date()}
            style={{ flex: 1 }}
          />
          <XDateTimePicker
            // label="Date"
            mode={'date'}
            value={endDate ?? new Date()}
            onChange={(date) => useTicketStore.setState({endDate: date})}
            placeholder="Chọn ngày sinh"
            // minimumDate={new Date(1900, 0, 1)}
            // maximumDate={new Date()}
            style={{ flex: 1 }}
          />
          <TouchableOpacity
            style={{
              height: 42,
              width: 42,
              borderRadius: 8,
              backgroundColor: '#2563eb',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={ async () => {
              if(json?.isOwner){
                await getWorkOrderOwners(selectedEmployee?.id??"");
              }else{
                await getWorkOrders();
              }
            }} // Định nghĩa hàm onSearch theo nhu cầu
          >
            <XIcon name="search" width={24} height={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      

      <XBottomSheetSearch
        visible={visible}
        onClose={() => {
          useTicketStore.setState({visible: false});
        }}
        data={employees}
        onSelect={(item) => {
          useTicketStore.setState({selectedEmployee: item});
        }}
        placeholder="Search..."
        title="Technician "
      /> 

      {!visible &&
      <FlatList
        data={json?.isOwner ? workOrderOwners : workOrders}
        keyExtractor={(item, idx) => item.ticketNumber?.toString()+ idx.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<XNoDataView />}
      />
      }
    </XScreen>
  );
};