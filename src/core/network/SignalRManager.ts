import { HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr';
import { getToken } from './AuthInterceptor';
import xlog from '../utils/xlog';
import { appConfig } from '@/shared/utils/appConfig';
import { SignalRConfig, DEFAULT_SIGNALR_CONFIG } from './SignalRConfig';

export interface SignalREvent {
  type: string;
  data: any;
  timestamp: number;
}

class SignalRManager {
  private static instance: SignalRManager;
  private connection: HubConnection | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();
  private pendingMessages: SignalREvent[] = [];

  private config: SignalRConfig = DEFAULT_SIGNALR_CONFIG;

  public static getInstance(): SignalRManager {
    if (!SignalRManager.instance) {
      SignalRManager.instance = new SignalRManager();
    }
    return SignalRManager.instance;
  }

  public async initialize(config?: Partial<SignalRConfig>): Promise<void> {
    this.config = { ...this.config, ...config };
    
    try {
      const token = await getToken();
      const deviceId = await appConfig.getPersistentDeviceId();

      this.connection = new HubConnectionBuilder()
        .withUrl(this.config.url, {
          transport: HttpTransportType.LongPolling,
          accessTokenFactory: () => token || '',
          headers: {
            'origin': 'galaxyme',
            'deviceId': deviceId,
          },
        })
        .withAutomaticReconnect([0, 2000, 10000, 30000]) // Retry delays
        .configureLogging(LogLevel.Information)
        .build();

      this.setupEventListeners();
      xlog.info('SignalR Manager initialized', { tag: 'SIGNALR' });
    } catch (error) {
      xlog.error('Failed to initialize SignalR Manager', { tag: 'SIGNALR', extra: error });
      throw error;
    }
  }

  private setupEventListeners(): void {
    if (!this.connection) return;

    this.connection.onclose((error) => {
      this.isConnected = false;
      xlog.warn('SignalR connection closed', { tag: 'SIGNALR', extra: { error } });
    });

    this.connection.onreconnecting((error) => {
      this.isConnected = false;
      this.reconnectAttempts++;
      xlog.info('SignalR reconnecting', { tag: 'SIGNALR', extra: { error, attempt: this.reconnectAttempts } });
    });
    
    this.connection.onreconnected((connectionId) => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      xlog.info('SignalR reconnected', { tag: 'SIGNALR', extra: { connectionId } });
      
      // Send pending messages
      this.sendPendingMessages();
    });

    // Listen for server events
    // this.connection.on('ReceiveMessage', (data) => {
    //   this.handleEvent('ReceiveMessage', data);
    // });
  }

  public async connect(): Promise<void> {
    if (!this.connection) {
      throw new Error('SignalR connection not initialized');
    }

    try {
      xlog.info('Attempting to connect to SignalR', { tag: 'SIGNALR', extra: { url: this.config.url } });
      await this.connection.start();
      this.isConnected = true;
      this.reconnectAttempts = 0;
      xlog.info('SignalR connected successfully', { tag: 'SIGNALR' });
      
      // Send pending messages
      this.sendPendingMessages();
    } catch (error) {
      this.isConnected = false;
      xlog.error('Failed to connect SignalR', { tag: 'SIGNALR', extra: { error, url: this.config.url } });
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.connection && this.isConnected) {
      await this.connection.stop();
      this.isConnected = false;
      xlog.info('SignalR disconnected', { tag: 'SIGNALR' });
    }
  }

  public async invoke(methodName: string, ...args: any[]): Promise<any> {
    if (!this.connection || !this.isConnected) {
      // Queue message if not connected
      this.pendingMessages.push({
        type: methodName,
        data: args,
        timestamp: Date.now(),
      });
      xlog.warn('SignalR not connected, message queued', { tag: 'SIGNALR', extra: { methodName, args } });
      return;
    }

    try {
      const result = await this.connection.invoke(methodName, ...args);
      xlog.info('SignalR method invoked', { tag: 'SIGNALR', extra: { methodName, args, result } });
      return result;
    } catch (error) {
      xlog.error('SignalR method invocation failed', { tag: 'SIGNALR', extra: { methodName, args, error } });
      throw error;
    }
  }

  private sendPendingMessages(): void {
    if (this.pendingMessages.length === 0) return;

    xlog.info(`Sending ${this.pendingMessages.length} pending messages`, { tag: 'SIGNALR' });
    
    this.pendingMessages.forEach(async (message) => {
      try {
        await this.invoke(message.type, ...message.data);
      } catch (error) {
        xlog.error('Failed to send pending message', { tag: 'SIGNALR', extra: { message, error } });
      }
    });
    
    this.pendingMessages = [];
  }

  public on(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  public off(event: string, callback?: (data: any) => void): void {
    if (!callback) {
      this.eventListeners.delete(event);
    } else {
      this.eventListeners.get(event)?.delete(callback);
    }
  }

  private handleEvent(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          xlog.error('Error in SignalR event callback', { tag: 'SIGNALR', extra: { event, error } });
        }
      });
    }
  }

    // Convenience methods for common operations
    public async sendMessage(data: any): Promise<void> {
        this.connection?.send('SendMessage', data);
    }

    public async sendBroadcast(data: any): Promise<void> {
        await this.invoke('SendBroadcast', data);
    }

  // Getters
  public isSignalRConnected(): boolean {
    return this.isConnected;
  }

  public getPendingMessagesCount(): number {
    return this.pendingMessages.length;
  }

  public getConnectionId(): string | null {
    return this.connection?.connectionId || null;
  }

  public clearPendingMessages(): void {
    this.pendingMessages = [];
  }
}

export default SignalRManager; 