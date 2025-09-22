import React, {  useCallback, useEffect, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import XText from '../../../../shared/components/XText';
import XScreen from '../../../../shared/components/XScreen';
import { useShallow } from 'zustand/react/shallow';
import XIcon from '../../../../shared/components/XIcon';
import { useTheme } from '../../../../shared/theme/ThemeProvider';
import CategoryCard from '../../components/CategoryCard';
import { ROUTES } from '../../../../app/routes';
import {  homeSelectors, useHomeStore } from '../../stores/homeStore';
import HomeSkeleton from '../../components/HomeSkeleton';
import { navigate } from '@/app/NavigationService';
import { getNotifications } from '@/shared/services/FirebaseNotificationService';
import { LoginResult } from '@/features/auth/usecase/AuthUsecase';
import { StatCard } from '../../components/home/StateCard';
import { TotalRevenueChart } from '../../components/home/TotalRevenueChart';
import { HomeHeader } from '../../components/home/HomeHeader';
import { StoreSwitcherCard } from '../../components/home/StoreSwitcherCard';
import { XRow } from '@/shared/components/XRow';
import { HomeAPI } from '../../services/HomeApi';
import { SummaryRequest } from '../../types/HomeRequest';
import { LoginEntity } from '@/features/auth/types/AuthTypes';

export default function HomeScreen() {
  const { homeData, 
    isLoading, 
    error, 
    getChartData,  
    isLoadingChart, 
    toggleSwitch, 
    json, 
    chartDisplayData, 
    selectedStore, 
    notificationCount, 
    setNotificationCount,
    initData
   } = useHomeStore(
    useShallow((state) => ({
      homeData: homeSelectors.selectHomeData(state),
      isLoading: homeSelectors.selectIsLoading(state),
      error: homeSelectors.selectError(state),
      getChartData: homeSelectors.selectGetChartData(state),
      isLoadingChart: homeSelectors.selectIsLoadingChart(state),
      toggleSwitch: homeSelectors.selectToggleSwitch(state),
      json: homeSelectors.selectJson(state),
      chartDisplayData: homeSelectors.selectChartDisplayData(state),
      selectedStore: homeSelectors.selectSelectedStore(state),
      notificationCount: homeSelectors.selectNotificationCount(state),
      setNotificationCount: homeSelectors.selectSetNotificationCount(state),
      initData: homeSelectors.selectInitData(state)
    }))
  );

  const theme = useTheme();  
  
  useEffect(() => {
    initData();
    getNotifications().then((list) => {
      setNotificationCount(list.filter((e)=>!e.read).length);
    });
  }, [selectedStore?.storeId]);
  
  useEffect(() => {
    if(json==null) return
    getChartData()
  }, [toggleSwitch]);
  
  const meEarningsToday = useMemo(
    ()=>{
      return (
        <XRow justify='space-between' align='center'>
          <XText variant='bodyRegular' style={{ color: theme.colors.gray800 }}>
            ME Earnings Today
          </XText>
          <TouchableOpacity onPress={()=>{
            navigate(ROUTES.SUMMARY)
          }}>
              <XRow style={{borderWidth:1, borderRadius: theme.spacing.sm, padding: theme.spacing.xs, borderColor: theme.colors.primaryOpacity25, backgroundColor: theme.colors.primaryOpacity5}}>
                <XIcon name="chartBar" height={18}></XIcon>
                <XText variant='bodyRegular'>Explore</XText>
            </XRow>
          </TouchableOpacity>
          
        </XRow>
      )
      
    },[theme]
  )
  
  // 2. Tính toán storeName một lần bằng useMemo
  const currentStoreName = useMemo(() => {
    return selectedStore?.storeName ?? (json as LoginResult)?.merchantInfo.dbaName ?? "";
  }, [selectedStore?.storeId, json]);
  
  // 3. Tạo một hàm callback ổn định cho việc điều hướng
  const handleSwitchStore = useCallback(() => {
    navigate(ROUTES.SWITCH_STORE);
  }, []);
  return (
    <XScreen
      loading={isLoading}
      error={error}
      scrollable={true}
      paddingHorizontal={theme.spacing.md}
      skeleton={<HomeSkeleton/>}
      backgroundColor={theme.colors.background}
      onRefresh={initData}
      haveBottomTabBar={true}
    >
      <HomeHeader 
        avatarUri={homeData?.employeeInfo?.avatar}
        firstName={homeData?.employeeInfo?.firstName}
        lastName={homeData?.employeeInfo?.lastName}
        notificationCount={notificationCount}
      />
      <View style={{ width: '100%' , gap: theme.spacing.sm, marginTop: theme.spacing.md}}>
        {meEarningsToday}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
          <StatCard title="Sale" value={homeData?.totalSale??0} />
          <StatCard title="Tips" value={homeData?.nonCashTip??0} />     
        </View>
        <TotalRevenueChart 
          chartDisplayData={chartDisplayData}
          isLoadingChart={isLoadingChart}
          toggleSwitchValue={toggleSwitch}
          showToggle
        />
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
        {
          (json as LoginEntity)?.switchableStores?.length>0 &&
          <StoreSwitcherCard 
            storeName={currentStoreName}
            onPressSwitch={handleSwitchStore}
          />
        }
       
      </View>
    </XScreen>
  );
}


