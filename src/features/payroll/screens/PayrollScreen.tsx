import XScreen from "../../../shared/components/XScreen";
import XBottomSheetSearch from "../../../shared/components/XBottomSheetSearch";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from "react-native";
import XInput from "../../../shared/components/XInput";
import { useShallow } from "zustand/react/shallow";
import WebView from "react-native-webview";
import { useTheme } from "../../../shared/theme/ThemeProvider";
import { payrollSelectors, PayrollState, usePayrollStore } from "../stores/payrollStore";
import { getDisplayName } from "../../ticket/types/TicketResponse";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { KeychainObject } from "@/shared/utils/keychainHelper";
import { useEmployeeStore, employeeSelectors } from '@/shared/stores/employeeStore';
import XDateRangerSearch from "@/shared/components/XDateRangerSearch";
import XNoDataView from "@/shared/components/XNoDataView";
import { appConfig } from "@/shared/utils/appConfig";

export default function  TicketScreen() {
    const [json, setJson] = useState<KeychainObject | null>(null);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    useEffect(() => {
      usePayrollStore.getState().reset();
      appConfig.getUser().then((user) => {
        setJson(user);
      });
    }, []);
    const theme = useTheme();
    const styles = StyleSheet.create({
      header: {
        flexDirection: 'column', 
        paddingTop: theme.spacing.md, 
        borderBottomWidth: 1, 
        borderBottomColor: 
        theme.colors.border, 
        paddingBottom: theme.spacing.sm,
        gap: theme.spacing.sm,
      },
    });
   
    const { isLoading, payrolls, payrollOwners, getPayroll, getPayrollOwner, error, visible, selectedEmployee, startDate, endDate } = usePayrollStore(useShallow(
        (state: PayrollState) => ({
            payrolls: payrollSelectors.selectPayrolls(state),
            payrollOwners: payrollSelectors.selectPayrollOwners(state),
            isLoading: payrollSelectors.selectIsLoading(state),
            error: payrollSelectors.selectError(state),
            visible: payrollSelectors.selectVisible(state),
            selectedEmployee: state.selectedEmployee,
            startDate: state.startDate,
            endDate: state.endDate,
            getPayroll: payrollSelectors.selectGetPayroll(state),
            getPayrollOwner: payrollSelectors.selectGetPayrollOwner(state),
        })
    ));
    // Dùng EmployeeStore dùng chung
    const employees = useEmployeeStore(employeeSelectors.selectEmployees);
    const fetchEmployees = useEmployeeStore(employeeSelectors.selectFetchEmployees);

   

    // TabView state
    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: 'owner', title: 'Owner' },
      { key: 'technician', title: 'Technician' },
    ]);
    // Render employee picker
    const employeePicker = 
    <TouchableOpacity onPress={async () => {
      usePayrollStore.setState({visible: true});
      await fetchEmployees();
    }}>
      <XInput value={selectedEmployee != null ? getDisplayName(selectedEmployee) : ""} editable={false} placeholder="Choose Technician"  label="Technician" pointerEvents="none"/>
    </TouchableOpacity>
    // Render webview
    const webView = payrolls.length > 0 
    ? <WebView
        originWhitelist={['*']}
        source={{ html: payrolls }}
        style={{ width: '100%', flex: 1 }}
        scrollEnabled={true}
      />
    : isFirstLoad ? null : <XNoDataView/>

    const webViewOwner = payrollOwners.length > 0 
    ? <WebView
        originWhitelist={['*']}
        source={{ html: payrollOwners }}
        style={{ width: '100%', flex: 1 }}
        scrollEnabled={true}
      />
    : isFirstLoad ? null : <XNoDataView/>
    const renderScene = SceneMap({
      technician: () => (
        webView
      ),
      owner: () => (
        webViewOwner
      ),
    });
    const layout = useWindowDimensions();
    const tabView = <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={props => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: theme.colors.primary }}
          style={{ backgroundColor: theme.colors.background }}
          inactiveColor={theme.colors.gray200}
          activeColor={theme.colors.primary}
          
        />
      )}
      style={{ flex: 1 }}
    />

   
  return (
    <XScreen title="Payroll" loading={isLoading} error={error} style={{ flex: 1 }}> 
      {/* View header */}
      <View style={styles.header}>
        {json?.isOwner && employeePicker}
        <XDateRangerSearch
          fromDate={startDate}
          toDate={endDate}
          onFromChange={(date) => usePayrollStore.setState({startDate: date})}
          onToChange={(date) => usePayrollStore.setState({endDate: date})}
          onSearch={() => {
            setIsFirstLoad(false);
            if(json?.isOwner){
              getPayrollOwner(selectedEmployee?.id??"");
              if(selectedEmployee){
                getPayroll(selectedEmployee?.id??"");
              }
            }else{
              getPayroll(selectedEmployee?.id??"");
            }
          }}
        />
      </View>
      {/* TabView */}
      {json?.isOwner ? tabView : webView}
      <XBottomSheetSearch
        visible={visible}
        onClose={() => {
          usePayrollStore.setState({visible: false});
        }}
        data={employees}
        onSelect={(item) => {
            usePayrollStore.setState({selectedEmployee: item});
        }}
        placeholder="Search..."
        title="Technician "
      /> 
    </XScreen>
  );
};