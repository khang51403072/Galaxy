import { useTheme } from "../../../shared/theme/ThemeProvider";
import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useShallow } from "zustand/react/shallow";
import XScreen from "../../../shared/components/XScreen";
import XIcon, { iconMap } from "../../../shared/components/XIcon";
import {  useAppointmentStore, appointmentSelectors, AppointmentState } from "../stores/appointmentStore";
import XText from "../../../shared/components/XText";
import { getAppointmentDateTime, getServiceName, AppointmentEntity, getDisplayName } from "../types/AppointmentResponse";
import { EmployeeEntity, getDisplayName as getDisplayNameEmployee } from "@/features/ticket/types/TicketResponse";
import CustomTabBar from "@/shared/components/CustomTabBar";
import { SceneMap, TabView } from "react-native-tab-view";
import XCalendarStrip from "@/shared/components/XCalendarStrip";
import { ROUTES } from "@/app/routes";
import { useNavigation } from "@react-navigation/native";
import { appConfig } from "@/shared/utils/appConfig";
import XNoDataView from "@/shared/components/XNoDataView";
import { spacing } from "@/shared/theme";
import AppointmentItemSkeleton from "../components/AppointmentItemSkeleton";
import XInput from "@/shared/components/XInput";
import XBottomSheetSearch from "@/shared/components/XBottomSheetSearch";
import { employeeSelectors, useEmployeeStore } from "@/shared/stores/employeeStore";
import { navigate } from "@/app/NavigationService";

