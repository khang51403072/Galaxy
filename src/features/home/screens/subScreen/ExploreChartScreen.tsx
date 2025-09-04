import XDropdown, { DropdownOption } from "@/shared/components/XDropdown"
import XInput from "@/shared/components/XInput"
import { XRow } from "@/shared/components/XRow"
import XScreen from "@/shared/components/XScreen"
import XText from "@/shared/components/XText"
import { useTheme } from "@/shared/theme"
import { StatCard } from "../../components/home/StateCard"
import { TotalRevenueChart } from "../../components/home/TotalRevenueChart"
import { useShallow } from "zustand/react/shallow"
import { chartExploreState, dropdownOptions, useChartExploreStore } from "../../stores/chartExploreStore"
import { useCallback, useEffect, useMemo } from "react"
import { ChartFilter } from "../../components/summary/ChartFilter"
import XIcon from "@/shared/components/XIcon"

export const ExloreChartScreen = () => {
    const theme = useTheme()
    const {
        chartData,
        chartDisplayData,
        isLoading,
        toggleSwitch,
        getChartExplore,
        reportData,
        selectedOption,
        setSelectedOption
    } = useChartExploreStore(useShallow(
        (state:chartExploreState) => 
            ({
                chartData: state.chartData,
                chartDisplayData:  state.chartDisplayData,
                isLoading: state.isLoading,
                toggleSwitch: state.toggleSwitch,
                getChartExplore: state.getChartExplore,
                reportData: state.reportData,
                selectedOption: state.selectedOption,
                setSelectedOption: state.setSelectedOption
            })
        ))
    useEffect(
        ()=>{
            console.log('chartExplore')
            getChartExplore(dropdownOptions[0])
        },
        []
    )

    const onSelect = useCallback(
        (option: DropdownOption)=>{
            setSelectedOption(option)
            getChartExplore(option.value)
        },[]
    )

    return <XScreen  title="Explore" style={{gap:theme.spacing.md, paddingTop: theme.spacing.md }}>
         <ChartFilter onSelect= {onSelect} selectedOption= {selectedOption}/>
         <XRow align="center">
            <XIcon name='cash' height={20} width={20} color={theme.colors.primaryMain}></XIcon>
            <XText variant="titleRegular">Summary</XText>
         </XRow>
         <XRow style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
            <StatCard title="Sale" value={reportData?.totalSales??0} />
            <StatCard title="Tips" value={reportData?.totalTips??0} />     
        </XRow>

        <TotalRevenueChart 
            chartDisplayData={chartDisplayData}
            isLoadingChart={isLoading}
            toggleSwitchValue={toggleSwitch}
            showToggle = {false}
            chartHeight={300}
        />
    </XScreen>
}