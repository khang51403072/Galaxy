import { useTheme } from "../../../shared/theme/ThemeProvider";
import { TabView, SceneMap, } from 'react-native-tab-view';
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { useShallow } from "zustand/react/shallow";
import XScreen from "../../../shared/components/XScreen";
import { View } from "react-native";
import { ReportState, useReportStore, reportSelectors } from "../stores/reportStore";
import CustomTabBar from "@/shared/components/CustomTabBar";
import XDateRangerSearch from "@/shared/components/XDateRangerSearch";
import { BatchHistoryScreen, SaleReportScreen, TechnicianScreen, TimeSheetScreen } from "../components/tabScreen";
import { TabBarItem } from "../components/itemFlatList";

const routes = [
  { key: 'technician', title: 'Technician' },
  { key: 'sales', title: 'Sales' },
  { key: 'timesheet', title: 'Timesheet' },
  { key: 'batchHistory', title: 'Batch History' },
];

export default function ReportScreen() {
  const theme = useTheme();
  const {
    closeOut, json, isLoading, error, startDate, endDate, reportBatchHistory, closeOutOwner
  } = useReportStore(useShallow(
    (state: ReportState) => ({
      isLoading: reportSelectors.selectIsLoading(state),
      error: reportSelectors.selectError(state),
      startDate: reportSelectors.selectStartDate(state),
      endDate: reportSelectors.selectEndDate(state),
      reportBatchHistory: reportSelectors.selectReportBatchHistory(state),
      closeOut: reportSelectors.selectCloseOut(state),
      json: reportSelectors.selectJson(state),
      closeOutOwner: state.closeOutOwner
    })
  ));

  const {
    loadData, reset, setStartDate, setEndDate
  } = useReportStore(useShallow(
    (state: ReportState) => ({
      loadData: state.loadData,
      reset: state.reset,
      setStartDate: state.setStartDate,
      setEndDate: state.setEndDate
    })
  ));

  const [index, setIndex] = useState(0);
  

  const renderTechnicianScene = useCallback(() => (
    <TechnicianScreen content={closeOutOwner?.technicianSummaryReport ?? ""} />
  ), [closeOutOwner]);

  const renderSalesScene = useCallback(() => (
    <SaleReportScreen content={closeOutOwner?.salesReport ?? ""} />
  ), [closeOutOwner]);

  const renderTimesheetScene = useCallback(() => (
    <TimeSheetScreen reportTimeSheet={closeOutOwner?.attendances ?? []} />
  ), [closeOutOwner]);

  const renderBatchHistoryScene = useCallback(() => (
    <BatchHistoryScreen reportBatchHistory={reportBatchHistory} />
  ), [reportBatchHistory]);

  // Dùng useMemo để đảm bảo object renderScene không được tạo lại không cần thiết
  const renderScene = useMemo(() => SceneMap({
    technician: renderTechnicianScene,
    sales: renderSalesScene,
    timesheet: renderTimesheetScene,
    batchHistory: renderBatchHistoryScene,
  }), [renderTechnicianScene, renderSalesScene, renderTimesheetScene, renderBatchHistoryScene]);
  const layout = useWindowDimensions();

  useEffect(() => {
    const initData = async () => {
      reset()
      const newState = useReportStore.getState()
      newState.loadData();
    }
    initData();
  }, []);
  const styles = StyleSheet.create({
    container: { paddingTop: theme.spacing.md, paddingBottom: theme.spacing.md, },
    tabBarItem: {
      borderRadius: theme.borderRadius.md,
      marginHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    tabBar: {
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.backgroundTabBarReport
    }
  })
  

  return (
    <XScreen title="Reports" loading={isLoading} error={error} style={{ flex: 1 }}>
      <View style={styles.container}>
        <XDateRangerSearch
          fromDate={startDate || new Date()}
          toDate={endDate || new Date()}
          onFromChange={setStartDate}
          onToChange={setEndDate}
          onSearch={loadData}
        />
      </View>
      {json?.isOwner
        ? <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={props => (
            <CustomTabBar
              {...props}
              indicatorStyle={null}
              style={styles.tabBar}
              renderTabBarItem={({ route, focused, jumpTo }) => (
                <TabBarItem 
                  route={route} 
                  focused={focused} 
                  jumpTo={jumpTo} 
                  theme={theme} 
                  styles={styles} 
                />
              )}
            />
          )}
        />
        : <TechnicianScreen content={closeOut ?? ""} />}
    </XScreen>
  );
};
