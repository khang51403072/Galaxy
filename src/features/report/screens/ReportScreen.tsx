import { useTheme } from "../../../shared/theme/ThemeProvider";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useEffect, useState } from "react";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import { useShallow } from "zustand/react/shallow";
import XScreen from "../../../shared/components/XScreen";
import { View } from "react-native";
import XDatePicker from "../../../shared/components/XDatePicker";
import XIcon from "../../../shared/components/XIcon";
import { ReportState, useReportStore,reportSelectors } from "../stores/reportStore";
import WebView from "react-native-webview";

export default function  TicketScreen() {
    const theme = useTheme();

    const { isLoading, error, startDate, endDate, reportTechnician, reportSales, reportTimeSheet, reportBatchHistory, getReportTechnician, getReportSales, getReportTimeSheet, getReportBatchHistory } = useReportStore(useShallow(
        (state: ReportState) => ({
            isLoading: reportSelectors.selectIsLoading(state),
            error: reportSelectors.selectError(state),
            startDate: reportSelectors.selectStartDate(state),
            endDate: reportSelectors.selectEndDate(state),
            reportTechnician: reportSelectors.selectReportTechnician(state),
            reportSales: reportSelectors.selectReportSales(state),
            reportTimeSheet: reportSelectors.selectReportTimeSheet(state),
            reportBatchHistory: reportSelectors.selectReportBatchHistory(state),
            getReportTechnician: reportSelectors.selectGetReportTechnician(state),
            getReportSales: reportSelectors.selectGetReportSales(state),
            getReportTimeSheet: reportSelectors.selectGetReportTimeSheet(state),
            getReportBatchHistory: reportSelectors.selectGetReportBatchHistory(state),
        })
    ));
    

    // TabView state
    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: 'technician', title: 'Technician' },
      { key: 'sales', title: 'Sales' },
      { key: 'timesheet', title: 'Timesheet' },
      { key: 'batchHistory', title: 'Batch History' },
    ]);

    const renderScene = SceneMap({
      technician: () => (
        <WebView
          originWhitelist={['*']}
          source={{ html: reportTechnician }}
          style={{ width: '100%', flex: 1 }}
          scrollEnabled={true}
        />
      ),
      sales: () => (
        <WebView
          originWhitelist={['*']}
          source={{ html: reportSales }}
          style={{ width: '100%', flex: 1 }}
          scrollEnabled={true}
        />
      ),
      timesheet: () => (
        <WebView
          originWhitelist={['*']}
          source={{ html: reportTimeSheet }}
          style={{ width: '100%', flex: 1 }}
          scrollEnabled={true}
        />
      ),
      batchHistory: () => (
        <WebView
          originWhitelist={['*']}
          source={{ html: reportBatchHistory }}
          style={{ width: '100%', flex: 1 }}
          scrollEnabled={true}
        />
      ),
    });
    const layout = useWindowDimensions();
  return (
    <XScreen title="Reports" loading={isLoading} error={error} style={{ flex: 1 }}> 
        {/* View header */}
        <View style={{ flexDirection: 'column', paddingTop: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: theme.spacing.sm,}}>
            
            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-end' }}>
            <XDatePicker
                label="Date"
                value={startDate}
                onChange={(date) => useReportStore.setState({startDate: date})}
                placeholder="Chọn ngày sinh"
                minimumDate={new Date(1900, 0, 1)}
                maximumDate={new Date()}
                style={{ flex: 1 }}
            />
            <XDatePicker
                label="Date"
                value={endDate}
                onChange={(date) => useReportStore.setState({endDate: date})}
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
                  console.log(startDate?.toYYYYMMDD('-'));
                  await getReportTechnician();
                // await getPayroll(startDate ?? new Date(), endDate ?? new Date(), selectedEmployee?.id);
                }} 
            >
                <XIcon name="search" width={24} height={24} color="#fff" />
            </TouchableOpacity>
            </View>
        </View>
        
        
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
            
        </XScreen>
    );
};
