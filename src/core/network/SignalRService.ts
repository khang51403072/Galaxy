import { SignalRManager } from './index';
import xlog from '../utils/xlog';

class SignalRService {
  private static instance: SignalRService;
  private signalRManager: SignalRManager;
  private isInitialized: boolean = false;

  private constructor() {
    this.signalRManager = SignalRManager.getInstance();
  }

  public static getInstance(): SignalRService {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      xlog.warn('SignalR Service already initialized', { tag: 'SIGNALR_SERVICE' });
      return;
    }

    try {
      await this.signalRManager.initialize();
      this.isInitialized = true;
      xlog.info('SignalR Service initialized successfully', { tag: 'SIGNALR_SERVICE' });
    } catch (error) {
      xlog.error('Failed to initialize SignalR Service', { tag: 'SIGNALR_SERVICE', extra: error });
      throw error;
    }
  }

  // Connection management
  public async connect(): Promise<void> {
    await this.signalRManager.connect();
  }

  public async disconnect(): Promise<void> {
    await this.signalRManager.disconnect();
  }

  public isConnected(): boolean {
    return this.signalRManager.isSignalRConnected();
  }

  // Event listeners
  public onReceiveMessage(callback: (data: any) => void): void {
    this.signalRManager.on('ReceiveMessage', callback);
  }

  public onMessage(callback: (data: any) => void): void {
    this.signalRManager.on('ReceiveMessage', callback);
  }
  
  public onAllEvents(callback: (data: any) => void): void {
    this.signalRManager.on('*', callback);
  }

  // Event emitters
  public async sendBroadcast(data: any): Promise<void> {
    await this.signalRManager.sendBroadcast(data);
  }

  public async sendMessage(data: any): Promise<void> {
    await this.signalRManager.sendMessage(data);
  }

  // Generic method invocation
  public async invoke(methodName: string, ...args: any[]): Promise<any> {
    return await this.signalRManager.invoke(methodName, ...args);
  }

  // Utility methods
  public getConnectionId(): string | null {
    return this.signalRManager.getConnectionId();
  }

  public getPendingMessagesCount(): number {
    return this.signalRManager.getPendingMessagesCount();
  }

  public clearPendingMessages(): void {
    this.signalRManager.clearPendingMessages();
  }

  // Remove listeners
  public offReceiveMessage(callback: (data: any) => void): void {
    this.signalRManager.off('ReceiveMessage', callback);
  }

  public offBroadcast(callback: (data: any) => void): void {
    this.signalRManager.off('broadcast', callback);
  }

  public offAllEvents(callback: (data: any) => void): void {
    this.signalRManager.off('*', callback);
  }
}

export default SignalRService; 