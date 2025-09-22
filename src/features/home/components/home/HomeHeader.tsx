// features/home/components/HomeHeader.tsx
import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import XText from '@/shared/components/XText';
import XAvatar from '@/shared/components/XAvatar';
import { navigate } from '@/app/NavigationService';
import { ROUTES } from '@/app/routes';
import { useTheme } from '@/shared/theme';
import BellWithBadge from '../BellWithBadge';

// Định nghĩa props để component có thể tái sử dụng
interface HomeHeaderProps {
  avatarUri?: string;
  firstName?: string;
  lastName?: string;
  notificationCount: number;
}

export const HomeHeader = memo(({
  avatarUri,
  firstName,
  lastName,
  notificationCount
}: HomeHeaderProps) => {
  const theme = useTheme();

  return (
    <View style={{ 
        width: '100%', 
        backgroundColor: theme.colors.background,
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingVertical: theme.spacing.sm // Thêm padding để có khoảng cách
    }}>
      <XAvatar
        editable={false}
        size={40}
        uri={avatarUri}
      />
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 10 }}>
        <XText variant='titleLight' style={{ color: theme.colors.gray800 }}>
          Hi! 
        </XText>
        <XText variant='titleRegular' style={{ color: theme.colors.gray800 }}>
          {`${firstName} ${lastName}`}
        </XText>  
      </View>
      <TouchableOpacity onPress={() => navigate(ROUTES.NOTIFICATIONS)}>
        <BellWithBadge count={notificationCount} />
      </TouchableOpacity>
    </View>
  );
});