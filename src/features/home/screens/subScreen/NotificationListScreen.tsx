import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getNotifications, markNotificationAsRead, NotificationItem } from '@/shared/services/FirebaseNotificationService';
import XScreen from '@/shared/components/XScreen';

const NotificationListScreen = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

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

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={[styles.item, !item.read && styles.unread]}
      onPress={() => handlePress(item)}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>{new Date(item.receivedAt).toLocaleString()}</Text>
      <Text style={styles.status}>{item.read ? 'Đã đọc' : 'Chưa đọc'}</Text>
    </TouchableOpacity>
  );

  return (
    <XScreen title='Notifications' style={styles.container}>
      
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 20 }}
        ListEmptyComponent={<Text style={styles.empty}>Không có thông báo nào</Text>}
      />
    </XScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  item: { padding: 12, borderRadius: 8, backgroundColor: '#f2f2f2', marginBottom: 12 },
  unread: { backgroundColor: '#e0f7fa' },
  title: { fontSize: 16, fontWeight: 'bold' },
  message: { fontSize: 14, marginTop: 4 },
  time: { fontSize: 12, color: '#888', marginTop: 4 },
  status: { fontSize: 12, color: '#00796b', marginTop: 4, fontStyle: 'italic' },
  empty: { textAlign: 'center', color: '#888', marginTop: 40 },
});

export default NotificationListScreen; 