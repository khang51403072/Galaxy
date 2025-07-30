import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { SignalRService } from '@/core/network';
import xlog from '@/core/utils/xlog';

interface SignalRState {
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
  
  // Message sending
  sendMessage: (data: any) => Promise<void>;
  // Utility
  getConnectionId: () => string | null;
  getPendingMessagesCount: () => number;
  clearPendingMessages: () => void;
}

const useSignalRStore = create<SignalRState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    isConnected: false,
    isInitialized: false,
    connectionError: null,
    connectionId: null,
    pendingMessagesCount: 0,
    unreadNotifications: 0,
    unreadChatMessages: 0,

    // Actions
    initialize: async () => {
      try {
        const signalRService = SignalRService.getInstance();
        await signalRService.initialize();
        
        // Setup event listeners
        // signalRService.onReceiveMessage((data) => {
        //     xlog.info('Received message', { tag: 'SIGNALR_STORE', extra: data });
        // });

        // signalRService.onMessage((data) => {
        //     xlog.info('Received message via onMessage', { tag: 'SIGNALR_STORE', extra: data });
        // });

        
        // Monitor connection status
        const checkConnection = () => {
          const isConnected = signalRService.isConnected();
          const connectionId = signalRService.getConnectionId();
          const pendingCount = signalRService.getPendingMessagesCount();
          
          set({
            isConnected,
            connectionId,
            pendingMessagesCount: pendingCount,
          });
        };

        // Check connection status periodically
        const interval = setInterval(checkConnection, 5000);
        
        set({ isInitialized: true });
        xlog.info('SignalR store initialized', { tag: 'SIGNALR_STORE' });
      } catch (error) {
        set({ 
          connectionError: error instanceof Error ? error.message : 'Unknown error',
          isInitialized: false 
        });
        xlog.error('Failed to initialize SignalR store', { tag: 'SIGNALR_STORE', extra: error });
      }
    },

    connect: async () => {
      try {
        const signalRService = SignalRService.getInstance();
        await signalRService.connect();
        set({ isConnected: true, connectionError: null });
      } catch (error) {
        set({ 
          isConnected: false,
          connectionError: error instanceof Error ? error.message : 'Connection failed'
        });
      }
    },

    disconnect: async () => {
      try {
        const signalRService = SignalRService.getInstance();
        await signalRService.disconnect();
        set({ isConnected: false });
      } catch (error) {
        xlog.error('Failed to disconnect SignalR', { tag: 'SIGNALR_STORE', extra: error });
      }
    },

    // Message sending
    sendMessage: async (data: any) => {
      try {
        const signalRService = SignalRService.getInstance();
        await signalRService.sendMessage(data);
        xlog.info('Message sent', { tag: 'SIGNALR_STORE', extra: data });
      } catch (error) {
        xlog.error('Failed to send message', { tag: 'SIGNALR_STORE', extra: error });
        throw error;
      }
    },

    

    // Notification management
    incrementUnreadNotifications: () => {
      set((state) => ({
        unreadNotifications: state.unreadNotifications + 1,
      }));
    },

    incrementUnreadChatMessages: () => {
      set((state) => ({
        unreadChatMessages: state.unreadChatMessages + 1,
      }));
    },

    clearUnreadNotifications: () => {
      set({ unreadNotifications: 0 });
    },

    clearUnreadChatMessages: () => {
      set({ unreadChatMessages: 0 });
    },

    // Utility methods
    getConnectionId: () => {
      const signalRService = SignalRService.getInstance();
      return signalRService.getConnectionId();
    },

    getPendingMessagesCount: () => {
      const signalRService = SignalRService.getInstance();
      return signalRService.getPendingMessagesCount();
    },

    clearPendingMessages: () => {
      const signalRService = SignalRService.getInstance();
      signalRService.clearPendingMessages();
      set({ pendingMessagesCount: 0 });
    },
  }))
);

export default useSignalRStore; 