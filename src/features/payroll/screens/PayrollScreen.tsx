import XScreen from "../../../shared/components/XScreen";
import XBottomSheetSearch from "../../../shared/components/XBottomSheetSearch";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from "react-native";
import XInput from "../../../shared/components/XInput";
import { useShallow } from "zustand/react/shallow";
import WebView from "react-native-webview";
import { useTheme } from "../../../shared/theme/ThemeProvider";
import { payrollSelectors, PayrollState, usePayrollStore } from "../stores/payrollStore";
import { EmployeeEntity, getDisplayName } from "../../ticket/types/TicketResponse";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useEmployeeStore, employeeSelectors, ALL_EMPLOYEES_OPTION } from '@/shared/stores/employeeStore';
import XDateRangerSearch from "@/shared/components/XDateRangerSearch";
import XNoDataView from "@/shared/components/XNoDataView";
import { XSkeleton } from '../../../shared/components/XSkeleton';
import React from "react";
import { useXAlert, XAlertOptions } from "@/shared/components/XAlertContext";

export default function  PayRollScreen() {
    useEffect(() => {
      reset();
    }, []);
    const layout = useWindowDimensions();
    const theme = useTheme();
    const {showAlert} = useXAlert();
    const styles = React.useMemo(() => StyleSheet.create({
      header: {
        flexDirection: 'column',
        paddingTop: theme.spacing.md,
        gap: theme.spacing.md,
      },
      skeletonContainer: { 
        flex: 1, 
        padding: theme.spacing.md, 
        alignItems: 'center', 
        justifyContent: 'center' 
      },
      tabBarStyle: {
            borderTopWidth: 0,
            borderTopColor: theme.colors.primaryMain,
            backgroundColor: theme.colors.background 
          }
    }), [theme]);
   
  const {
    isLoading, payrolls, payrollOwners,
    error, visible, selectedEmployee, startDate, endDate,
    json
  } = usePayrollStore(useShallow(
    (state: PayrollState) => ({
      payrolls: payrollSelectors.selectPayrolls(state),
      payrollOwners: payrollSelectors.selectPayrollOwners(state),
      isLoading: payrollSelectors.selectIsLoading(state),
      error: payrollSelectors.selectError(state),
      visible: payrollSelectors.selectVisible(state),
      selectedEmployee: state.selectedEmployee,
      startDate: state.startDate,
      endDate: state.endDate,
      json: state.json
    })
  ));

  const { 
    getPayroll, getPayrollOwner, setSelectedEmployee,
    setStartDate, setEndDate, reset, setVisible
  } = usePayrollStore(useShallow(
    (state: PayrollState) => ({
      getPayroll: payrollSelectors.selectGetPayroll(state),
      getPayrollOwner: payrollSelectors.selectGetPayrollOwner(state),
      setStartDate: state.setStartDate,
      setEndDate: state.setEndDate,
      setSelectedEmployee: state.setSelectedEmployee,
      reset: state.reset,
      setVisible: state.setVisible
    })
  ));
    // Dùng EmployeeStore dùng chung
    const employees = useEmployeeStore(employeeSelectors.selectEmployees);
    const fetchEmployees = useEmployeeStore(employeeSelectors.selectFetchEmployees);
    const employeeAll: EmployeeEntity[] = useMemo(
      () => [ALL_EMPLOYEES_OPTION, ...employees]
      ,[employees]
    )
   

    // TabView state
    const [index, setIndex] = useState(0);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [routes] = useState([
      { key: 'owner', title: 'Owner' },
      { key: 'technician', title: 'Technician' },
    ]);

    // Render employee picker
    const employeePicker = useMemo(
      () => <TouchableOpacity onPress={async () => {
        await fetchEmployees();
        setVisible(true)
      }}>
        <XInput value={getDisplayName(selectedEmployee)} editable={false} placeholder="Choose Technician"  label="Technician" pointerEvents="none"/>
      </TouchableOpacity>,
      [selectedEmployee, fetchEmployees, setVisible]
    )
    
    // Render webview
    const webView = useMemo(
      () => payrolls.length > 0 
      ? <WebView
          originWhitelist={['*']}
          source={{ html: payrolls }}
          style={{ width: '100%', flex: 1 }}
          scrollEnabled={true}
        />
      : isFirstLoad ? null : <XNoDataView/>, [isFirstLoad,payrolls]
    ) 

    const webViewOwner = useMemo(
      ()=>payrollOwners.length > 0 
      ? <WebView
          originWhitelist={['*']}
          source={{ html: payrollOwners }}
          style={{ width: '100%', flex: 1 }}
          scrollEnabled={true}
        />
      : isFirstLoad ? null : <XNoDataView/>,
      [payrollOwners, isFirstLoad]
    ) 
    
    const renderScene = useMemo(
      () => SceneMap({
        technician: () => (
          isLoading ? PayrollSkeleton :webView
        ),
        owner: () => (
          isLoading ? PayrollSkeleton :webViewOwner
        ),
      }),[isLoading, webView, webViewOwner]
    ) ;

  

    const tabView = useMemo( () => <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={props => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: theme.colors.primaryMain }}
          style={styles.tabBarStyle}
          inactiveColor={theme.colors.gray200}
          activeColor={theme.colors.primaryMain}
          
        />
      )}
      style={{ flex: 1 ,borderTopWidth: 0,
        borderTopColor: theme.colors.primaryMain,}}
    />, [{ index, routes },renderScene,setIndex]
    )

    // PayrollSkeleton component
    const PayrollSkeleton =  useMemo(() => {
      return (
        <View style={styles.skeletonContainer}>
          <XSkeleton width="100%" height={theme.spacing.xl} style={{ marginBottom: theme.spacing.md }} />
          <XSkeleton width="100%" height={300} style={{ marginBottom: theme.spacing.md }} />
          <XSkeleton width="80%" height={theme.spacing.lg} />
        </View>
      );
    },[]);

    const onSearchClicked = useCallback(
      () => {
            setIsFirstLoad(false);
            //if user is owner, in tabScreen Owner: 
            if(json?.isOwner && index==0){
              getPayrollOwner();
            }
            else if(selectedEmployee.id.length==0) return showAlert({
                message: "Please select an employee", 
                type: "error", 
                title: "Error", onClose: ()=>{}
              });
            else{
              //if user is owner, in tabScreen Technical: 
              //if user is technical, only getPayroll
              getPayroll();
            }
          },[getPayroll,getPayrollOwner,json]
    )
    const searchBox = useMemo(
      () => <XDateRangerSearch
          fromDate={startDate}
          toDate={endDate}
          onFromChange={setStartDate}
          onToChange={setEndDate}
          onSearch={onSearchClicked}
        />
     ,[startDate, endDate, getPayrollOwner, getPayroll, json]
    )
   
  return (
    <XScreen title="Payroll" loading={false} error={error} style={{ flex: 1 }}> 
      {/* View header */}
      <View style={styles.header}>
        {json?.isOwner && employeePicker}
        {searchBox}
      </View>
      {/* TabView or Skeleton */}
      { (json?.isOwner ? tabView : isLoading ? PayrollSkeleton :webView)}
      {/* ************* */}
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