import { useTheme } from "../../../shared/theme/ThemeProvider";
import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useShallow } from "zustand/react/shallow";
import XScreen from "../../../shared/components/XScreen";
import XIcon, { iconMap } from "../../../shared/components/XIcon";
import { AppointmentState, useAppointmentStore, appointmentSelectors } from "../stores/appointmentStore";
import XText from "../../../shared/components/XText";
import { getDisplayName, getAppointmentDateTime, getStatusColor, getStatusText, getCustomerPhone, getCustomerEmail, getServiceName, getTechnicianName, getPrice, AppointmentEntity } from "../types/AppointmentResponse";
import XAvatar from "@/shared/components/XAvatar";
import CustomTabBar from "@/shared/components/CustomTabBar";
import { keychainHelper } from "@/shared/utils/keychainHelper";
import { SceneMap, TabView } from "react-native-tab-view";
import XCalendarStrip from "@/shared/components/XCalendarStrip";
import { ROUTES } from "@/app/routes";
import { useNavigation } from "@react-navigation/native";

export default function AppointmentScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [json, setJson] = useState<any>(null);
  const navigation = useNavigation();
  const {
    isLoading,
    error,
    selectedDate,
    appointmentList,
    getAppointmentList,
    getAppointmentListOwner,
  } = useAppointmentStore(
    useShallow((state: AppointmentState) => ({
      isLoading: appointmentSelectors.selectIsLoading(state),
      error: appointmentSelectors.selectError(state),
      selectedDate: appointmentSelectors.selectSelectedDate(state),
      appointmentList: appointmentSelectors.selectAppointmentList(state),
      getAppointmentList: appointmentSelectors.selectGetAppointmentList(state),
      getAppointmentListOwner: appointmentSelectors.selectGetAppointmentListOwner(state),
    }))
  );

  useEffect(() => {
    loadKeychainData();
  }, []);

  const loadKeychainData = async () => {
    try {
      const keychainData = await keychainHelper.getObject();
      setJson(keychainData);
      useAppointmentStore.setState({ json: keychainData });
    } catch (error) {
      console.error('Error loading keychain data:', error);
    }
  };
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
    <View style={{
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
        {renderIconText("customer", item.customer.fullName)}
      

      
    </View>
  );
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'all', title: 'All' },
    { key: 'new', title: 'New' },
    { key: 'checkin', title: 'Checkin' },
    { key: 'checkout', title: 'Checkout' },
  ]);
  
  const renderScene = SceneMap({
    all: () => (
        appointmentList.length > 0 ? (
            <FlatList
                contentContainerStyle={{padding: theme.spacing.sm }}
                data={appointmentList}
                renderItem={renderAppointmentItem}
                keyExtractor={(item) => item.apptId}
            />
        ) : (
      <View style={{ backgroundColor: 'transparent', flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: theme.spacing.xxxl }}>
        <XIcon name="noData" width={48} height={48} />
        <XText variant="content400">No data</XText>
      </View>
        )
    ),
    new: () => (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: theme.spacing.xxxl }}>
        <XIcon name="noData" width={48} height={48} />
        <XText variant="content400">No data</XText>
      </View>
    ),
    checkin: () => (
      <View style={{ flex: 1,  justifyContent: 'flex-start', alignItems: 'center', paddingTop: theme.spacing.xxxl }}>
        <XIcon name="noData" width={48} height={48} />
        <XText variant="content400">No data</XText>
      </View>
    ),
    checkout: () => (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: theme.spacing.xxxl }}>
        <XIcon name="noData" width={48} height={48} />
        <XText variant="content400">No data</XText>
      </View>
    ),
  });
  
  const layout = useWindowDimensions();
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
  return (
    <XScreen 
      title="Appointment" 
      loading={isLoading} 
      error={error} 
      style={{ flex: 1 }} 
      paddingHorizontal={0}
      contentStyle={{ paddingHorizontal: 0 }}
      backgroundColor={theme.colors.background}
    > 
      <XCalendarStrip
        value={selectedDate}
        onChange={(date) => {
            useAppointmentStore.setState({ selectedDate: date })
            getAppointmentList()
        }}
      />
      
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={{ flex: 1 , marginHorizontal: theme.spacing.sm, backgroundColor: 'transparent'  }}
        renderTabBar={props => (
          <CustomTabBar
            {...props}
            indicatorStyle={{ backgroundColor: theme.colors.primary }}
            style={{ 
              paddingVertical: theme.spacing.xs, 
              backgroundColor: 'transparent',
              marginHorizontal: theme.spacing.sm,
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
                      onPress={() => jumpTo(route.key)}
                      onLayout={onLayout}
                      style={{
                        borderRadius: theme.borderRadius.md,
                        paddingVertical: theme.spacing.sm,
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
          // TODO: handle create appointment
          navigation.navigate(ROUTES.CREATE_APPOINTMENT as never);
        }}
      >
        <XIcon name="appointment" width={28} height={28} color="#fff" />
      </TouchableOpacity>
    </XScreen>
  );
} 