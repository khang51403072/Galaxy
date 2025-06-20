import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import LoginForm from '../components/LoginForm';
import { LoginInput } from '../types/AuthTypes';
import { login as loginApi } from '../services/authApi';
import { useAuthStore } from '../stores/authStore';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);

  const handleLogin = async (data: LoginInput) => {
    try {
      setLoading(true);
      const res = await loginApi(data.email, data.password);
      await login(res.userName, res.token, res.secureKey);
    } catch (err: any) {
      Alert.alert('Đăng nhập thất bại', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <LoginForm onSubmit={handleLogin} loading={loading} />
    </View>
  );
}
