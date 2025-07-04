import XScreen from "../../../shared/components/XScreen";
import XText from "../../../shared/components/XText";
import XBottomSheetSearch from "../../../shared/components/XBottomSheetSearch";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import XInput from "../../../shared/components/XInput";
import { ticketSelectors, TicketState, useTicketStore } from "../stores/ticketStore";
import { useShallow } from "zustand/react/shallow";
import { getDisplayName } from "../types/TicketResponse";

export default function  TicketScreen() {
 
    const {isLoading, employeeLookup, getEmployeeLookup, error, visible} = useTicketStore(useShallow(
        (state: TicketState) => ({
            isLoading: ticketSelectors.selectIsLoading(state),
            employeeLookup: ticketSelectors.selectEmployeeLookup(state),
            getEmployeeLookup: ticketSelectors.selectGetEmployeeLookup(state),
            error: ticketSelectors.selectError(state),
            visible: ticketSelectors.selectVisible(state),
        })
    ));
  
   
  return (
    <XScreen loading={isLoading} error={error} style={{ flex: 1 ,  }}> 
      <TouchableOpacity onPress={async () => {
        useTicketStore.setState({visible: true});
        await getEmployeeLookup();
        
      }}>
        <XInput editable={false} placeholder="Choose Technician"  label="Technician" pointerEvents="none"/>
      </TouchableOpacity>
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
    </XScreen>
  );
};