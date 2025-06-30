import React, { useEffect } from 'react';
import { Alert, Dimensions } from 'react-native';
import LoginForm from '../components/LoginForm';
import { useAuthStore } from '../stores/authStore';
import XIcon from '../../../shared/components/XIcon';
import { useNavigation } from '@react-navigation/native';
import XScreen from '../../../shared/components/XScreen';
import { AuthError } from '../types/AuthErrors';
import { ROUTES } from '../../../app/routes';

export default function LoginScreen() {
  const { login, isLoading } = useAuthStore();
  const screenHeight = Dimensions.get('window').height;
  const topSpacing = screenHeight * 0.1;
  const navigation = useNavigation();

  // Set up callbacks for navigation and error handling
  useEffect(() => {
    useAuthStore.setState({
      onLoginSuccess: () => {
        navigation.reset({
          index: 0,
          routes: [{ name: ROUTES.HOME as never }],
        });
      },
      onLoginError: (error: string) => {
        // Enhanced error handling with specific error types
        Alert.alert('Đăng nhập thất bại', error || 'Có lỗi xảy ra');
      },
    });
  }, [navigation]);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password);
      // Navigation and error handling are now managed by callbacks
      // No need for additional error handling here
    } catch (error) {
      // This catch block is now redundant since errors are handled by callbacks
      // But we keep it for unexpected errors
      if (error instanceof AuthError) {
        console.error('Auth error:', error.message, error.code);
      } else {
        console.error('Unexpected login error:', error);
      }
    }
  };

  return (
    <XScreen
      keyboardAvoiding={true}
      dismissKeyboard={true}
      paddingVertical={topSpacing}
      loading={isLoading}
    >
      <LoginForm onSubmit={handleLogin} loading={isLoading} />
      
      {/* Background logo */}
      <XIcon
        name="logo"
        width={200}
        height={200}
        color="#999"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          opacity: 0.8,
        }}
      />
    </XScreen>
  );
}
