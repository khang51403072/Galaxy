import React from 'react';
import { View, Alert } from 'react-native';
import LoginForm from './LoginForm';
import { LoginInput } from './AuthTypes';

export default function LoginScreen() {
  const handleLogin = (data: LoginInput) => {
    console.log('Login with:', data);
    Alert.alert('Thông báo', `Email: ${data.email}\nPassword: ${data.password}`);
    // Giai đoạn 2 sẽ gọi API ở đây
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <LoginForm onSubmit={handleLogin} />
    </View>
  );
}
