import XText from "@/shared/components/XText";
import { memo } from "react";
import { TouchableOpacity } from "react-native";
import { Attendance } from "../types/closeOutResponse";
import { View } from "react-native";
import XAvatar from "@/shared/components/XAvatar";
import XIcon from "@/shared/components/XIcon";
import { getClockInTime, getClockOutTime, getDisplayName } from "../types/closeOutResponse.utils";
import { BatchEntity } from "../types/ReportResponse";

export const TabBarItem = memo(
  ({ route, focused, jumpTo, theme, styles }: any) => (
    <TouchableOpacity
      onPress={() => jumpTo(route.key)}
      style={[styles.tabBarItem, { backgroundColor: focused ? theme.colors.white : 'transparent' }]}
      activeOpacity={0.8}
    >
      <XText variant="bodyRegular" style={{ color: theme.colors.gray800 }}>{route.title}</XText>
    </TouchableOpacity>
  )
);

export const BatchHistoryItem = memo(
      ({ item, styles }: { item: BatchEntity, styles:any }) => {
        return <View style={styles.itemContainer}>
          <XText variant="bodyLight" style={{ flex: 3 }}>{item.batchDate.toDate()?.format('MM/dd/yyyy HH:mm')}</XText>
          <XText variant="bodyLight" style={{ flex: 1 }}>{item.batchNumber}</XText>
          <XText variant="bodyLight" style={{ flex: 1 }}>{item.transactionReports.transactionsCount}</XText>
        </View>
      }
    )

// Thêm prop `onPress`
interface TimeSheetItemProps {
  item: Attendance;
  styles: any;
  theme: any;
  onPress: (item: Attendance) => void; // Prop mới
}

export const TimeSheetItem = memo(
  ({ item, styles, theme, onPress }: TimeSheetItemProps) => (
    <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.8}>
      <View style={styles.itemContainer}>
        <XAvatar editable={false} uri={item.avatar ?? ""} size={62} />
        <View style={styles.itemColumn}>
          <XText variant="bodyRegular">{getDisplayName(item)}</XText>
          <View style={styles.clockIn}>
            <XIcon name='clockIn' width={16} height={16} color={theme.colors.primaryMain} />
            <XText variant="bodyLight">{getClockInTime(item)}</XText>
          </View>
          <View style={styles.clockOut}>
            <XIcon name='clockOut' width={16} height={16} color={theme.colors.primaryMain} />
            <XText variant="bodyLight">{getClockOutTime(item)}</XText>
          </View>
        </View>
      </View>
    </TouchableOpacity>)
);