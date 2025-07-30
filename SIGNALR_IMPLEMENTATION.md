# 🚀 SignalR Implementation Guide - GalaxyMe

## 📋 Tổng quan

Hệ thống SignalR được implement để cung cấp real-time communication cho ứng dụng GalaxyMe, thay thế cho WebSocket thuần với nhiều tính năng mạnh mẽ hơn.

## 🏗️ Kiến trúc

```
┌─────────────────┐    SignalR    ┌─────────────────┐
│   GalaxyMe App  │ ◄────────────► │   .NET Backend  │
│                 │                 │                 │
│ ┌─────────────┐ │                 │ ┌─────────────┐ │
│ │ SignalR Mgr │ │                 │ │ SignalR Hub │ │
│ └─────────────┘ │                 │ └─────────────┘ │
│ ┌─────────────┐ │                 │ ┌─────────────┐ │
│ │ SignalR Svc │ │                 │ │ Hub Methods │ │
│ └─────────────┘ │                 │ └─────────────┘ │
└─────────────────┘                 └─────────────────┘
```

## 📁 Cấu trúc Files

```
src/
├── core/network/
│   ├── SignalRManager.ts      # Quản lý kết nối SignalR
│   └── SignalRService.ts      # Service layer tích hợp
├── shared/
│   ├── stores/
│   │   └── signalRStore.ts    # Zustand store cho SignalR state
│   ├── hooks/
│   │   └── useSignalR.ts      # Custom hook cho React components
│   └── components/
│       └── SignalRStatusIndicator.tsx  # UI component hiển thị trạng thái
```

## 🔧 Cài đặt

### 1. Cài đặt dependencies

```bash
npm install @microsoft/signalr
```

### 2. Khởi tạo SignalR trong App.tsx

```typescript
import useSignalRStore from '@/shared/stores/signalRStore';

function App() {
  const { initialize: initializeSignalR } = useSignalRStore();
  
  useEffect(() => {
    // Initialize SignalR connection
    initializeSignalR().catch(error => {
      console.error('Failed to initialize SignalR:', error);
    });
  }, [initializeSignalR]);
}
```

## 🎯 Sử dụng

### 1. Sử dụng trong React Components

```typescript
import useSignalR from '@/shared/hooks/useSignalR';

function MyComponent() {
  const {
    isConnected,
    unreadNotifications,
    onNotification,
    sendChatMessage,
  } = useSignalR();

  useEffect(() => {
    // Listen for notifications
    onNotification((data) => {
      console.log('New notification:', data);
    });
  }, [onNotification]);

  const sendMessage = () => {
    sendChatMessage({
      message: 'Hello world!',
      roomId: 'general',
    });
  };

  return (
    <View>
      <Text>Connected: {isConnected ? 'Yes' : 'No'}</Text>
      <Text>Unread: {unreadNotifications}</Text>
    </View>
  );
}
```

### 2. Hiển thị trạng thái kết nối

```typescript
import { SignalRStatusIndicator } from '@/shared/components/SignalRStatusIndicator';

function Header() {
  return (
    <View>
      <SignalRStatusIndicator showDetails size="medium" />
    </View>
  );
}
```

## 📡 Events

### Events từ Server

| Event | Mô tả | Data Structure |
|-------|-------|----------------|
| `ReceiveNotification` | Thông báo mới | `{ title, message, priority, category }` |
| `ReceiveAppointmentUpdate` | Cập nhật lịch hẹn | `{ appointmentId, status, changes }` |
| `ReceivePayrollUpdate` | Cập nhật lương | `{ payrollId, amount, status, changes }` |
| `ReceiveTicketUpdate` | Cập nhật ticket | `{ ticketId, status, priority, changes }` |
| `ReceiveChatMessage` | Tin nhắn chat | `{ messageId, senderId, message, roomId }` |
| `ReceiveBroadcast` | Tin nhắn broadcast | `{ title, message, fromUserId, targetAudience }` |

### Methods gửi đến Server

| Method | Mô tả | Data Structure |
|--------|-------|----------------|
| `SendNotification` | Gửi thông báo | `{ title, message, priority, category }` |
| `SendAppointmentUpdate` | Cập nhật lịch hẹn | `{ appointmentId, status, changes }` |
| `SendPayrollUpdate` | Cập nhật lương | `{ payrollId, amount, status, changes }` |
| `SendTicketUpdate` | Cập nhật ticket | `{ ticketId, status, priority, changes }` |
| `SendChatMessage` | Gửi tin nhắn chat | `{ message, roomId }` |
| `SendBroadcast` | Gửi tin nhắn broadcast | `{ title, message, targetAudience }` |
| `JoinGroup` | Tham gia group | `groupName` |
| `LeaveGroup` | Rời group | `groupName` |

## 🔄 State Management

### SignalR Store (Zustand)

```typescript
const signalRStore = useSignalRStore();

// Connection state
const { isConnected, isInitialized, connectionError, connectionId } = signalRStore;

// Message counts
const { pendingMessagesCount, unreadNotifications, unreadChatMessages } = signalRStore;

// Actions
const { initialize, connect, disconnect } = signalRStore;

// Message sending
const { sendNotification, sendChatMessage, sendBroadcast } = signalRStore;
```

## 🛠️ Configuration

### SignalR Configuration

```typescript
// src/core/network/SignalRManager.ts
const config: SignalRConfig = {
  url: 'https://xsalonapi.prod.galaxyaccess.us/galaxymeHub',
  autoReconnect: true,
  logLevel: LogLevel.Information,
  transportType: HttpTransportType.WebSockets,
};
```

