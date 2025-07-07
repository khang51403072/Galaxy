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
import RenderHTML from "react-native-render-html";

export default function  TicketScreen() {
    const {width} = useWindowDimensions();
    const {isLoading, employeeLookup, getEmployeeLookup, error, visible, getWorkOrders, workOrders} = useTicketStore(useShallow(
        (state: TicketState) => ({
            workOrders: ticketSelectors.selectWorkOrders(state),
            workOrderOwners: ticketSelectors.selectWorkOrderOwners(state),
            isLoading: ticketSelectors.selectIsLoading(state),
            employeeLookup: ticketSelectors.selectEmployeeLookup(state),
            getEmployeeLookup: ticketSelectors.selectGetEmployeeLookup(state),
            getWorkOrders: ticketSelectors.selectGetWorkOrders(state),
            error: ticketSelectors.selectError(state),
            visible: ticketSelectors.selectVisible(state),
        })
    ));
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
   
  return (
    <XScreen title="Tickets" loading={isLoading} error={error} style={{ flex: 1 ,  }}> 
      <TouchableOpacity onPress={async () => {
        useTicketStore.setState({visible: true});
        await getEmployeeLookup();
        await getWorkOrders();
      }}>
        <XInput editable={false} placeholder="Choose Technician"  label="Technician" pointerEvents="none"/>
      </TouchableOpacity>
      <View style={{flexDirection: 'row', gap: 16}}>
        <XDatePicker
          label="Date"
          value={selectedDate??new Date()}
          onChange={setSelectedDate}
          placeholder="Chọn ngày sinh"
          minimumDate={new Date(1900, 0, 1)}
          maximumDate={new Date()}
          style={{flex: 1}}
        />
        <XDatePicker
          label="Date"
          value={selectedDate??new Date()}
          onChange={setSelectedDate}
          placeholder="Chọn ngày sinh"
          minimumDate={new Date(1900, 0, 1)}
          maximumDate={new Date()}
          style={{flex: 1}}
        />
      </View>

      <XBottomSheetSearch
        
        visible={visible}
        onClose={() => {
          useTicketStore.setState({visible: false});
          console.log('onClose');
        }}
        data={employeeLookup.map((item) => getDisplayName(item))}
        onSelect={(item) => console.log('Selected:', item)}
        placeholder="Search..."
        title="Technician "
      /> 

      //tạo 1 flatlist với data là workOrders
      <FlatList
      data={workOrders}
      keyExtractor={(item, idx) => item.ticketNumber?.toString() || idx.toString()}
      renderItem={({ item }) => (
        <View style={{ marginVertical: 8, backgroundColor: '#fff', borderRadius: 8, padding: 8 }}>
          <RenderHTML
            contentWidth={width - 32}
            source={{ html: item.detail }}
          />
        </View>
      )}
      contentContainerStyle={{ padding: 16 }}
    />
    </XScreen>
  );
};