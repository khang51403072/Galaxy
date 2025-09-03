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
import XDropdown, { DropdownOption } from '@/shared/components/XDropdown';
import XInput from '@/shared/components/XInput';
import { LoginResult } from '@/features/auth/usecase/AuthUsecase';
import { ToggleSwitch } from '../../components/home/TogleSwitch';
import { ColorNote } from '../../components/home/ChartColorNote';

export default function HomeScreen() {
  const { homeData, 
    isLoading, 
    error, 
    getHomeData, 
    getChartData,  
    isLoadingChart, 
    toggleSwitch, 
    json, 
    chartDisplayData, 
    selectedStore, 
    notificationCount, 
    setNotificationCount,
    getCompanyProfile,
    initData
   } = useHomeStore(
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
      getCompanyProfile: homeSelectors.selectGetCompanyProfile(state),
      initData: homeSelectors.selectInitData(state)
    }))
  );
  const theme = useTheme();  
  

  useEffect(() => {
    initData();
    getNotifications().then((list) => {
      setNotificationCount(list.filter((e)=>!e.read).length);
    });
  }, [selectedStore]);
  
  useEffect(() => {
    if(json==null) return
    getChartData()
  }, [toggleSwitch]);
  
  


  
  

  
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

  const dropdownOptions = [
    "This week",
    "Last week",
    "This month",
    "Last month",
  ]
  const chartFilter = ()=>
  <View style={{ 
    position: 'absolute',
    top:theme.spacing.md,
    right: theme.spacing.sm,
    width: "35%"
    }}>
    <XDropdown style={{width:'100%'}}
      value={{label: "This week", value: "This week"}}
      options={dropdownOptions.map((e)=>{return{label: e, value: e}})}
      onSelect= {()=>{}}
      
      renderLabel={(value)=>{
        return <XInput
            value={value?.label}
            onChangeText={() => {}}
            iconRight="downArrowBlack"
            editable={false}
            pointerEvents="none"
            containerStyle={{backgroundColor: theme.colors.white ,borderColor: theme.colors.blackOpacity10, borderRadius: 12}}
            textInputStyle={{...theme.typography.captionLight, color: theme.colors.gray700, paddingVertical: theme.spacing.sm, paddingHorizontal: 0 }}
            
          />
          
      }}
    >
    </XDropdown>
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
    <View style={{ 
      gap:10, flexDirection: 'row', 
      alignItems: 'center',
      backgroundColor: 'transparent', borderRadius: 50, 
      marginTop: theme.spacing.xs }}>
      <ColorNote text="Sales" color={theme.colors.primaryMain} />
      <ColorNote text="Tips" color={theme.colors.secondary} />
    </View>
    {chartFilter()}
   
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
      <ToggleSwitch 
          value={toggleSwitch} 
          onChange={(val) => {
            useHomeStore.setState({ toggleSwitch: val });
          }} 
        />
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
      onRefresh={initData}
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
              {selectedStore?.storeName ?? (json as LoginResult)?.merchantInfo.dbaName??""}
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


