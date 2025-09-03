import messaging, { firebase } from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { useHomeStore } from '@/features/home/stores/homeStore';
import { appConfig } from '../utils/appConfig';
import { AuthUseCase } from '@/features/auth/usecase/AuthUsecase';
import { RegisterFCMRequest } from '@/features/auth/types/AuthTypes';
import { realAuthUseCase } from '@/features/auth/stores/authStore';
import { backgroundHttpClient } from '@/core/network/BackGroundHttpClient';
import { ApiResponse } from '@/core/network/ApiResponse';
import { API_ENDPOINTS } from '@/core/network/endpoints';

let unsubscribeOnMessage: (() => void) | null = null;
type RegisterResponse = ApiResponse<any>;
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

  useHomeStore.getState().setNotificationCount(list.filter(e=>!e.read).length)
  await AsyncStorage.setItem(NOTIFY_KEY, JSON.stringify(list));
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const data = await AsyncStorage.getItem(NOTIFY_KEY);
  console.log(data)
  return data ? JSON.parse(data) : [];
}

export async function markNotificationAsRead(id: string) {
  const list = await getNotifications();
  const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
  useHomeStore.getState().setNotificationCount(updated.filter(e=>!e.read).length)
  await AsyncStorage.setItem(NOTIFY_KEY, JSON.stringify(updated));
}

export async function markAllNotificationAsRead() {
  const list = await getNotifications();
  const updated = list.map(n => ({ ...n, read: true }));
  useHomeStore.getState().setNotificationCount(updated.filter(e=>!e.read).length)
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
  // 1.2 Thiết lập listener để tự động cập nhật token trong tương lai
  setupTokenRefreshListener();
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

/**
 * Lắng nghe sự kiện token được làm mới và tự động gửi lên server.
 * Nên được đăng ký một lần khi ứng dụng khởi chạy.
 */
function setupTokenRefreshListener() {
  messaging().onTokenRefresh(async (newFcmToken) => {
    console.log('FCM Token was refreshed!', newFcmToken);
    try {
      // Gửi token mới lên server của bạn
      const deviceId = await appConfig.getPersistentDeviceId();
      const rq: RegisterFCMRequest = {
        deviceId: deviceId,
        deviceToken: newFcmToken??"",
        platform: Platform.OS
      };
      // 3. Gọi API sử dụng backgroundHttpClient
      await backgroundHttpClient.post<RegisterResponse>(
          API_ENDPOINTS.AUTH.REGISTER_FCM, 
          rq
      );
      
      // Lưu lại token mới vào bộ nhớ thiết bị
      await appConfig.saveFcmToken(newFcmToken);
    } catch (error) {
      console.error('Failed to handle token refresh:', error);
    }
  });
}

/**
 * Hàm chính để lấy FCM token.
 * Sẽ so sánh với token đã lưu và chỉ gửi lên server nếu có thay đổi.
 * Hàm này nên được gọi sau khi người dùng đăng nhập thành công.
 */
export async function handleFcmTokenOnLogin(authUseCase: AuthUseCase) {
  try {
    if (!firebase.messaging().isDeviceRegisteredForRemoteMessages) {
      await firebase.messaging().registerDeviceForRemoteMessages();
    }
    const fcmToken = await messaging().getToken();

    if (fcmToken) {
      console.log('Current FCM Token:', fcmToken);
      const oldToken = await appConfig.getFcmToken();
       const deviceId = await appConfig.getPersistentDeviceId();
      if (fcmToken !== oldToken) {
        console.log('New or different FCM token detected on login. Sending to server...');
        const rq: RegisterFCMRequest = {
          deviceId: deviceId,
          deviceToken: fcmToken??"",
          platform: Platform.OS
        };
        await authUseCase.registerFCM(rq);
        await appConfig.saveFcmToken(fcmToken);
      }
    }
  } catch (error) {
    console.error('Error handling FCM token on login:', error);
  }
}