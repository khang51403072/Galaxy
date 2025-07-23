import React, { useState, useEffect, useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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
import { ChartEntity } from '../../types/HomeResponse';
import { XSkeleton } from '../../../../shared/components/XSkeleton';
import { navigate } from '@/app/NavigationService';

export default function HomeScreen() {
  const { homeData, isLoading, error, getHomeData, getChartData,  isLoadingChart, toggleSwitch, json, chartDisplayData, setChartDisplayData } = useHomeStore(
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
      setChartDisplayData: state.setChartDisplayData,
    }))
  );
  
  const theme = useTheme();  

  // Xóa state chartData cục bộ
  // const [chartData, setChartData] = useState<{label: string, value: number[]}[]>([
  //   { label: 'Mon', value: [20, 40] },
  //   { label: 'Tue', value: [35, 25] },
  //   { label: 'Wed', value: [30, 50] },
  //   { label: 'Thu', value: [80, 60] },
  //   { label: 'Fri', value: [20, 30] },
  // ]);

  useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    if(json==null) return
    getChartData().then((result) => {
      if(isSuccess(result)) {
        loadData2Chart(result.value);        
      }
    });
  }, [toggleSwitch]);
  
  const loadData = async () => {
    await getHomeData();
    getChartData().then((result) => {
      if(isSuccess(result)) {
        loadData2Chart(result.value);        
      }
    });
  };

  // Refactor: set chartDisplayData vào store
  const loadData2Chart = (data: ChartEntity[]) => {
    let displayData;
    if(toggleSwitch == 'week') {
      displayData = data.map(item => {
        return {
          label: item.dayOfWeek.substring(0, 3),
          value: [item.saleAmount, -item.nonCashTipAmount]
        }
      });
    } else {
      displayData = data.map(item => {
        return {
          label: item.weekStartDate?.dateOfMonth() +"-"+ item.weekEndDate?.dateOfMonth(),
          value: [item.saleAmount, item.nonCashTipAmount]   
        }
      });
    }
    setChartDisplayData(displayData);
  }


  const buildColorNote = (text: string, color: string)=>{
    return <View style={{  flexDirection: 'row', alignItems: 'center', width: 100, backgroundColor: 'transparent', borderRadius: 50 }}>
      <View style={{ width: 10, height: 10, backgroundColor: color, borderRadius: 50 }}>
        
      </View>
      <XText variant='content300' style={{ color: theme.colors.gray800, marginLeft: theme.spacing.xs }}>
          {text}
        </XText>
    </View>;
  };
  const ToggleSwitch = ({ value, onChange }: { value: 'week' | 'month', onChange: (val: 'week' | 'month') => void }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#eee',
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
          <Text style={{ color: value === 'week' ? '#222' : '#888', fontWeight: '500' }}>Week</Text>
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
          <Text style={{ color: value === 'month' ? '#222' : '#888', fontWeight: '500' }}>Month</Text>
        </TouchableOpacity>
      </View>
    );
  };

  
  const chartSkeleton = () => {
    return (
      <View style={{ 
        padding: 16,
        backgroundColor: theme.colors.white,
        borderRadius: 8,
        ...theme.shadows.sm,
        marginBottom: 20
      }}>
        <XSkeleton width={120} height={18} borderRadius={4} style={{ marginBottom: 12 }} />
        
        {/* Color Notes Skeleton */}
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
            <XSkeleton width={10} height={10} borderRadius={5} />
            <XSkeleton width={40} height={12} borderRadius={4} style={{ marginLeft: 8 }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <XSkeleton width={10} height={10} borderRadius={5} />
            <XSkeleton width={40} height={12} borderRadius={4} style={{ marginLeft: 8 }} />
          </View>
        </View>
        
        <XSkeleton width="100%" height={200} borderRadius={8} />
        {/* Skeleton cho toggle switch */}
        <View style={{ width: '100%', alignItems: 'center', marginTop: theme.spacing.md }}>
          <XSkeleton width={60} height={32} borderRadius={16} style={{ width: "60%",
          height: 32,
          paddingHorizontal: theme.spacing.xs,
          paddingVertical: theme.spacing.xs, }}/>
        </View>
      </View>
    )
  }
  

  const header = 
  <View style={{ width: '100%', height: '10%', backgroundColor: theme.colors.background,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
  <XAvatar
    editable = {false}
    size={40}
    uri={homeData?.employeeInfo?.avatar|| undefined}
  />
  <View style={{ flex: 1, flexDirection: 'row',  justifyContent: 'flex-start', paddingLeft: 10}}>
    <XText variant='helloText300' style={{ color: theme.colors.gray800 }}>
      Hi! 
    </XText>
    <XText variant='helloText400' style={{ color: theme.colors.gray800}}>
      {homeData?.employeeInfo?.firstName+ " " + homeData?.employeeInfo?.lastName}
    </XText>  
  </View>
  <TouchableOpacity onPress={()=>navigate(ROUTES.NOTIFICATIONS)}>
    <XIcon  name='bell' width={24} height={24} color={theme.colors.primary} />

  </TouchableOpacity>
  
</View>

const meEarningsToday = 
<XText variant='helloText400' style={{ color: theme.colors.gray800, marginBottom: theme.spacing.md }}>
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
    ...theme.shadows.sm
  }}>
    <XText variant='saleAndTip300' style={{ color: theme.colors.gray800, marginBottom: theme.spacing.xs }}>
      Sale:
    </XText>
    <XText variant='saleAndTip500' style={{ color: theme.colors.gray800 }}>
      $ {homeData?.totalSale || 0}
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
    ...theme.shadows.sm
  }}>
    <XText variant='saleAndTip300' style={{ color: theme.colors.gray800, marginBottom: theme.spacing.xs }}>
      Tips:
    </XText>
    <XText variant='saleAndTip500' style={{ color: theme.colors.gray800 }}>
      $ {homeData?.nonCashTip || 0}
    </XText>
  </View>


