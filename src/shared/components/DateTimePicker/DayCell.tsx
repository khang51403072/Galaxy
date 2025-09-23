// src/components/CalendarDay.tsx
import React, { memo, useMemo } from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import dayjs from 'dayjs';
import { useCalendarContext } from './calendarContext';
import XText from '../XText';
import { useTheme } from '@/shared/theme';

interface CalendarDayProps {
    day: dayjs.Dayjs | null;
    isSelected: boolean;
}

const CalendarDay = ({ day, isSelected }: CalendarDayProps) => {
    const { handleSelectDay, styles } = useCalendarContext();
    

    if (day === null) {
        // Ô trống cho các ngày ngoài tháng
        return <View style={styles.dayCellContainer} />;
    }

    return (
        <Pressable
            style={[
                styles.dayCellContainer,
                isSelected && styles.dayCellContainerSelected,
            ]}
            onPress={() => handleSelectDay(day)}
        >
            <XText style={[
                styles.dayCellText,
                isSelected && styles.dayCellTextSelected,
            ]}>
                {day.date()}
            </XText>
        </Pressable>
    );
};



export default memo(CalendarDay);