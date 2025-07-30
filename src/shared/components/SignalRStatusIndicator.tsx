import React from 'react';
import { View, StyleSheet } from 'react-native';
import XText from './XText';
import XIcon from './XIcon';
import useSignalRStore from '@/shared/stores/signalRStore';
import { lightColors as colors } from '@/shared/theme/colors';

interface SignalRStatusIndicatorProps {
  showDetails?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const SignalRStatusIndicator: React.FC<SignalRStatusIndicatorProps> = ({
  showDetails = false,
  size = 'medium',
}) => {
  const { isConnected, isInitialized, connectionError, pendingMessagesCount, connectionId } = useSignalRStore();

  const getStatusColor = () => {
    if (!isInitialized) return colors.gray400;
    if (connectionError) return colors.error;
    if (isConnected) return colors.success;
    return colors.warning;
  };

  const getStatusText = () => {
    if (!isInitialized) return 'Initializing...';
    if (connectionError) return 'Error';
    if (isConnected) return 'Connected';
    return 'Connecting...';
  };

  const getIconName = () => {
    if (!isInitialized) return 'Clock';
    if (connectionError) return 'X';
    if (isConnected) return 'CheckCircle';
    return 'Clock';
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 8, height: 8, borderRadius: 4 };
      case 'large':
        return { width: 16, height: 16, borderRadius: 8 };
      default:
        return { width: 12, height: 12, borderRadius: 6 };
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.indicator, getSizeStyles(), { backgroundColor: getStatusColor() }]} />
      
      {showDetails && (
        <View style={styles.details}>
          <XText style={styles.statusText} variant="caption">
            {getStatusText()}
          </XText>
          
          {connectionId && (
            <XText style={styles.connectionId} variant="caption">
              ID: {connectionId.substring(0, 8)}...
            </XText>
          )}
          
          {pendingMessagesCount > 0 && (
            <View style={styles.pendingBadge}>
              <XText style={styles.pendingText} variant="caption">
                {pendingMessagesCount}
              </XText>
            </View>
          )}
          
          {connectionError && (
            <XText style={styles.errorText} variant="caption">
              {connectionError}
            </XText>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    backgroundColor: colors.gray400,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    color: colors.gray600,
  },
  connectionId: {
    color: colors.gray500,
    fontSize: 10,
  },
  pendingBadge: {
    backgroundColor: colors.warning,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  pendingText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  errorText: {
    color: colors.error,
    fontSize: 10,
  },
}); 