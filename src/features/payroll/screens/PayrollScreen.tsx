import XScreen from "../../../shared/components/XScreen";
import XText from "../../../shared/components/XText";
import XBottomSheetSearch from "../../../shared/components/XBottomSheetSearch";
import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, useWindowDimensions, View } from "react-native";
import XInput from "../../../shared/components/XInput";
import { useShallow } from "zustand/react/shallow";
import XDatePicker from "../../../shared/components/XDatePicker";
import WebView from "react-native-webview";
import XIcon from "../../../shared/components/XIcon";
import { useTheme } from "../../../shared/theme/ThemeProvider";
import { payrollSelectors, PayrollState, usePayrollStore } from "../stores/payrollStore";
import { getDisplayName } from "../../ticket/types/TicketResponse";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { keychainHelper } from "@/shared/utils/keychainHelper";

export default function  TicketScreen() {
    const theme = useTheme();
    const { json, employeeLookup, isLoading, payrolls, payrollOwners, getPayroll, getPayrollOwner, error, visible, selectedEmployee, startDate, endDate, getEmployeeLookup} = usePayrollStore(useShallow(
        (state: PayrollState) => ({
            json: state.json,
            employeeLookup: state.employeeLookup,
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
            getEmployeeLookup: payrollSelectors.selectGetEmployeeLookup(state),
        })
    ));

    useEffect(() => {
      return () => {
        usePayrollStore.getState().reset();
      };
    }, []);

    // TabView state
    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: 'owner', title: 'Owner' },
      { key: 'technician', title: 'Technician' },
    ]);

    const renderScene = SceneMap({
      technician: () => (
        payrolls.length > 0 ? 
        <WebView
          originWhitelist={['*']}
          source={{ html: payrolls }}
          style={{ width: '100%', flex: 1 }}
          scrollEnabled={true}
        />
        : <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: theme.spacing.xxxl }}>
            <XIcon name="noData" width={48} height={48} />
            <XText variant="content400">No data</XText>
          </View>
      ),
      owner: () => (
        payrollOwners.length > 0 ? 
        <WebView
          originWhitelist={['*']}
          source={{ html: payrollOwners }}
          style={{ width: '100%', flex: 1 }}
          scrollEnabled={true}
        />
        : <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: theme.spacing.xxxl }}>
            <XIcon name="noData" width={48} height={48} />
            <XText variant="content400">No data</XText>
          </View>
      ),
    });
    const layout = useWindowDimensions();
  return (
    <XScreen title="Payroll" loading={isLoading} error={error} style={{ flex: 1 }}> 
      {/* View header */}
      <View style={{ flexDirection: 'column', paddingTop: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: theme.spacing.sm,}}>
        {json?.isOwner ? 
        <TouchableOpacity style={{}} onPress={async () => {
          usePayrollStore.setState({visible: true});
          await getEmployeeLookup();
        }}>
          <XInput value={selectedEmployee != null ? getDisplayName(selectedEmployee) : ""} editable={false} placeholder="Choose Technician"  label="Technician" pointerEvents="none"/>
        </TouchableOpacity>:null}
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-end' }}>
          <XDatePicker
            label="Date"
            value={startDate ?? new Date()}
            onChange={(date) => usePayrollStore.setState({startDate: date})}
            placeholder="Chọn ngày sinh"
            minimumDate={new Date(1900, 0, 1)}
            maximumDate={new Date()}
            style={{ flex: 1 }}
          />
          <XDatePicker
            label="Date"
            value={endDate ?? new Date()}
            onChange={(date) => usePayrollStore.setState({endDate: date})}
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
                if(selectedEmployee != null){
                Promise.all([
                    getPayrollOwner(""),
                    getPayroll(selectedEmployee?.id??""),
                  ]);
                }else{
                  await getPayrollOwner("");
                }
                
              }else{
                await getPayroll(json?.employeeId??"");
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
          usePayrollStore.setState({visible: false});
        }}
        data={employeeLookup}
        onSelect={(item) => {
            usePayrollStore.setState({selectedEmployee: item});
        }}
        placeholder="Search..."
        title="Technician "
      /> 

      {!visible && (
        json?.isOwner ? 
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: theme.colors.primary }}
              style={{ backgroundColor: '#fff' }}
              inactiveColor={theme.colors.gray200}
              activeColor={theme.colors.primary}
              
            />
          )}
          style={{ flex: 1 }}
        />
        :
        
          payrolls.length > 0 
          ? <WebView
              originWhitelist={['*']}
              source={{ html: payrolls }}
              style={{ width: '100%', flex: 1 }}
              scrollEnabled={true}
            />
          : <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: theme.spacing.xxxl }}>
              <XIcon name="noData" width={48} height={48} />
              <XText variant="content400">No data</XText>
            </View>
        
        
      )}
    </XScreen>
  );
};