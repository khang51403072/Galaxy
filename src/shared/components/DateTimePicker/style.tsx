import { Theme } from "@/shared/theme"
import { StyleSheet } from "react-native"
import { StyleProps } from "react-native-reanimated"

 export interface CalendarStyleProps {
    calendarContainer: StyleProps,
    calendarHeader: StyleProps,
    dayCellContainer: StyleProps,
    dayCellText: StyleProps,
    dayCellTextSelected: StyleProps,
    dayCellContainerSelected: StyleProps,
    dayViewContainer: StyleProps,
    weekDayText: StyleProps,
    monthViewContainer: StyleProps,
    monthCellContainer: StyleProps,
    selectedMonth: StyleProps,
    yearViewContainer: StyleProps,
    yearCellContainer: StyleProps,
    selectedYearContainer: StyleProps,
    timeViewContainer: StyleProps,
    picker: StyleProps,
    wheelContainer: StyleProps,
    wheelIndicator: StyleProps,
    wheelItemContainer: StyleProps,
    wheelText: StyleProps
}
export const calendarStyles = (theme: Theme):CalendarStyleProps => StyleSheet.create({
            calendarContainer: {
                backgroundColor: theme.colors.white,
                borderRadius: theme.spacing.sm,
                ...theme.shadows.md
            },
            calendarHeader: {
                marginBottom: theme.spacing.md,
                paddingHorizontal: theme.spacing.lg,
                paddingVertical: theme.spacing.sm,
                backgroundColor: theme.colors.primaryMain
            },
            dayCellContainer: {
                flex: 1,
                aspectRatio: 1, // Để các ô là hình vuông
                justifyContent: 'center',
                alignItems: 'center',
                margin: 2,
            },
            dayCellContainerSelected: {
                backgroundColor: theme.colors.primaryMain,
                borderRadius: 50, // Bo tròn
            },
            dayCellText: {
                color: theme.colors.gray700,
                ...theme.typography.bodyRegular
            },
            dayCellTextSelected: {
                color: theme.colors.white,
                ...theme.typography.bodyRegular
            },
            dayViewContainer: { overflow: 'hidden' },
            weekDayText: { flex: 1, textAlign: 'center', marginBottom: theme.spacing.sm },
            monthViewContainer: {
                flexWrap: 'wrap',
                paddingTop: theme.spacing.sm,
            },
            monthCellContainer: {
                paddingVertical: theme.spacing.md,
                borderRadius: theme.spacing.sm,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.colors.primaryOpacity5,
                width: '30%',
                padding: theme.spacing.xs,
            },
            selectedMonth: {
                backgroundColor: theme.colors.primaryMain,
            },
            yearViewContainer: {
                flexWrap: 'wrap',
            },
            yearCellContainer: {
                width: '30%',
                paddingVertical: theme.spacing.md,
                borderRadius: theme.spacing.sm,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.colors.primaryOpacity5,
                marginVertical: theme.spacing.xs,
            },
            selectedYearContainer: {
                backgroundColor: theme.colors.primaryMain,
            },
            timeViewContainer: {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
            },
            picker: {
                flex: 1,
                height: 200,
                
            },

            wheelContainer: {
                width: "28%",
                alignItems: "center",
                overflow: 'hidden', // To clip rotated items
            },
            wheelIndicator: {
                position: 'absolute',
                left: 0,
                right: 0,
                backgroundColor: theme.colors.primaryMain,
                borderRadius: 10,
                
            },
            wheelItemContainer: {
                justifyContent: 'center',
                alignItems: 'center',
            },
            wheelText: {
                color: theme.colors.gray700,
                ...theme.typography.titleMedium
            },
        })