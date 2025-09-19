// Trong file chứa component Modal của bạn (ví dụ: tabScreen.tsx)

// THAY ĐỔI DÒNG IMPORT NÀY:
// import { Modal, ... } from "react-native";
import Modal from "react-native-modal"; // <-- SỬ DỤNG MODAL MỚI

import { View, Button, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import WebView from "react-native-webview";
import XNoDataView from "@/shared/components/XNoDataView";
import XIcon from "@/shared/components/XIcon";
import { useTheme } from "@/shared/theme";
import { XRow } from "@/shared/components/XRow";
import XText from "@/shared/components/XText";

interface ReportDetailModalProps {
  visible: boolean;
  onClose: () => void;
  onChangeView: () => void;
  htmlContent: string | null;
}

export const ReportDetailModal = ({ visible, onClose, htmlContent, onChangeView }: ReportDetailModalProps) => {
    const theme = useTheme()
    return (
    // SỬ DỤNG COMPONENT MODAL MỚI
    <Modal
      // 1. Dùng `isVisible` thay cho `visible`
      isVisible={visible}
      
      // 2. Dùng các prop này để xử lý việc đóng modal
      onBackdropPress={onClose} // Khi người dùng nhấn vào nền mờ
      onBackButtonPress={onClose} // Khi người dùng nhấn nút Back của Android
      
      // (Tùy chọn) Thêm hiệu ứng cho đẹp
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriver={true} // Bật driver gốc
        useNativeDriverForBackdrop={true} // Bật driver gốc cho cả nền mờ
        hideModalContentWhileAnimating={true}
      // Quan trọng: Để modal không chiếm toàn bộ màn hình
      style={{ margin: 0, justifyContent: 'flex-end' }}
    >
      {/* 3. Nội dung của modal bây giờ là một View bình thường */}
      <SafeAreaView 
        style={{ 
          height: '90%', // Chiếm 90% chiều cao màn hình
          backgroundColor: 'white', 
          borderTopLeftRadius: 20, 
          borderTopRightRadius: 20 
        }}
      >
        <XRow justify="flex-end" align="center" gap={10}
            style={{ 
            padding: 10, 
            borderBottomWidth: 1, 
            borderBottomColor: '#eee'
        }}>
            <TouchableOpacity onPress={onChangeView}>
                <XIcon name="invoices"></XIcon>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onClose}>
                <XText variant="titleRegular" color={theme.colors.primaryMain}>Close</XText>
            </TouchableOpacity>
        </XRow>
        
        {htmlContent && !htmlContent.includes("No tickets for this date") ? (
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            style={{ flex: 1 }}
          />
        ) : (
          <XNoDataView message="No tickets for this date" />
        )}
      </SafeAreaView>
    </Modal>
  );
};