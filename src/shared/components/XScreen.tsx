/*
 * XScreen - Universal Screen Wrapper Component
 * -------------------------------------------
 * Mục đích:
 *   - Đóng gói layout chuẩn cho mọi màn hình trong app (header, content, scroll, loading, error, keyboard, safe area...)
 *   - Đảm bảo code UI nhất quán, dễ maintain, dễ mở rộng.
 *
 * Cách sử dụng:
 *   Ví dụ:
 *     XScreen title="Tiêu đề" scrollable loading={{isLoading}} error={{errorMsg}}
 *       ...Nội dung màn hình...
 *     /XScreen
 *
 * Props chính:
 *   - title: string (hiện header nếu có)
 *   - showHeader: boolean (ẩn/hiện header)
 *   - loading: boolean (hiện skeleton hoặc spinner)
 *   - error: string | null (hiện alert lỗi)
 *   - scrollable: boolean (bọc ScrollView)
 *   - keyboardAvoiding: boolean (bọc KeyboardAvoidingView)
 *   - dismissKeyboard: boolean (bọc TouchableWithoutFeedback)
 *   - safeArea: boolean (tự động padding top/bottom theo device)
 *   - onRefresh, refreshing: dùng cho pull-to-refresh
 *   - style, backgroundColor, padding, ...: custom layout
 *   - rightIcon: hiện icon/component bên phải trên app bar (tự xử lý onPress nếu cần)
 *
 * Flow render:
 *   1. Nếu loading: hiện skeleton hoặc spinner
 *   2. Nếu có header: render XAppBar trên cùng
 *   3. Content bọc lần lượt: ScrollView -> TouchableWithoutFeedback -> KeyboardAvoidingView (tùy props)
 *   4. Error hiển thị trong content
 *
 * Lưu ý maintain:
 *   - Nếu muốn thêm footer, mở lại phần comment ở cuối content
 *   - Nếu muốn custom header, truyền thêm prop cho XAppBar
 *   - Nếu muốn tối ưu performance, có thể memo hóa StyleSheet
 *   - Đảm bảo truyền đúng props để tránh bọc wrapper dư thừa
 *
 * Author: [Khangnt]
 * Last updated: [2025.07.16]
 */
import React, { ReactNode } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import XText from './XText';
import XButton from './XButton';
import XAppBar from './XAppBar';
import XAlert from './XAlert';
import { XSkeleton } from './XSkeleton';
import LoadingAnimation from './LoadingAnimation';

interface XScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  dismissKeyboard?: boolean;
  safeArea?: boolean;
  backgroundColor?: string;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  skeleton?: ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  title?: string;
  showHeader?: boolean;
  footer?: ReactNode;
  style?: any;
  rightIcon?: ReactNode;
  haveBottomTabBar?: boolean;
  // Bổ sung props cho bottom button bar
  onSave?: () => void;
  onCancel?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  bottomButtonBarStyle?: any;
}


export default function XScreen({
  children,
  scrollable = false,
  keyboardAvoiding = false,
  dismissKeyboard = false,
  safeArea = true,
  backgroundColor,
  padding,
  paddingHorizontal,
  paddingVertical,
  loading = false,
  error = null,
  onRetry,
  skeleton,
  onRefresh,
  refreshing = false,
  title,
  showHeader = title ? true : false,
  footer,
  style,
  rightIcon,
  haveBottomTabBar = false,
  onSave,
  onCancel,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  bottomButtonBarStyle,
}: XScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const screenBackgroundColor = backgroundColor || theme.colors.background;
  const screenPadding = padding ?? theme.spacing.md;
  const screenPaddingHorizontal = paddingHorizontal ?? screenPadding;
  const screenPaddingVertical = paddingVertical ?? screenPadding;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      
    },
    scrollContent: {
      flexGrow: 1,
    },
    header: {
      marginBottom: 16,
    },
    footer: {
      marginTop: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
  }); 
  // Loading screen (skeleton or spinner)
  if (loading) {
    if (skeleton) {
      return (
        <View style={[
          styles.container,
          { backgroundColor: screenBackgroundColor },
          safeArea && {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
          style,
        ]}>
          {skeleton}
        </View>
      );
    }
    return <LoadingAnimation />;
  }

  // Main content
  let content = (
    <View style={[
      styles.content,
      {
        backgroundColor: backgroundColor||theme.colors.background, 
        paddingTop: !showHeader && safeArea ?   insets.top  : 0 ,
        paddingHorizontal: screenPaddingHorizontal
      },
      style
    ]}>
      {children}
      {error && <XAlert message={error} type="error" onClose={() => {}} />}
      {/* {footer && <View style={styles.footer}>{footer}</View>} */}
    </View>
  );

  if (scrollable) {
    content =  (
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            backgroundColor: backgroundColor||theme.colors.background,
            paddingBottom: safeArea ? insets.bottom + (haveBottomTabBar || onSave || onCancel ? 80 : 0) : 0,
          }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          ) : undefined
        }
      >
        {content}
      </ScrollView>
    );
  }

  if(dismissKeyboard)
  {
    content = (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {content}
      </TouchableWithoutFeedback>
    )
  }
  if (keyboardAvoiding) {
    content = (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
       >
        {content}
      </KeyboardAvoidingView>
    );
  }
  return (
    <View
      style={[
        styles.container,
      ]}
    >
      {showHeader && (
        <XAppBar
          title={title ?? ""}
          showBack={true}
          rightIcon={rightIcon}
          safeArea={safeArea}
        />
      )}
      {content}
      
    </View>
  );

  
}

