import XScreen from "../../../shared/components/XScreen";
import XText from "../../../shared/components/XText";
import XBottomSheetSearch from "../../../shared/components/XBottomSheetSearch";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, useWindowDimensions, View } from "react-native";
import XInput from "../../../shared/components/XInput";
import { TicketState, useTicketStore } from "../stores/ticketStore";
import { useShallow } from "zustand/react/shallow";
import { EmployeeEntity, getDisplayName, WorkOrderEntity } from "../types/TicketResponse";
import { useTheme } from "../../../shared/theme/ThemeProvider";
import { useEmployeeStore, employeeSelectors, ALL_EMPLOYEES_OPTION } from '@/shared/stores/employeeStore';
import XNoDataView from "@/shared/components/XNoDataView";
import XDateRangerSearch from "@/shared/components/XDateRangerSearch";
import { appConfig } from "@/shared/utils/appConfig";
import TicketSkeleton from '../components/TicketSkeleton';
import WebView from "react-native-webview";

export default function  TicketScreen() {
  const theme = useTheme();

  const style = useMemo(
    ()=> StyleSheet.create({
      container: { 
        flexDirection: 'column', 
        paddingTop: theme.spacing.md, 
        borderBottomWidth: 1, 
        borderBottomColor: theme.colors.border, 
        paddingBottom: theme.spacing.md,
      }
    }),[]
  ) 
  const {
    json, isLoading, error, visible, 
    startDate, endDate, selectedEmployee,htmlContent,
  } = useTicketStore(useShallow(
      (state: TicketState) => ({
          json: state.json,
          htmlContent: state.htmlContent,
          isLoading: state.isLoading,
          error: state.error,
          visible: state.visible,
          startDate: state.startDate,
          endDate: state.endDate,
          selectedEmployee: state.selectedEmployee,
          workOrderOwners: state.workOrderOwners,
          workOrders: state.workOrders
      })
  ));

  const {
    getWorkOrders, setSelectedEmployee,
    setStartDate, setEndDate, reset,
    setVisible
  } = useTicketStore(useShallow(
    (state: TicketState) => ({

      getWorkOrders: state.getWorkOrders,
      setStartDate: state.setStartDate,
      setEndDate: state.setEndDate,
      setSelectedEmployee: state.setSelectedEmployee,
      reset: state.reset,
      setVisible: state.setVisible
    })
  ));
  // Dùng EmployeeStore dùng chung
  const employees = useEmployeeStore(employeeSelectors.selectEmployees);

  const employeeAll: EmployeeEntity[] = useMemo(
    () => [ALL_EMPLOYEES_OPTION, ...employees]
    ,[employees]
  )

  const fetchEmployees = useEmployeeStore(employeeSelectors.selectFetchEmployees);
    
  useEffect( () => {
    reset();
  }, []);
  
  const onEmployeePickerClick = useCallback( async ()=>{
    await fetchEmployees()
    setVisible(true)
  },[fetchEmployees, setVisible])
  const employeePicker = useMemo(
    ()=><TouchableOpacity 
        style={{marginBottom: theme.spacing.md}} 
        onPress={onEmployeePickerClick}>
        <XInput 
          value={getDisplayName(selectedEmployee)} 
          editable={false} placeholder="Choose Technician"  
          label="Technician" pointerEvents="none"/>
    </TouchableOpacity>,
    [theme,selectedEmployee,onEmployeePickerClick]
  )
  
  return (
    <XScreen title="Tickets" loading={false} error={error} style={{ flex: 1 }}> 
      {/* Search box */}
      <View style={style.container}>
        {json?.isOwner && employeePicker}
        <XDateRangerSearch
          fromDate={startDate}
          toDate={endDate}
          onFromChange={setStartDate}
          onToChange={setEndDate}
          onSearch={getWorkOrders}
        />
      </View>
      {/*End Search box */}
      {
        isLoading ? 
        <TicketSkeleton />:
        (htmlContent.length>0 && !htmlContent.includes("No Tickets") ? <WebView source={{ html: htmlContent }}/>:<XNoDataView />)
      }

      <XBottomSheetSearch
        visible={visible}
        onClose={() => setVisible(false)}
        data={employeeAll}
        onSelect={setSelectedEmployee}
        placeholder="Search..."
        title="Technician "
      /> 
    </XScreen>
  );
};

