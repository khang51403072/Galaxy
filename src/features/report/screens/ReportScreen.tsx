import { useTheme } from "../../../shared/theme/ThemeProvider";
import { TabView, SceneMap, } from 'react-native-tab-view';
import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, useWindowDimensions } from "react-native";
import { useShallow } from "zustand/react/shallow";
import XScreen from "../../../shared/components/XScreen";
import { View } from "react-native";
import XDatePicker from "../../../shared/components/XDatePicker";
import XIcon from "../../../shared/components/XIcon";
import { ReportState, useReportStore,reportSelectors } from "../stores/reportStore";
import WebView from "react-native-webview";
import XText from "../../../shared/components/XText";
import { getClockIn, getClockOut, getDisplayName, parseISODate } from "../types/ReportResponse";
import XAvatar from "@/shared/components/XAvatar";
import CustomTabBar from "@/shared/components/CustomTabBar";
import { homeSelectors, useHomeStore } from "@/features/home/stores/homeStore";

export default function  TicketScreen() {
    const theme = useTheme();
    const jsonHome = useHomeStore(homeSelectors.selectJson);
    const { closeOut,json, isLoading, error, startDate, endDate, reportTechnician, reportSales, reportTimeSheet, reportBatchHistory, getReportTechnician, getReportSales, getReportTimeSheet, getReportBatchHistory, getCloseOut, setJson } = useReportStore(useShallow(
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
            closeOut: reportSelectors.selectCloseOut(state),
            json: reportSelectors.selectJson(state),
            getCloseOut: reportSelectors.selectGetCloseOut(state),
            setJson: state.setJson,
        })
    ));
    
    useEffect(() => {
      if(jsonHome) setJson(jsonHome);
    }, [jsonHome]);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: 'technician', title: 'Technician' },
      { key: 'sales', title: 'Sales' },
      { key: 'timesheet', title: 'Timesheet' },
      { key: 'batchHistory', title: 'Batch History' },
    ]);
    const renderScene = SceneMap({
      technician: () => (
        reportTechnician.length > 0 ? 
        <WebView
          originWhitelist={['*']}
          source={{ html: reportTechnician }}
          style={{ width: '100%', flex: 1 }}
          scrollEnabled={true}
        />
        : (
          <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: theme.spacing.xxxl }}>
            <XIcon name="noData" width={48} height={48} />
            <XText variant="content400">No data</XText>
          </View>
        )
      ),
      sales: () => (
        reportSales.length > 0 ? 
          <WebView
            originWhitelist={['*']}
            source={{ html: reportSales }}
            style={{ width: '100%', flex: 1 }}
            scrollEnabled={true}
          />        
          : (
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: theme.spacing.xxxl }}>
              <XIcon name="noData" width={48} height={48} />
              <XText variant="content400">No data</XText>
            </View>
          )
      ),
      timesheet: () => (
        reportTimeSheet.length > 0 ? 
        <FlatList
          data={reportTimeSheet}
          contentContainerStyle={{ paddingTop: theme.spacing.md, gap: theme.spacing.md }}
          renderItem={({ item }) => {
            return (
              <View style = {{ borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.white, flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md, ...theme.shadows.sm}}>
                <XAvatar editable={false} uri={item.avatar} size={62} />
                <View style = {{gap: theme.spacing.sm, flexDirection: 'column', alignItems: 'flex-start', paddingLeft: theme.spacing.md}}>
                  <XText variant="content400">{getDisplayName(item)}</XText>

                  <View style = {{flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm}}>
                    <XIcon name = 'clockIn' width={16} height={16}  />
                    <XText variant="content300">{getClockIn(item)}</XText>
                  </View>
                  <View style = {{flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm}}>
                    <XIcon name = 'clockOut' width={16} height={16} />
                    <XText variant="content300">{getClockOut(item)}</XText>
                  </View>
                </View>
              </View>
            )
          }}
        />
        : (
          <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: theme.spacing.xxxl }}>
            <XIcon name="noData" width={48} height={48} />
            <XText variant="content400">No data</XText>
          </View>
        )
      ),
      batchHistory: () => (
        reportBatchHistory.length > 0 ? (
          <View style={{flex: 1, flexDirection: 'column', paddingTop: theme.spacing.sm}}>
            <View style={{backgroundColor: "#1D62D812", flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md, ...theme.shadows.sm}}>
              <XText variant="content400" style={{flex: 3}}>Batch Date</XText>
              <XText variant="content400" style={{flex: 1}}>Count</XText>
              <XText variant="content400" style={{flex: 1}}>Return</XText>
            </View>
            <FlatList
              scrollEnabled={true}
              data={reportBatchHistory}
              contentContainerStyle={{ paddingTop: theme.spacing.md, gap: theme.spacing.md }}
              renderItem={({ item }) => {
                return (
                  <View style={{ flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md, ...theme.shadows.sm }}>
                    <XText variant="content300" style={{flex: 3}}>{parseISODate(item.batchDate).toMMDDYYYYHHMM('/')}</XText>
                    <XText variant="content300" style={{flex: 1}}>{item.batchNumber}</XText>
                    <XText variant="content300" style={{flex: 1}}>{item.transactionReports.transactionsCount}</XText>
                  </View>
                )
              }}
            />
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: theme.spacing.xxxl }}>
            <XIcon name="noData" width={48} height={48} />
            <XText variant="content400">No data</XText>
          </View>
        )
      ),
    });
    const layout = useWindowDimensions();
  return (
    <XScreen title="Reports" loading={isLoading} error={error} style={{ flex: 1 }}> 
        <View style={{ flexDirection: 'column', paddingTop: theme.spacing.md, paddingBottom: theme.spacing.sm,}}>
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
                onPress={async () => {
                  if(json?.isOwner){
                  await Promise.all([
                    getReportTechnician(),
                    getReportSales(), 
                    getReportTimeSheet(),
                    getReportBatchHistory(),
                  ]);
                }else{
                  await getCloseOut();
                }
                }} 
            >
                <XIcon name="search" width={24} height={24} color="#fff" />
            </TouchableOpacity>
            </View>
        </View>
        
        {json?.isOwner ? 
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={props => (
              <CustomTabBar
                {...props}
                indicatorStyle={null}
                style={{ paddingVertical: theme.spacing.xs, borderRadius: theme.borderRadius.sm, backgroundColor: theme.colors.backgroundTabBarReport }}
                renderTabBarItem={({ route, focused, jumpTo , ...props}) => (
                  <TouchableOpacity
                    onPress={() => jumpTo(route.key)}
                    style={{
                      
                      backgroundColor: focused ? theme.colors.white : 'transparent',
                      borderRadius: theme.borderRadius.md,
                      marginHorizontal: theme.spacing.sm,
                      paddingVertical: theme.spacing.sm,
                      paddingHorizontal: theme.spacing.lg,
                      
                    }}
                    activeOpacity={0.8}
                  >                    
                    <XText variant="content400" style={{ color: theme.colors.gray800 }}>{route.title}</XText>
                  </TouchableOpacity>
                 
                )}
              />
            )}
          />
          : closeOut.length > 0 ? 
          <WebView
                originWhitelist={['*']}
                source={{ html: closeOut }}
                style={{ width: '100%', flex: 1 }}
                scrollEnabled={true}
              />
            : (
              <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: theme.spacing.xxxl }}>
                <XIcon name="noData" width={48} height={48} />
                <XText variant="content400">No data</XText>
              </View>
            )}
        </XScreen>
    );
};
