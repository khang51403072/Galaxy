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

interface XScreenProps {
  children: ReactNode;
  // Layout options
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  dismissKeyboard?: boolean;
  safeArea?: boolean;
  
  // Styling
  backgroundColor?: string;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  
  // Loading & Error states
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  
  // Pull to refresh
  onRefresh?: () => void;
  refreshing?: boolean;
  
  // Header
  title?: string;
  showHeader?: boolean;
  
  // Footer
  footer?: ReactNode;
  
  // Custom styles
  style?: any;
  contentStyle?: any;
}

export default function XScreen({
  children,
  // Layout options
  scrollable = false,
  keyboardAvoiding = false,
  dismissKeyboard = false,
  safeArea = true,
  
  // Styling
  backgroundColor,
  padding,
  paddingHorizontal,
  paddingVertical,
  
  // Loading & Error states
  loading = false,
  error = null,
  onRetry,
  
  // Pull to refresh
  onRefresh,
  refreshing = false,
  
  // Header
  title,
  showHeader = false,
  
  // Footer
  footer,
  
  // Custom styles
  style,
  contentStyle,
}: XScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  
  // Use theme colors if not provided
  const screenBackgroundColor = backgroundColor || theme.colors.background;
  const screenPadding = padding ?? theme.spacing.md;
  const screenPaddingHorizontal = paddingHorizontal ?? screenPadding;
  const screenPaddingVertical = paddingVertical ?? screenPadding;

  // Handle error display
  React.useEffect(() => {
    if (error) {
      Alert.alert('Lỗi', error);
    }
  }, [error]);

  // Loading screen
  if (loading) {
    return (
      <View style={[
        styles.loadingContainer,
        { backgroundColor: screenBackgroundColor },
        safeArea && {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        style,
      ]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <XText variant="body" style={{ marginTop: theme.spacing.md }}>
          Đang tải...
        </XText>
      </View>
    );
  }

  // Error screen
  // if (error && !loading) {
  //   return (
  //     <View style={[
  //       styles.errorContainer,
  //       { backgroundColor: screenBackgroundColor },
  //       safeArea && {
  //         paddingTop: insets.top,
  //         paddingBottom: insets.bottom,
  //       },
  //       style,
  //     ]}>
  //       <XText variant="h2" style={{ marginBottom: theme.spacing.md }}>
  //         Có lỗi xảy ra
  //       </XText>
  //       <XText variant="body" style={{ marginBottom: theme.spacing.lg, textAlign: 'center' }}>
  //         {error}
  //       </XText>
  //       {onRetry && (
  //         <XButton title="Thử lại" onPress={onRetry} />
  //       )}
  //     </View>
  //   );
  // }

  // Main content
  const content = (
    <View style={[
      styles.content,
      {
        backgroundColor: screenBackgroundColor,
        paddingHorizontal: screenPaddingHorizontal,
        paddingVertical: screenPaddingVertical,
      },
      contentStyle,
    ]}>
      {/* Header */}
      {showHeader && title && (
        <XAppBar title={title} showBack={true} />
      )}
      
      {/* Main content */}
      {children}
      {/* Alert */}
      {error && (
        <XAlert
          visible={error!=null}
          message={error}
          type="error"
          onClose={()=>{}}
        />
      )}
      {/* Footer */}
      {footer && (
        <View style={styles.footer}>
          {footer}
        </View>
      )}
    </View>
  );

  // Keyboard avoiding wrapper
  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        style={[
          styles.container,
          { backgroundColor: screenBackgroundColor },
          safeArea && {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
          style,
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {dismissKeyboard ? (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {content}
          </TouchableWithoutFeedback>
        ) : (
          content
        )}
      </KeyboardAvoidingView>
    );
  }

  // Scrollable wrapper
  if (scrollable) {
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
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: screenPaddingHorizontal,
              // paddingVertical: screenPaddingVertical,
            },
            contentStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          ) : undefined}
        >
          {/* Header */}
          {showHeader && title && (
            <XAppBar title={title} showBack={true} />
          )}
          
          {/* Main content */}
          {children}
          
          {/* Footer */}
          {footer && (
            <View style={styles.footer}>
              {footer}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // Default wrapper
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
      {dismissKeyboard ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {content}
        </TouchableWithoutFeedback>
      ) : (
        content
      )}
    </View>
  );
}

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