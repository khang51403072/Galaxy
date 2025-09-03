import React, { memo, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import XText from '@/shared/components/XText';
import XChart from '@/shared/components/XChartBar';
import { ToggleSwitch } from './TogleSwitch'; // Giả sử bạn đã tách
import { ColorNote } from './ChartColorNote';
import { useTheme } from '@/shared/theme';
import { useHomeStore } from '../../stores/homeStore';


// Component này chỉ nhận các props cần thiết, không cần biết về toàn bộ store
interface TotalRevenueChartProps {
  chartDisplayData: any[]; // Cần định nghĩa type cụ thể hơn
  isLoadingChart: boolean;
  toggleSwitchValue: 'week' | 'month';
}

export const TotalRevenueChart = memo(({
  chartDisplayData,
  isLoadingChart,
  toggleSwitchValue
}: TotalRevenueChartProps) => {
  const theme = useTheme();
  const window = useWindowDimensions();
  const CHART_WIDTH = Math.max(320, Math.min(window.width - 32, 500));
    const style = useMemo(()=>
        StyleSheet.create({
            container: {
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
            },
            colorNote: {
                gap:10, flexDirection: 'row', 
                alignItems: 'center',
                backgroundColor: 'transparent', borderRadius: 50, 
                marginTop: theme.spacing.xs 
            },
            chart: { paddingTop: theme.spacing.md },
            toggleSwitch: { width: '100%', alignItems: 'center', marginTop: theme.spacing.lg }
    }),[theme]) 
    return (
    <View style={style.container}>
      <XText variant='bodyRegular'>Total revenue</XText>
      <View style={style.colorNote}>
        <ColorNote text="Sales" color={theme.colors.primaryMain} />
        <ColorNote text="Tips" color={theme.colors.secondary} />
      </View>      
      <XChart
        data={chartDisplayData}
        width={CHART_WIDTH}
        height={200}
        isLoading={isLoadingChart || chartDisplayData.length === 0}
        barColors={[theme.colors.primaryMain, theme.colors.secondary]}
        labelColor="#333"
        style={style.chart}
      />
      <View style={style.toggleSwitch}>
        <ToggleSwitch
          value={toggleSwitchValue}
          onChange={(val) => {
            useHomeStore.setState({ toggleSwitch: val });
          }}
        />
      </View>
    </View>
  );
})