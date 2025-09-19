import XNoDataView from "@/shared/components/XNoDataView"
import { memo, useMemo, useState } from "react"
import WebView from "react-native-webview"
import { FlatList } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import XText from "@/shared/components/XText";
import { useTheme } from "@/shared/theme";
import { Attendance } from "../types/closeOutResponse";
import { BatchEntity } from "../types/ReportResponse";
import { BatchHistoryItem, TimeSheetItem } from "./itemFlatList";
import { ReportDetailModal } from "./ReportDetailModal";
import { useReportStore } from "../stores/reportStore";
import { useShallow } from "zustand/react/shallow";

interface Props {
  content: string;
}

interface TimeShetProps {
  reportTimeSheet: Attendance[];
}

interface BatchHistoryProps {
  reportBatchHistory: BatchEntity[];
}
export const TechnicianScreen = memo(
  ({ content }: Props) => content ? <WebView
    originWhitelist={['*']}
    source={{ html: content }}
    style={{ width: '100%', flex: 1 }}
    scrollEnabled={true}
  />
    : <XNoDataView />
)


export const SaleReportScreen = memo(
  ({ content }: Props) => content
    ? <WebView
      originWhitelist={['*']}
      source={{ html: content }}
      style={{ width: '100%', flex: 1 }}
      scrollEnabled={true}
    />
    : <XNoDataView />
)

export const TimeSheetScreen = memo(
  ({ reportTimeSheet }: TimeShetProps) => {
    const theme = useTheme()
    const styles = StyleSheet.create({
      itemContainer: {
        borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.white, flexDirection: 'row',
        alignItems: 'center', padding: theme.spacing.md, ...theme.shadows.sm
      },
      itemColumn: { gap: theme.spacing.sm, flexDirection: 'column', alignItems: 'flex-start', paddingLeft: theme.spacing.md },
      clockIn: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
      clockOut: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }
    })

    // --- BẮT ĐẦU THAY ĐỔI ---

    // 1. TẠO STATE ĐỂ QUẢN LÝ MODAL
    // State để lưu trữ nhân viên đang được chọn (để lấy report)
    const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);

    // State để điều khiển việc hiển thị modal
    const [isModalVisible, setIsModalVisible] = useState(false);

    // State control visible contentHtml
    const [isSummary, setIsSummary] = useState(false);
    // 2. TẠO CÁC HÀM ĐỂ XỬ LÝ SỰ KIỆN
    // Hàm được gọi khi một item được nhấn
    const handleItemPress = (item: Attendance) => {
      setSelectedAttendance(item); // Lưu lại item đã chọn
      setIsModalVisible(true);   // Mở modal
    };

    // Hàm để đóng modal
    const handleCloseModal = () => {
      setIsModalVisible(false);
      setSelectedAttendance(null); // Reset item đã chọn
    };
    const { closeOutOwner } = useReportStore(
      useShallow(
        (state) => ({ closeOutOwner: state.closeOutOwner })
      )
    )
    const contentHtml = useMemo(() => {

      var technicianReport = isSummary 
      ? closeOutOwner?.techniciansDetailSummaryReport.find((item) => selectedAttendance?.employeeId == item.employeeId)
      : closeOutOwner?.techniciansReport.find((item) => selectedAttendance?.id == item.id)
      return technicianReport?.report
    }, [closeOutOwner,selectedAttendance, isSummary])
    // --- KẾT THÚC THAY ĐỔI ---
    return reportTimeSheet.length > 0
      ? <>
        <FlatList
          data={reportTimeSheet}
          contentContainerStyle={{ paddingTop: theme.spacing.md, gap: theme.spacing.md }}
          renderItem={({ item }) => <TimeSheetItem item={item} theme={theme} styles={styles} onPress={handleItemPress} />}
        />
        <ReportDetailModal
          visible={isModalVisible}
          onClose={handleCloseModal}
          htmlContent={contentHtml ?? ""}
          onChangeView={()=>setIsSummary(!isSummary)}
        />
      </>
      : <XNoDataView />
  }

)

export const BatchHistoryScreen = memo(
  ({ reportBatchHistory }: BatchHistoryProps) => {
    const theme = useTheme()
    const styles = StyleSheet.create({
      itemContainer: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md, ...theme.shadows.sm },
      headerContainer: {
        backgroundColor: theme.colors.primaryOpacity5, flexDirection: 'row',
        alignItems: 'center', padding: theme.spacing.md, ...theme.shadows.sm
      },
      container: { flex: 1, flexDirection: 'column', paddingTop: theme.spacing.sm }
    })

    const header = useMemo(
      () => <View style={styles.headerContainer}>
        <XText variant="bodyRegular" style={{ flex: 3 }}>Batch Date</XText>
        <XText variant="bodyRegular" style={{ flex: 1 }}>Count</XText>
        <XText variant="bodyRegular" style={{ flex: 1 }}>Return</XText>
      </View>, []
    )

    return reportBatchHistory.length > 0
      ? (
        <View style={styles.container}>
          {header}
          <FlatList
            scrollEnabled={true}
            data={reportBatchHistory}
            contentContainerStyle={{ paddingTop: theme.spacing.md, gap: theme.spacing.md }}
            renderItem={({ item }) => <BatchHistoryItem item={item} styles={styles} />}
          />

        </View>
      )
      : <XNoDataView />
  }

)




