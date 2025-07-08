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
    const {isLoading, employeeLookup, getEmployeeLookup, error, visible, getWorkOrders, getWorkOrderOwners, workOrderOwners, startDate, endDate, selectedEmployee} = useTicketStore(useShallow(
        (state: TicketState) => ({
            workOrders: ticketSelectors.selectWorkOrders(state),
            workOrderOwners: ticketSelectors.selectWorkOrderOwners(state),
            isLoading: ticketSelectors.selectIsLoading(state),
            employeeLookup: ticketSelectors.selectEmployeeLookup(state),
            getEmployeeLookup: ticketSelectors.selectGetEmployeeLookup(state),
            getWorkOrders: ticketSelectors.selectGetWorkOrders(state),
            error: ticketSelectors.selectError(state),
            visible: ticketSelectors.selectVisible(state),
            startDate: ticketSelectors.selectStartDate(state),
            endDate: ticketSelectors.selectEndDate(state),
            selectedEmployee: ticketSelectors.selectSelectedEmployee(state),
            getWorkOrderOwners: ticketSelectors.selectGetWorkOrderOwners(state),
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
        <TouchableOpacity style={{}} onPress={async () => {
          useTicketStore.setState({visible: true});
          await getEmployeeLookup();
    
        }}>
          <XInput value={selectedEmployee != null ? getDisplayName(selectedEmployee) : ""} editable={false} placeholder="Choose Technician"  label="Technician" pointerEvents="none"/>
        </TouchableOpacity>
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
              await getWorkOrderOwners(startDate, endDate, selectedEmployee?.id);
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

      {!visible && <FlatList
        data={workOrderOwners}
        keyExtractor={(item, idx) => item.ticketNumber?.toString() || idx.toString()}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 8, backgroundColor: '#fff', borderRadius: 8, padding: 8, overflow: 'hidden' }}>
            <WebView
              originWhitelist={['*']}
              source={{ html: item.detail }}
              style={{ width: '100%', height: 150 }} 
              scrollEnabled={false}
            />
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />}
    </XScreen>
  );
};