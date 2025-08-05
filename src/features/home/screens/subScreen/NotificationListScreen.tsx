import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getNotifications, markAllNotificationAsRead, markNotificationAsRead, NotificationItem } from '@/shared/services/FirebaseNotificationService';
import XScreen from '@/shared/components/XScreen';
import { useTheme } from '@/shared/theme';
import XIcon from '@/shared/components/XIcon';
import XAlert from '@/shared/components/XAlert';
import XDialog from '@/shared/components/XDialog';
import XNoDataView from '@/shared/components/XNoDataView';
import XText from '@/shared/components/XText';
const NotificationListScreen = () => {
  const theme =  useTheme() ;
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background},
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    item: { padding: 12, borderRadius: 8, backgroundColor: theme.colors.white },
    unread: { backgroundColor: theme.colors.unselectedNotify },

    message: { fontSize: 14, marginTop: 4 },
    time: { fontSize: 12, color: '#888', marginTop: 4 },
    status: { fontSize: 12, color: '#00796b', marginTop: 4, fontStyle: 'italic' },
    empty: { textAlign: 'center', color: '#888', marginTop: 40 },
  });
  const loadNotifications = async () => {
    const list = await getNotifications();
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handlePress = async (item: NotificationItem) => {
    
    if (!item.read) {
      await markNotificationAsRead(item.id);
      loadNotifications();
    }
    // Có thể mở modal hoặc chuyển sang màn chi tiết ở đây
    // alert(JSON.stringify(item, null, 2));
  };

  const renderItem = ({ item }: { item: NotificationItem }) =>{ 
    const listServiceData = item.data.service.split('##')
    const listMess = item.message.split("booked")
    return (
      <TouchableOpacity
        style={[styles.item, !item.read && styles.unread, {
          borderBottomWidth:1, borderColor: theme.colors.border,
          gap: 2
        }]}
        onPress={() => handlePress(item)}
      >
        <View style={{flexDirection:"row", justifyContent:"space-between"}}>
          <XText variant='titleMedium' color={theme.colors.gray800}>{item.title}</XText>
          <XText variant='captionLight' color={theme.colors.gray700}>{new Date(item.receivedAt).toMMDD()}</XText>
        </View>
        <XText variant='bodyRegular'>
          {listMess[0]} <XText variant='bodyLight'> just booked a service!</XText>
        </XText>
        <XText variant='bodyRegular'>
          {listServiceData[0]} <XText variant='bodyLight'>{' at '+listServiceData[1]+' on '+new Date(item.receivedAt).toMMDD()}</XText>
        </XText>
      </TouchableOpacity>
    );
  }
  const [isShowAlert, setShowAlert] = useState(false)
  const readAllIcon = <TouchableOpacity onPress={()=>{
    setShowAlert(true);
  }}>
    <XIcon name="readAll" width={theme.spacing.lg} height={theme.spacing.lg} />
  </TouchableOpacity>

  return (
    <XScreen rightIcon={readAllIcon} title='Notification' style={styles.container} paddingHorizontal={0}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<XNoDataView />}
      />
      <XDialog onCancel={()=>setShowAlert(false)} onConfirm={()=>{setShowAlert(false);markAllNotificationAsRead().then(getNotifications) }} visible={isShowAlert} content={"Read all message?"}></XDialog>
    </XScreen>
  );
};



export default NotificationListScreen; 