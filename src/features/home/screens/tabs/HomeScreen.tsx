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
      return <XRow>
        <XText variant='bodyRegular' style={{ color: theme.colors.gray800 }}>
          ME Earnings Today
        </XText>

        
      </XRow>
      
    },[theme]
  )
  // const dropdownOptions = [
  //   "This week",
  //   "Last week",
  //   "This month",
  //   "Last month",
  // ]
  // const chartFilter = ()=>
  // <View style={{ 
  //   position: 'absolute',
  //   top:theme.spacing.md,
  //   right: theme.spacing.sm,
  //   width: "35%"
  //   }}>
  //   <XDropdown style={{width:'100%'}}
  //     value={{label: "This week", value: "This week"}}
  //     options={dropdownOptions.map((e)=>{return{label: e, value: e}})}
  //     onSelect= {()=>{}}
      
  //     renderLabel={(value)=>{
  //       return <XInput
  //           value={value?.label}
  //           onChangeText={() => {}}
  //           iconRight="downArrowBlack"
  //           editable={false}
  //           pointerEvents="none"
  //           containerStyle={{backgroundColor: theme.colors.white ,borderColor: theme.colors.blackOpacity10, borderRadius: 12}}
  //           textInputStyle={{...theme.typography.captionLight, color: theme.colors.gray700, paddingVertical: theme.spacing.sm, paddingHorizontal: 0 }}
            
  //         />
          
  //     }}
  //   >
  //   </XDropdown>
  // </View>
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
      <View style={{ width: '100%' , gap: theme.spacing.md}}>
        {meEarningsToday}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
          <StatCard title="Sale" value={homeData?.totalSale??0} />
          <StatCard title="Tips" value={homeData?.nonCashTip??0} />     
        </View>
        <TotalRevenueChart 
          chartDisplayData={chartDisplayData}
          isLoadingChart={isLoadingChart}
          toggleSwitchValue={toggleSwitch}
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

       <StoreSwitcherCard 
          storeName={currentStoreName}
          onPressSwitch={handleSwitchStore}
        />
      </View>
    </XScreen>
  );
}


