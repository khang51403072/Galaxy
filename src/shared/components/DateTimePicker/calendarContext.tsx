

// file: src/components/calendar/CalendarContext.tsx

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { getMonthMatrix, getYearMatrix } from './util';
import { StyleProps } from 'react-native-reanimated';
import { Theme, useTheme } from '@/shared/theme';
import { StyleSheet } from 'react-native';
interface CalendarStyleProps {
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
}

// --- 1. ĐỊNH NGHĨA "HỢP ĐỒNG" CONTEXT ---
//    Nó mô tả tất cả những gì Provider sẽ cung cấp.
export type CalendarView = 'day' | 'month' | 'year' | 'time'; // Added 'time'

export const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];


interface CalendarContextType {
    // State
    selectedDate: Dayjs;
    displayDate: Dayjs;
    currentView: CalendarView;
    monthMatrix: (Dayjs | null)[][];
    prevMonthMatrix: (Dayjs | null)[][];
    nextMonthMatrix: (Dayjs | null)[][];
    yearMatrix: (number)[][];
    styles: CalendarStyleProps,
    theme: Theme;
    // Actions / Handlers
    handleSelectDay: (day: Dayjs) => void;
    handleMonthHeaderPress: () => void;
    handleYearHeaderPress: () => void;
    handleDayHeaderPress: () => void;
    handleSelectMonth: (monthIndex: number) => void;
    handleSelectYear: (year: number) => void;
    handleNext: () => void;
    handlePrev: () => void;
    setDisplayDate: (date: Dayjs) => void;
    handleTimeHeaderPress: () => void; // New
    handleSelectTime: (hour: number, minute: number, period: 'AM' | 'PM') => void; // New
    onDateChange: (date: Dayjs) => void
}

// Tạo Context
const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

// Hook tùy chỉnh để component con dễ dàng sử dụng context
export const useCalendarContext = () => {
    const context = useContext(CalendarContext);
    if (!context) {
        throw new Error('useCalendarContext must be used within a CalendarProvider');
    }
    return context;
};


// --- 2. TẠO PROVIDER COMPONENT ---
interface CalendarProviderProps {
    children: ReactNode;
    initialDate?: Date;
    onDateChange: (date: Dayjs) => void;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children, initialDate = new Date(),onDateChange }) => {
    // --- TẤT CẢ STATE VÀ LOGIC ĐƯỢC CHUYỂN VÀO ĐÂY ---
    const [selectedDate, setSelectedDate] = useState(dayjs(initialDate));
    const [displayDate, setDisplayDate] = useState(dayjs(initialDate));
    const [currentView, setCurrentView] = useState<CalendarView>('day');

    const handleNext = useCallback(() => {
        setDisplayDate(prev => {
            switch (currentView) {
                case 'year': return prev.add(12, 'year');
                case 'month': return prev.add(1, 'year');
                case 'time': return prev;
                case 'day': default: return prev.add(1, 'month');
                
            }
        });
    }, [currentView]);
    const handlePrev = useCallback(() => {
        setDisplayDate(prev => {
            switch (currentView) {
                case 'year': return prev.subtract(12, 'year');
                case 'month': return prev.subtract(1, 'year');
                case 'day': return prev.subtract(1, 'month');
                case 'time': return prev;
            }
        });
    }, [currentView]);
    const handleSelectDay = useCallback((day: Dayjs) => {
        setSelectedDate(day);
        setDisplayDate(day);
    }, []);

    const handleMonthHeaderPress = useCallback(() => {
        setCurrentView('month')
    }, []);
    const handleYearHeaderPress = useCallback(() => {
        setCurrentView('year')
    }, []);

    const handleDayHeaderPress = useCallback(() => {
        setCurrentView('day')
    }, [])

    const handleSelectMonth = useCallback((monthIndex: number) => {
        setDisplayDate(prev => prev.month(monthIndex));
        setCurrentView('day');
    }, []);

    const monthMatrix = useMemo(() => {
        return getMonthMatrix(displayDate);
    }, [displayDate])

    const prevMonthMatrix = useMemo(() => getMonthMatrix(displayDate.subtract(1, 'month')), [displayDate]);
    const nextMonthMatrix = useMemo(() => getMonthMatrix(displayDate.add(1, 'month')), [displayDate]);

    // Tính toán dải năm để hiển thị
    const yearMatrix = useMemo(() => getYearMatrix(displayDate), [displayDate]);
    // --- HÀM HANDLER MỚI ---
    const handleSelectYear = useCallback((year: number) => {
        setDisplayDate(prev => prev.year(year));
        setCurrentView('month'); // Chuyển sang view tháng sau khi chọn năm
    }, []);

    // New: Handler for time header press
    const handleTimeHeaderPress = useCallback(() => {
        setCurrentView('time');
    }, []);

    // New: Handler to select time and update selectedDate
    const handleSelectTime = useCallback((hour: number, minute: number, period: 'AM' | 'PM') => {
        let adjustedHour = hour;
        if (period === 'PM' && hour < 12) adjustedHour += 12;
        if (period === 'AM' && hour === 12) adjustedHour = 0;
        const newDate = selectedDate.hour(adjustedHour).minute(minute);
        setSelectedDate(newDate);
        setDisplayDate(newDate);
       // Back to day view
       onDateChange(newDate)
    }, [selectedDate]);
    //
    const theme = useTheme()

    const styles: CalendarStyleProps = useMemo(
        () => StyleSheet.create({
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
        }), [theme])
    // Đóng gói tất cả giá trị vào một object để truyền đi
    const value = useMemo(() => ({
        selectedDate,
        displayDate: displayDate,
        currentView,
        monthMatrix,
        yearMatrix,
        prevMonthMatrix,nextMonthMatrix,styles,
        theme,
        handleSelectDay,
        handleDayHeaderPress,
        handleMonthHeaderPress,
        handleYearHeaderPress,
        handleSelectMonth,
        handleSelectYear,
        handleNext,
        handlePrev,
        setDisplayDate,
        handleTimeHeaderPress,
        handleSelectTime,onDateChange,
        
    }), [selectedDate, displayDate, currentView, monthMatrix, yearMatrix,styles,theme,
        handleSelectDay, handleDayHeaderPress, handleMonthHeaderPress, 
        handleYearHeaderPress, handleSelectMonth, handleSelectYear, handleNext, handlePrev,
        handleTimeHeaderPress, handleSelectTime,onDateChange]);

    return (
        <CalendarContext.Provider value={value}>
            {children}
        </CalendarContext.Provider>
    );
};