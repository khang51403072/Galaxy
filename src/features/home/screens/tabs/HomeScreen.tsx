import React, {  useEffect } from 'react';
import { Alert, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import XText from '../../../../shared/components/XText';
import XScreen from '../../../../shared/components/XScreen';
import { useShallow } from 'zustand/react/shallow';
import XAvatar from '../../../../shared/components/XAvatar';
import XIcon from '../../../../shared/components/XIcon';
import { useTheme } from '../../../../shared/theme/ThemeProvider';
import CategoryCard from '../../components/CategoryCard';
import XChart from '../../../../shared/components/XChartBar';
import { ROUTES } from '../../../../app/routes';
import {  homeSelectors, useHomeStore } from '../../stores/homeStore';
import HomeSkeleton from '../../components/HomeSkeleton';
import { isSuccess } from '../../../../shared/types/Result';
import { navigate } from '@/app/NavigationService';
import { appConfig } from '@/shared/utils/appConfig';
import { employeeSelectors, useEmployeeStore } from '@/shared/stores/employeeStore';
import BellWithBadge from '../../components/BellWithBadge';
import { getNotifications } from '@/shared/services/FirebaseNotificationService';

export default function HomeScreen() {
  const { homeData, 
    isLoading, 
    error, 
    getHomeData, 
    getChartData,  
    isLoadingChart, 
    toggleSwitch, 
    json, 
    chartDisplayData, selectedStore, notificationCount, setNotificationCount } = useHomeStore(
    useShallow((state) => ({
      homeData: homeSelectors.selectHomeData(state),
      isLoading: homeSelectors.selectIsLoading(state),
      error: homeSelectors.selectError(state),
      getHomeData: homeSelectors.selectGetHomeData(state),
      getChartData: homeSelectors.selectGetChartData(state),
      isOwner: homeSelectors.selectIsOwner(state),
      isLoadingChart: homeSelectors.selectIsLoadingChart(state),
      toggleSwitch: homeSelectors.selectToggleSwitch(state),
      json: homeSelectors.selectJson(state),
      chartDisplayData: homeSelectors.selectChartDisplayData(state),
      selectedStore: homeSelectors.selectSelectedStore(state),
      notificationCount: homeSelectors.selectNotificationCount(state),
      setNotificationCount: homeSelectors.selectSetNotificationCount(state),
    }))
  );
  const fetchEmployees = useEmployeeStore(employeeSelectors.selectFetchEmployees);
  const theme = useTheme();  
  async function checkShowBiometricGuide() {
    const shown = await appConfig.getUseBiometric();
    if (!shown) {
      Alert.alert(
        'Warning',
        'You have not enabled biometric login, do you want to enable it in the profile section?',
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Enable', onPress: () => {
              // AsyncStorage.setItem('biometricGuideShown', '0');
              navigate(ROUTES.PROFILE, { showBiometricTooltip: true });
            }
          }
        ]
      );
    }
  }

  useEffect(() => {
    loadData();
    checkShowBiometricGuide();
    getNotifications().then((list) => {
      setNotificationCount(list.filter((e)=>!e.read).length);
    });
  }, []);
  
  useEffect(() => {
    if(json==null) return
    getChartData().then((result) => {
      if(isSuccess(result)) {
        // Data đã được convert tự động trong store, không cần loadData2Chart nữa
      }
    });
  }, [toggleSwitch]);
  
  const loadData = async () => {
    fetchEmployees();
    await getHomeData();
    getChartData().then((result) => {
      if(isSuccess(result)) {
        // Data đã được convert tự động trong store, không cần loadData2Chart nữa
      }
    });
  };


  const buildColorNote = (text: string, color: string)=>{
    return (
      <View style={{  flexDirection: 'row', alignItems: 'center', width: 100, backgroundColor: 'transparent', borderRadius: 50 }}>
        <View style={{ width: 10, height: 10, backgroundColor: color, borderRadius: 50 }}>
        </View>
        <XText variant='captionLight' style={{ color: theme.colors.gray800, marginLeft: theme.spacing.xs }}>
          {text}
        </XText>
      </View>
    );
  };
  const ToggleSwitch = ({ value, onChange }: { value: 'week' | 'month', onChange: (val: 'week' | 'month') => void }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: theme.colors.blackOpacity10,
          borderRadius: 8,
          overflow: 'hidden',
          width: "60%",
          height: 32,
          paddingHorizontal: theme.spacing.xs,
          paddingVertical: theme.spacing.xs,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: value === 'week' ? theme.colors.white : 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: theme.borderRadius.sm,
            paddingHorizontal: theme.spacing.xs,
            paddingVertical: theme.spacing.xs,
          }}
          onPress={() => onChange('week')}
          activeOpacity={0.8}
        >
          <XText variant='captionRegular' style={{ color: theme.colors.gray700  }}>Week</XText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: value === 'month' ? theme.colors.white : 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: theme.borderRadius.sm,
            paddingHorizontal: theme.spacing.xs,
            paddingVertical: theme.spacing.xs,
          }}
          onPress={() => onChange('month')}
          activeOpacity={0.8}
        >
          <XText variant='captionRegular' style={{ color: theme.colors.gray700 }}>Month</XText>
        </TouchableOpacity>
      </View>
    );
  };

  
  const window = useWindowDimensions();
  const CHART_WIDTH = Math.max(320, Math.min(window.width - 32, 500)); // paddingHorizontal: 16*2, min 320, max 500

  
  

  const header = 
  <View style={{ width: '100%', height: '10%', backgroundColor: theme.colors.background,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
  <XAvatar
    editable = {false}
    size={40}
    uri={homeData?.employeeInfo?.avatar|| undefined}
  />
  <View style={{ flex: 1, flexDirection: 'row',  justifyContent: 'flex-start', paddingLeft: 10}}>
    <XText variant='bodyLight' style={{ color: theme.colors.gray800 }}>
      Hi! 
    </XText>
    <XText variant='bodyRegular' style={{ color: theme.colors.gray800}}>
      {homeData?.employeeInfo?.firstName+ " " + homeData?.employeeInfo?.lastName}
    </XText>  
  </View>
  <TouchableOpacity onPress={()=>navigate(ROUTES.NOTIFICATIONS)}>
    <BellWithBadge count={notificationCount} />
  </TouchableOpacity>
  
</View>

const meEarningsToday = 
<XText variant='bodyRegular' style={{ color: theme.colors.gray800 }}>
  ME Earnings Today
</XText>
const saleCard =
  <View style={{
    width: '48%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    gap:theme.spacing.xs ,
    ...theme.shadows.sm
  }}>
    <XText variant='bodyLight' style={{ color: theme.colors.gray700, }}>
      Sale:
    </XText>
    <XText variant='bodyMedium' style={{ color: theme.colors.gray700 }}>
      $ {homeData?.totalSale.toFixed(2) || 0}
    </XText>
  </View>
const tipCard = 
  <View style={{
    width: '48%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    gap:theme.spacing.xs ,
    ...theme.shadows.sm
  }}>
    <XText variant='bodyLight' style={{ color: theme.colors.gray700, }}>
      Tips:
    </XText>
    <XText variant='bodyMedium' style={{ color: theme.colors.gray700 }}>
      $ {homeData?.nonCashTip.toFixed(2) || 0}
    </XText>
  </View>


const totalRevenue = 
  <View style={{
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
    width: CHART_WIDTH,
    minWidth: 280,
    maxWidth: 500,
    alignSelf: 'center',
  }}>
    <XText variant='bodyRegular' style={{ color: theme.colors.gray700 }}>
      Total revenue
    </XText>
    <View style={{ flexDirection: 'row', alignItems: 'center', width: 100, backgroundColor: 'transparent', borderRadius: 50, marginTop: theme.spacing.xs }}>
      {buildColorNote('Sales', theme.colors.primaryMain)}
      {buildColorNote('Tips', theme.colors.secondary)}
    </View>
    <XChart
      data={chartDisplayData}
      width={CHART_WIDTH}
      height={200}
      isLoading={isLoadingChart || chartDisplayData.length === 0}
      barColors={[theme.colors.primaryMain, theme.colors.secondary]}
      labelColor="#333"
      style={{ paddingTop: theme.spacing.md }}
    />
    <View style={{ width: '100%', alignItems: 'center', marginTop: theme.spacing.lg }}>
      <ToggleSwitch value={toggleSwitch} onChange={(val) => {
        useHomeStore.setState({ toggleSwitch: val });
      }} />
    </View>
  </View>
  return (
    <XScreen
      loading={isLoading}
      error={error}
      scrollable={true}
      paddingHorizontal={theme.spacing.md}
      skeleton={<HomeSkeleton/>}
      backgroundColor={theme.colors.background}
      onRefresh={loadData}
      haveBottomTabBar={true}
    >
      {header}
      <View style={{ width: '100%' , gap: theme.spacing.md}}>
        {meEarningsToday}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
          {saleCard}  
          {tipCard}          
        </View>
        {totalRevenue}
        <XText variant='titleRegular' style={{ color: theme.colors.gray800 }}>
          Category
        </XText>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
          <CategoryCard style={{ width: '48%' }} onPress={() => {navigate(ROUTES.TICKET)}} title='Tickets' icon='ticket' color={theme.colors.category1Bg} textColor={theme.colors.white} />
          <CategoryCard style={{ width: '48%' }} onPress={() => {navigate(ROUTES.APPOINTMENT)}} title='Appointment' icon='appointment' color={theme.colors.category2Bg} textColor={theme.colors.white} />
        </View>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
          <CategoryCard style={{ width: '48%' }} onPress={() => {navigate(ROUTES.PAYROLL)}} title='Payroll' icon='payroll' color={theme.colors.category3Bg} textColor={theme.colors.white} />
          <CategoryCard style={{ width: '48%' }} onPress={() => {navigate(ROUTES.REPORT)}} title='Report' icon='report' color={theme.colors.category4Bg} textColor={theme.colors.white} /> 
        </View>

        <View style={{ flexDirection: 'row', width: '100%', 
          backgroundColor: theme.colors.white, borderRadius: theme.borderRadius.md, padding: theme.spacing.sm,
          alignItems: 'center',
          justifyContent: 'space-between',
          ...theme.shadows.sm,
          }}>
          <View style={{ flexDirection: 'column', width: '70%'}}>
            <XText variant='bodyLight' style={{ color: theme.colors.gray700 }}>
              Store:
            </XText>
            <XText variant='titleMedium' style={{ color: theme.colors.gray700 }}>
              {selectedStore?.name ?? "No Select Store"}
            </XText>
          </View>
          <TouchableOpacity onPress={()=>navigate(ROUTES.SWITCH_STORE)}>
            <XIcon name='switchStore' color={theme.colors.gray700} width={40} height={40} />
          </TouchableOpacity>
        </View>
      </View>
    </XScreen>
  );
}


