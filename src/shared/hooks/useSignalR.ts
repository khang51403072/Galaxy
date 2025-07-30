import { useEffect, useCallback, useRef } from 'react';
import useSignalRStore from '@/shared/stores/signalRStore';
import { SignalRService } from '@/core/network';
import xlog from '@/core/utils/xlog';

interface UseSignalROptions {
  autoConnect?: boolean;
  autoInitialize?: boolean;
}

interface UseSignalRReturn {
  // Connection state
  isConnected: boolean;
  isInitialized: boolean;
  connectionError: string | null;
  connectionId: string | null;
  
  // Message counts
  pendingMessagesCount: number;
  unreadNotifications: number;
  unreadChatMessages: number;
  
  // Actions
  initialize: () => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  
  // Event listeners
  onReceiveMessage: (callback: (data: any) => void) => void;
  onMessage: (callback: (data: any) => void) => void;
  
  
  // Message sending
  sendMessage: (data: any) => Promise<void>;
  
  

  
  // Utility
  getConnectionId: () => string | null;
  getPendingMessagesCount: () => number;
  clearPendingMessages: () => void;
}

export const useSignalR = (options: UseSignalROptions = {}): UseSignalRReturn => {
  const {
    autoConnect = true,
    autoInitialize = true,
  } = options;

  const signalRStore = useSignalRStore();
  const signalRService = SignalRService.getInstance();
  const listenersRef = useRef<Map<string, (data: any) => void>>(new Map());

  // Auto-initialize if enabled
  useEffect(() => {
    if (autoInitialize && !signalRStore.isInitialized) {
      signalRStore.initialize();
    }
  }, [autoInitialize, signalRStore.isInitialized]);

  // Auto-connect if enabled
  useEffect(() => {
    if (autoConnect && signalRStore.isInitialized && !signalRStore.isConnected) {
      signalRStore.connect();
    }
  }, [autoConnect, signalRStore.isInitialized, signalRStore.isConnected]);

  // Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      listenersRef.current.forEach((listener, event) => {
        switch (event) {
          case 'ReceiveMessage':
            signalRService.offReceiveMessage(listener);
            break;
         
        }
      });
      listenersRef.current.clear();
    };
  }, [signalRService]);

  // Event listener helpers
  const onReceiveMessage = useCallback((callback: (data: any) => void) => {
    const listener = (data: any) => {
      try {
        callback(data);
      } catch (error) {
        xlog.error('Error in notification callback', { tag: 'SIGNALR_HOOK', extra: error });
      }
    };
    
    listenersRef.current.set('ReceiveMessage', listener);
    signalRService.onReceiveMessage(listener);
  }, [signalRService]);

  const onMessage = useCallback((callback: (data: any) => void) => {
    const listener = (data: any) => {
      try {
        callback(data);
      } catch (error) {
        xlog.error('Error in message callback', { tag: 'SIGNALR_HOOK', extra: error });
      }
    };
    
    listenersRef.current.set('ReceiveMessage', listener);
    signalRService.onMessage(listener);
  }, [signalRService]);

  return {
    // Connection state
    isConnected: signalRStore.isConnected,
    isInitialized: signalRStore.isInitialized,
    connectionError: signalRStore.connectionError,
    connectionId: signalRStore.connectionId,
    
    // Message counts
    pendingMessagesCount: signalRStore.pendingMessagesCount,
    unreadNotifications: signalRStore.unreadNotifications,
    unreadChatMessages: signalRStore.unreadChatMessages,
    
    // Actions
    initialize: signalRStore.initialize,
    connect: signalRStore.connect,
    disconnect: signalRStore.disconnect,
    
    // Event listeners
    onReceiveMessage: onReceiveMessage,
    onMessage: onMessage,
    
    // Message sending
    sendMessage: signalRStore.sendMessage,
    // Utility
    getConnectionId: signalRStore.getConnectionId,
    getPendingMessagesCount: signalRStore.getPendingMessagesCount,
    clearPendingMessages: signalRStore.clearPendingMessages,
  };
};

export default useSignalR; 