### Authentication

SignalR tự động gửi authentication data:

```typescript
accessTokenFactory: () => token,
headers: {
  'origin': 'galaxyme',
  'deviceId': deviceId,
}
```

## 🔍 Debugging

### Logging

Tất cả SignalR events được log thông qua `xlog`:

```typescript
xlog.info('SignalR connected', { tag: 'SIGNALR' });
xlog.error('SignalR connection error', { tag: 'SIGNALR', extra: error });
```

### Connection Status

```typescript
const { isConnected, connectionError, pendingMessagesCount, connectionId } = useSignalRStore();
```

## 🚨 Error Handling

### Connection Errors

```typescript
const { connectionError } = useSignalRStore();

if (connectionError) {
  // Handle connection error
  console.error('SignalR connection failed:', connectionError);
}
```

### Method Invocation Errors

```typescript
try {
  await sendChatMessage({
    message: 'Hello',
    roomId: 'general'
  });
} catch (error) {
  console.error('Failed to send message:', error);
}
```

## 📱 Use Cases

### 1. Real-time Notifications

```typescript
useEffect(() => {
  onNotification((data) => {
    // Show notification badge
    // Update notification list
    // Play sound
  });
}, [onNotification]);
```

### 2. Live Appointment Updates

```typescript
useEffect(() => {
  onAppointmentUpdate((data) => {
    // Refresh appointment list
    // Show status change notification
    // Update calendar view
  });
}, [onAppointmentUpdate]);
```

### 3. Chat System

```typescript
const sendMessage = (message: string) => {
  sendChatMessage({
    message,
    roomId: 'general',
  });
};

useEffect(() => {
  onChatMessage((data) => {
    // Add message to chat
    // Update unread count
    // Play notification sound
  });
}, [onChatMessage]);
```

### 4. Group Management

```typescript
const { joinGroup, leaveGroup } = useSignalR();

// Join specific room
await joinGroup('appointment_room');

// Leave room
await leaveGroup('appointment_room');
```

## 🔧 Backend Integration

### Server Hub (.NET)

```csharp
public class GalaxyMeHub : Hub
{
    public async Task SendNotification(NotificationData notification)
    {
        await Clients.All.SendAsync("ReceiveNotification", notification);
    }

    public async Task SendAppointmentUpdate(string appointmentId, AppointmentUpdate update)
    {
        await Clients.All.SendAsync("ReceiveAppointmentUpdate", appointmentId, update);
    }

    public async Task SendChatMessage(ChatMessage message)
    {
        await Clients.Group(message.RoomId).SendAsync("ReceiveChatMessage", message);
    }

    public async Task JoinGroup(string groupName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
    }

    public async Task LeaveGroup(string groupName)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
    }
}
```

### Program.cs Configuration

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add SignalR
builder.Services.AddSignalR();

var app = builder.Build();

// Map SignalR Hub
app.MapHub<GalaxyMeHub>("/galaxymeHub");
```

## 📊 Performance & Scaling

### Single Server
```csharp
// appsettings.json
{
  "SignalR": {
    "EnableDetailedErrors": true,
    "MaximumReceiveMessageSize": 32768
  }
}
```

### Multiple Servers (Azure SignalR Service)
```csharp
builder.Services.AddSignalR()
    .AddAzureSignalR("your-connection-string");
```

## 🔐 Security

### Authentication
```csharp
[Authorize]
public class SecureHub : Hub
{
    public async Task SendSecureMessage(string message)
    {
        var userId = Context.User.Identity.Name;
        await Clients.All.SendAsync("ReceiveMessage", userId, message);
    }
}
```

### Authorization
```csharp
[Authorize(Roles = "Admin")]
public async Task SendAdminMessage(string message)
{
    await Clients.All.SendAsync("ReceiveAdminMessage", message);
}
```

## 🎯 **Ưu điểm của SignalR so với WebSocket thuần**

### **1. Auto Transport Selection**
- Tự động chọn transport tốt nhất (WebSocket, SSE, Long Polling)
- Fallback tự động khi WebSocket không khả dụng

### **2. Built-in Authentication**
- Token-based authentication tích hợp sẵn
- User management và authorization

### **3. Group Management**
- Join/Leave groups dễ dàng
- Broadcast to specific groups

### **4. Connection Management**
- Auto-reconnection với retry policy
- Connection state tracking

### **5. Type Safety**
- Strong typing với C# backend
- IntelliSense support

### **6. Scaling**
- Azure SignalR Service cho multi-server
- Redis backplane support

## 🚀 **Future Enhancements**

1. **Azure SignalR Service** - Scaling cho production
2. **Message Encryption** - End-to-end encryption
3. **File Transfer** - Support file sharing
4. **Voice/Video** - Real-time communication
5. **Push Notifications** - Integration với FCM
6. **Analytics** - Track SignalR usage

## 📞 **Support**

Nếu có vấn đề với SignalR implementation, vui lòng:

1. Kiểm tra connection status
2. Xem logs trong console
3. Verify backend SignalR Hub
4. Check network connectivity
5. Review authentication tokens
6. Verify Hub method signatures

## 🎉 **Kết luận**

SignalR cung cấp một giải pháp real-time communication mạnh mẽ và dễ sử dụng cho GalaxyMe, với nhiều tính năng built-in và khả năng scaling tốt! 🚀 