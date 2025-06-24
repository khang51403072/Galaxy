import React, { useState } from 'react';
import { View, Alert, Dimensions, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import LoginForm from '../components/LoginForm';
import { LoginInput } from '../types/AuthTypes';
import { useAuthStore } from '../stores/authStore';
import { XColors } from '../../../shared/constants/colors';
import XIcon from '../../../shared/components/XIcon';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../usecase/AuthUsecase';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.storeLogin);
  const screenHeight = Dimensions.get('window').height;
  const topSpacing = screenHeight * 0.1;
  const navigation = useNavigation();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setLoading(true);

      await loginUser(data.email, data.password); // 👈 gọi usecase
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' as never }],
      });
    } catch (err: any) {
      Alert.alert('Đăng nhập thất bại', err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>

   
    <KeyboardAvoidingView  style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      
      <View style={{ 
        backgroundColor: XColors.background,
        flex: 1, justifyContent: 'flex-start', padding: 16, paddingTop: topSpacing 
        }}>
        <LoginForm onSubmit={handleLogin} loading={loading} />
        </View>
        
    
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    <XIcon
            name="logo"
            width={200}
            height={200}
            color="#999"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              opacity: 0.8, // optional: làm mờ nếu muốn background
            }}
          />
     </View>
  );
}