const chart = 
  <View style={{
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    ...theme.shadows.sm
  }}>
    <XText variant='helloText400' style={{ color: theme.colors.gray800 }}>
      Total revenue
    </XText>
    <View style={{ flexDirection: 'row', alignItems: 'center', width: 100, backgroundColor: 'transparent', borderRadius: 50, marginTop: theme.spacing.xs }}>
      {buildColorNote('Sales', theme.colors.primary)}
      {buildColorNote('Tips', theme.colors.cyan)}

    </View>

    <XChart
      data={chartDisplayData}
      width={320}
      height={200}
      barColors={[theme.colors.primary, theme.colors.cyan]}
      labelColor="#333"
      style={{ paddingTop: theme.spacing.md }}
    />
    <View style={{ width: '100%', alignItems: 'center', marginTop: theme.spacing.md }}>
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
      paddingHorizontal={16}
      skeleton={<HomeSkeleton/>}
      backgroundColor={theme.colors.background}
      onRefresh={loadData}
      haveBottomTabBar={true}
    >
      {header}
      <View style={{ width: '100%',  }}>
        {meEarningsToday}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.md }}>
          {saleCard}  
          {tipCard}          
        </View>
        {isLoadingChart ? chartSkeleton() : chart}
        <XText variant='helloText400' style={{ color: theme.colors.gray800, marginVertical: theme.spacing.md }}>
          Category
        </XText>
        <View style={{ flexDirection: 'row' , width: '100%', justifyContent: 'space-between'}}>
          <CategoryCard style={{ width: '48%' }} onPress={() => {navigate(ROUTES.TICKET)}} title='Tickets' icon='ticket' color={theme.colors.skyBlue} textColor={theme.colors.white} />
          <CategoryCard style={{ width: '48%' }} onPress={() => {navigate(ROUTES.APPOINTMENT)}} title='Appointment' icon='appointment' color={theme.colors.purple} textColor={theme.colors.white} />
        </View>
        <View style={{ marginTop: theme.spacing.md, flexDirection: 'row' , width: '100%', justifyContent: 'space-between'}}>
          <CategoryCard style={{ width: '48%' }} onPress={() => {navigate(ROUTES.PAYROLL)}} title='Payroll' icon='payroll' color={theme.colors.indigoBlue} textColor={theme.colors.white} />
          <CategoryCard style={{ width: '48%' }} onPress={() => {navigate(ROUTES.REPORT)}} title='Report' icon='report' color={theme.colors.blue} textColor={theme.colors.white} /> 
        </View>
      </View>
    </XScreen>
  );
}