export default function AppointmentScreen() {
  const theme = useTheme();
 
  const {
    isLoading,
    error,
    selectedDate,
    appointmentList,
    getAppointmentList,
    getCompanyProfile,
    json,
    selectedEmployee,
    setSelectedEmployee,
    reset
  } = useAppointmentStore(
    useShallow((state: AppointmentState) => ({
      isLoading: appointmentSelectors.selectIsLoading(state),
      error: appointmentSelectors.selectError(state),
      json: appointmentSelectors.selectJson(state),
      selectedDate: appointmentSelectors.selectSelectedDate(state),
      appointmentList: appointmentSelectors.selectAppointmentList(state),
      getAppointmentList: appointmentSelectors.selectGetAppointmentList(state),
      getCompanyProfile: appointmentSelectors.selectGetCompanyProfile(state),
      selectedEmployee: appointmentSelectors.selectSelectedEmployee(state),
      setSelectedEmployee: appointmentSelectors.selectSetSelectedEmployee(state),
      reset: appointmentSelectors.selectReset(state),
    }))
  );
  const [visible, setVisible] = useState(false);
  const employees = useEmployeeStore(employeeSelectors.selectEmployees);
  useEffect(() => {
    reset();
    loadData();
  }, []);

  
  const renderIconText = (icon: keyof typeof iconMap, text: string) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
                <XIcon name={icon} width={16} height={16} />
                <XText variant="appointmentItemNormalText" >
                    {text}
                </XText>
            </View>
        </View>
    )
  }
  const renderAppointmentItem = ({ item }: { item: AppointmentEntity }) => (
    <TouchableOpacity onPress={()=>{
      navigate(ROUTES.CREATE_APPOINTMENT as never, { apptId: item.apptId });
    }} style={{
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      gap: theme.spacing.sm,
      ...theme.shadows.md,
    }}>
    
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {/* Status */}
            <View style={{
                backgroundColor: colorMapBackground[item.apptStatus.toLowerCase()],
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.xs,
                borderRadius: theme.borderRadius.sm,
            }}>
                <XText variant="appointmentItemStatus" style={{ color: colorMapText[item.apptStatus.toLowerCase()] }}>
                    {item.apptStatus}
                </XText>
            </View>
            {/* Time */}

            <XText variant="appointmentItemNormalText">
                {getAppointmentDateTime(item)}
            </XText>
        </View>

        <XText variant="appointmentItemServiceName" style={{ color: theme.colors.primary }}>
            {getServiceName(item)}
        </XText>
      
        {/* Name */}
        {renderIconText("clock", item.duration.toString() + " min")}
        {renderIconText("currencyCircleDollar", item.price.toString())}
        {renderIconText("customer", getDisplayName(item))}
      

      
    </TouchableOpacity>
  );
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'all', title: 'All' },
    { key: 'new', title: 'New' },
    { key: 'checkin', title: 'Checkin' },
    { key: 'checkout', title: 'Checkout' },
  ]);
  
  const renderScene = SceneMap({
    all: () => {
      if (isLoading) {
        return (
          <View style={{ padding: theme.spacing.sm }}>
            {[...Array(5)].map((_, i) => <AppointmentItemSkeleton key={i} />)}
          </View>
        );
      }
      return (
        <FlatList
          contentContainerStyle={{padding: theme.spacing.sm }}
          data={appointmentList}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => appointmentList.indexOf(item) + "-" + item.blockStart + "-" + item.apptId + "-" + item.serviceId + "-" + item.employeeID}
          ListEmptyComponent={<XNoDataView />}
        />
      );
    },
    new: () => {
      if (isLoading) {
        return (
          <View style={{ padding: theme.spacing.sm }}>
            {[...Array(5)].map((_, i) => <AppointmentItemSkeleton key={i} />)}
          </View>
        );
      }
      return (
        <FlatList
          contentContainerStyle={{padding: theme.spacing.sm }}
          data={appointmentList.filter((value, index)=>{
            return value.apptStatus.toLowerCase() == "new"
          })}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => appointmentList.indexOf(item) + "-" + item.blockStart + "-" + item.apptId + "-" + item.serviceId + "-" + item.employeeID}
          ListEmptyComponent={<XNoDataView />}
        />
      );
    },
    checkin: () => {
      if (isLoading) {
        return (
          <View style={{ padding: theme.spacing.sm }}>
            {[...Array(5)].map((_, i) => <AppointmentItemSkeleton key={i} />)}
          </View>
        );
      }
      return (
        <FlatList
          contentContainerStyle={{padding: theme.spacing.sm }}
          data={appointmentList.filter((value, index)=>{
            return value.apptStatus.toLowerCase() == "checkin"
          })}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => appointmentList.indexOf(item) + "-" + item.blockStart + "-" + item.apptId + "-" + item.serviceId + "-" + item.employeeID}
          ListEmptyComponent={<XNoDataView />}
        />
      );
    },
    checkout: () => {
      if (isLoading) {
        return (
          <View style={{ padding: theme.spacing.sm }}>
            {[...Array(5)].map((_, i) => <AppointmentItemSkeleton key={i} />)}
          </View>
        );
      }
      return (
        <FlatList
          contentContainerStyle={{padding: theme.spacing.sm }}
          data={appointmentList.filter((value, index)=>{
            return value.apptStatus.toLowerCase() == "checkout"
          })}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) =>appointmentList.indexOf(item) + "-" + item.blockStart + "-" + item.apptId + "-" + item.serviceId + "-" + item.employeeID}
          ListEmptyComponent={<XNoDataView />}
        />
      );
    },
  });

  
  const loadData = async () => {
    const keychainData = await appConfig.getUser();
    await getAppointmentList(keychainData);
  }
  const layout = useWindowDimensions();
  const renderTabview =  
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={{ flex: 1 , backgroundColor: theme.colors.background  }}
        renderTabBar={props => (
          <CustomTabBar
            {...props}
            indicatorStyle={{ backgroundColor: theme.colors.primary }}
            style={{ 
              backgroundColor: theme.colors.background ,
              paddingVertical: theme.spacing.xs, 
              paddingHorizontal: theme.spacing.sm,
              borderBottomWidth: 1, borderColor: theme.colors.border,
            }}
            renderTabBarItem={({ route, focused, jumpTo, onLayout, ref, ...props }) =>
            
            {
                const variantCount = focused ? "appointmentTabBarSelectedCount" : "appointmentTabBarUnselectedCount";
                const variantTitle = focused ? "appointmentTabBarSelectedTitle" : "appointmentTabBarUnselectedTitle";
                const colorTitle = focused ? theme.colors.primary : theme.colors.primary80;
                const colorCount = focused ? theme.colors.gray800 : theme.colors.gray400;
                let count = appointmentList.filter(item => route.key === "all" ? true : item.apptStatus.toLowerCase() === route.key).length;
                return (
                    <TouchableOpacity
                      ref={ref}
                      onPress={() => {

                        jumpTo(route.key)
                      }}
                      onLayout={onLayout}
                      style={{
                        borderRadius: theme.borderRadius.md,
                        paddingVertical: theme.spacing.sm,
                        paddingHorizontal: theme.spacing.sm,
                        backgroundColor: 'transparent',
                        gap: theme.spacing.xs,
                        flex: 1, // Thêm flex: 1 để width đều
                        alignItems: 'flex-start', // Center content
                      }}
                      activeOpacity={0.8}
                    >                    
                      <XText variant= {variantCount} style={{ color: colorCount }}>
                        {count}
                      </XText>
                      <XText variant= {variantTitle} style={{ color: colorTitle }}>
                        {route.title}
                      </XText>
                    </TouchableOpacity>
                  )
            }
            }
          />
        )}
      />
  const colorMapText: { [key: string]: string } = {
    all: theme.colors.primary,
    new: theme.colors.skyBlue,
    checkin: theme.colors.cyan,
    checkout: theme.colors.primary600,
  }
  const colorMapBackground: { [key: string]: string } = {
    all: theme.colors.primary200,
    new: theme.colors.skyBlue200,
    checkin: theme.colors.cyan200,
    checkout: theme.colors.primary200,
  }
  // Render employee picker
  const employeePicker = 
  <TouchableOpacity style={{marginTop: theme.spacing.md}} onPress={async () => {
    setVisible(true);

  }}>
    <XInput value={selectedEmployee != null ? getDisplayNameEmployee(selectedEmployee) : ""} editable={false} placeholder="Choose Technician" pointerEvents="none"/>
  </TouchableOpacity>
  return (
    <XScreen 
      title="Appointment" 
      error={error} 
      style={{ flex: 1}} 
      paddingHorizontal={0}
      backgroundColor={theme.colors.background}
    > 
      <XCalendarStrip
        value={selectedDate}
        onChange={(date) => {
            useAppointmentStore.setState({ selectedDate: date })
            loadData();
        }}
      />
      <View style={{ paddingHorizontal: theme.spacing.md , flex:1}}>
        {json?.isOwner && employeePicker}
        {renderTabview}
      </View>
      
      {/* Floating Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 24,
          bottom: 32,
          backgroundColor: theme.colors.primary,
          borderRadius: 32,
          width: 56,
          height: 56,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 6,
        }}
        activeOpacity={0.85}
        onPress={() => {
          navigate(ROUTES.CREATE_APPOINTMENT as never);
        }}
      >
        <XIcon name="addAppointment" width={24} height={24} color="#fff" />
      </TouchableOpacity>
      <XBottomSheetSearch
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        data={employees}
        onSelect={(item) => {
          setSelectedEmployee(item);
          loadData();
        }}
        placeholder="Search..."
        title="Technician "
      /> 
    </XScreen>
  );
} 