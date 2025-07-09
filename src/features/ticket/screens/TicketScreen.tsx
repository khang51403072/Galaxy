import XScreen from "../../../shared/components/XScreen";
import XText from "../../../shared/components/XText";
import XBottomSheetSearch from "../../../shared/components/XBottomSheetSearch";
import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, useWindowDimensions, View } from "react-native";
import XInput from "../../../shared/components/XInput";
import { ticketSelectors, TicketState, useTicketStore } from "../stores/ticketStore";
import { useShallow } from "zustand/react/shallow";
import { getDisplayName } from "../types/TicketResponse";
import XDatePicker from "../../../shared/components/XDatePicker";
import WebView from "react-native-webview";
import XIcon from "../../../shared/components/XIcon";
import { useTheme } from "../../../shared/theme/ThemeProvider";

export default function  TicketScreen() {
    const {width} = useWindowDimensions();
    const theme = useTheme();
    const {json,isLoading, employeeLookup, getEmployeeLookup, error, visible, getWorkOrders, getWorkOrderOwners, workOrderOwners, workOrders, startDate, endDate, selectedEmployee} = useTicketStore(useShallow(
        (state: TicketState) => ({
            json: state.json,
            getWorkOrderOwners: state.getWorkOrderOwners,
            getEmployeeLookup: state.getEmployeeLookup,
            getWorkOrders: state.getWorkOrders,
            isLoading: state.isLoading,
            error: state.error,
            visible: state.visible,
            startDate: state.startDate,
            endDate: state.endDate,
            selectedEmployee: state.selectedEmployee,
            workOrderOwners: state.workOrderOwners,
            workOrders: state.workOrders,
            employeeLookup: state.employeeLookup,
        })
    ));
    
    useEffect(() => {
      return () => {
        useTicketStore.getState().reset();
      };
    }, []);

  return (
    <XScreen title="Tickets" loading={isLoading} error={error} style={{ flex: 1 }}> 
      {/* View header */}
      <View style={{ flexDirection: 'column', paddingTop: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: theme.spacing.sm,}}>
      {json?.isOwner ? 
        <TouchableOpacity style={{}} onPress={async () => {
          useTicketStore.setState({visible: true});
          await getEmployeeLookup();
        }}>
          <XInput value={selectedEmployee != null ? getDisplayName(selectedEmployee) : ""} editable={false} placeholder="Choose Technician"  label="Technician" pointerEvents="none"/>
        </TouchableOpacity>:null}
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-end' }}>
          <XDatePicker
            label="Date"
            value={startDate ?? new Date()}
            onChange={(date) => useTicketStore.setState({startDate: date})}
            placeholder="Chọn ngày sinh"
            minimumDate={new Date(1900, 0, 1)}
            maximumDate={new Date()}
            style={{ flex: 1 }}
          />
          <XDatePicker
            label="Date"
            value={endDate ?? new Date()}
            onChange={(date) => useTicketStore.setState({endDate: date})}
            placeholder="Chọn ngày sinh"
            minimumDate={new Date(1900, 0, 1)}
            maximumDate={new Date()}
            style={{ flex: 1 }}
          />
          <TouchableOpacity
            style={{
              height: 48,
              width: 48,
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
        data={employeeLookup}
        onSelect={(item) => {
          useTicketStore.setState({selectedEmployee: item});
        }}
        placeholder="Search..."
        title="Technician "
      /> 

      {!visible && 
      
      workOrders.length == 0 && workOrderOwners.length == 0 ? 
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: theme.spacing.xxxl }}>
        <XIcon name="noData" width={48} height={48} />
        <XText variant="content400">No data</XText>
      </View>
      :
      <FlatList
        data={json?.isOwner ? workOrderOwners : workOrders}
        keyExtractor={(item, idx) => item.ticketNumber?.toString() || idx.toString()}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 8, backgroundColor: '#fff', borderRadius: 8, padding: 8, overflow: 'hidden', ...theme.shadows.sm }}>
            <WebView
              originWhitelist={['*']}
              source={{ html: item.detail }}
              style={{ width: '100%', height: 150 }} 
              scrollEnabled={false}
            />
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
      }
    </XScreen>
  );
};