import XScreen from "../../../shared/components/XScreen";
import XText from "../../../shared/components/XText";
import XBottomSheetSearch from "../../../shared/components/XBottomSheetSearch";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, useWindowDimensions, View } from "react-native";
import XInput from "../../../shared/components/XInput";
import { TicketState, useTicketStore } from "../stores/ticketStore";
import { useShallow } from "zustand/react/shallow";
import { getDisplayName, WorkOrderEntity } from "../types/TicketResponse";
import { useTheme } from "../../../shared/theme/ThemeProvider";
import { useEmployeeStore, employeeSelectors } from '@/shared/stores/employeeStore';
import XNoDataView from "@/shared/components/XNoDataView";
import XRenderHTML from "@/shared/components/XRenderHTML";
import XDateRangerSearch from "@/shared/components/XDateRangerSearch";
import { appConfig } from "@/shared/utils/appConfig";
import { WebView } from "react-native-webview";
import { XSkeleton } from '../../../shared/components/XSkeleton';

export default function  TicketScreen() {
  const {width} = useWindowDimensions();
  const theme = useTheme();

  const [isFirstLoad, setIsFirstLoad] = useState(true);
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
    
  useEffect(() => {
    useTicketStore.getState().reset();
    appConfig.getUser().then((user) => {
      setJson(user);
    });
  }, []);
  const Dashed = () => (
    <View
      style={{
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: theme.colors.gray600,
        borderStyle: 'dashed',
        marginVertical: 16,
        width: '100%',
        // height: 1,
      }}
    />
  );

  // Hàm renderItem nhận đầu vào là html
  const renderItem =  ({ item }: { item: WorkOrderEntity }) =>
    {
      

      const view = <View 
      style={{backgroundColor: theme.colors.white, 
      padding: theme.spacing.md, borderRadius: theme.spacing.md, ...theme.shadows.sm}}>
        <XText variant="contentTitle">{(item.detail as any).title}</XText>
        <XText variant="content400">{item.detail.time}</XText>
        <Dashed />
        <View style={{flexDirection: 'column', justifyContent: 'space-between'}}>
          {item.detail.services.map((service: any) => (
            <View key={service.id} style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <XText numberOfLines={2} variant="content400" style={{width: '80%'}}>{service.name}</XText>
              <XText numberOfLines={1} variant="content400">{service.columnRight}</XText>
            </View>
          ))}
        </View>
        <Dashed />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <XText variant="content300">Service Deductions</XText>
          <XText variant="content300">{item.detail.ServiceDeductions}</XText>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <XText variant="content300">Non Cash Tip</XText>
          <XText variant="content300">{item.detail.NonCashTip}</XText>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <XText variant="content300">Total</XText>
          <XText variant="content300">{item.detail.Total}</XText>
        </View>
      </View>
      return (view) 
      
    } ;

// TicketSkeleton component
const TicketSkeleton = () => {
  const theme = useTheme();
  return (
    <View style={{ padding: 16 }}>
      {[...Array(5)].map((_, idx) => (
        <View key={idx} style={{ marginBottom: 16, backgroundColor: theme.colors.white, borderRadius: theme.spacing.md, ...theme.shadows.sm, padding: theme.spacing.md }}>
          <XSkeleton width={120} height={18} style={{ marginBottom: 8 }} />
          <XSkeleton width={80} height={14} style={{ marginBottom: 8 }} />
          <XSkeleton width={'100%'} height={1} style={{ marginBottom: 8 }} />
          <XSkeleton width={180} height={14} style={{ marginBottom: 8 }} />
          <XSkeleton width={'100%'} height={1} style={{ marginBottom: 8 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <XSkeleton width={100} height={12} />
            <XSkeleton width={60} height={12} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <XSkeleton width={100} height={12} />
            <XSkeleton width={60} height={12} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <XSkeleton width={100} height={12} />
            <XSkeleton width={60} height={12} />
          </View>
        </View>
      ))}
    </View>
  );
};
  return (
    <XScreen title="Tickets" loading={false} error={error} style={{ flex: 1 }}> 
      {/* View header */}
      <View style={{ flexDirection: 'column', paddingTop: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: theme.spacing.sm,}}>
      {json?.isOwner ? 
        <TouchableOpacity style={{marginBottom: theme.spacing.md}} onPress={async () => {
          useTicketStore.setState({visible: true});
          await fetchEmployees();
        }}>
          <XInput value={selectedEmployee != null ? getDisplayName(selectedEmployee) : ""} editable={false} placeholder="Choose Technician"  label="Technician" pointerEvents="none"/>
        </TouchableOpacity>:null}
        

        <XDateRangerSearch
          fromDate={startDate}
          toDate={endDate}
          onFromChange={(date) => useTicketStore.setState({startDate: date})}
          onToChange={(date) => useTicketStore.setState({endDate: date})}
          onSearch={() => {
            setIsFirstLoad(false);
            if(json?.isOwner){
              getWorkOrderOwners(selectedEmployee?.id??"");
            }else{
              getWorkOrders();
            }
          }}
        />
      </View>
      {isLoading ? (
        <TicketSkeleton />
      ) : (
        <FlatList
          data={json?.isOwner ? workOrderOwners : workOrders}
          keyExtractor={(item, idx) => item.ticketNumber?.toString()+ idx.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, gap: 16 }}
          ListEmptyComponent={isFirstLoad ? null : <XNoDataView />}
        />
      )}
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
    </XScreen>
  );
};

