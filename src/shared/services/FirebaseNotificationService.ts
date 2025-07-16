import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

let unsubscribeOnMessage: (() => void) | null = null;

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  receivedAt: number;
  read: boolean;
  data?: any;
};

const NOTIFY_KEY = 'NOTIFICATIONS';

export async function saveNotification(item: NotificationItem) {
  const list = await getNotifications();
  list.unshift(item); // thêm vào đầu danh sách
  await AsyncStorage.setItem(NOTIFY_KEY, JSON.stringify(list));
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const data = await AsyncStorage.getItem(NOTIFY_KEY);
  return data ? JSON.parse(data) : [];
}

export async function markNotificationAsRead(id: string) {
  const list = await getNotifications();
  const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
  await AsyncStorage.setItem(NOTIFY_KEY, JSON.stringify(updated));
}

export function initFirebaseNotificationService(
  onNotify: (item: NotificationItem) => void
) {
  // 1. Xin quyền nhận notification
  async function requestPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) await messaging().registerDeviceForRemoteMessages();
  }
  requestPermission();

  // 2. Lắng nghe notification khi app đang mở (foreground)
  unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
    console.log('FCM foreground:', remoteMessage);
    const item: NotificationItem = {
      id: remoteMessage.messageId || uuidv4(),
      title: remoteMessage.notification?.title ?? '',
      message: remoteMessage.notification?.body ?? '',
      receivedAt: Date.now(),
      read: false,
      data: remoteMessage.data || {},
    };
    await saveNotification(item);
   
    onNotify(item);
  });

  // 3. Lắng nghe notification khi app ở background/quit
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('FCM background:', remoteMessage);
    const item: NotificationItem = {
      id: remoteMessage.messageId || uuidv4(),
      title: remoteMessage.notification?.title ?? '',
      message: remoteMessage.notification?.body ?? '',
      receivedAt: Date.now(),
      read: false,
      data: remoteMessage.data || {},
    };
    await saveNotification(item);
  });

  // 4. Android 13+ cần xin quyền POST_NOTIFICATIONS
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    import('react-native-permissions').then(({ check, request, PERMISSIONS, RESULTS }) => {
      check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS).then(result => {
        if (result !== RESULTS.GRANTED) {
          request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        }
      });
    });
  }
}

export function removeFirebaseNotificationListener() {
  if (unsubscribeOnMessage) {
    unsubscribeOnMessage();
    unsubscribeOnMessage = null;
  }
} 