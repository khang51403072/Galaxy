import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Button, Dimensions, TouchableOpacity, View } from 'react-native';
import LoginForm from '../components/LoginForm';
import { useAuthStore } from '../stores/authStore';
import XIcon from '../../../shared/components/XIcon';
import { useNavigation } from '@react-navigation/native';
import XScreen from '../../../shared/components/XScreen';
import { AuthError } from '../types/AuthErrors';
import { ROUTES } from '../../../app/routes';
import { isSuccess } from '../../../shared/types/Result';
import XForm, { XFormField } from '../../../shared/components/XForm';
import XInput from '../../../shared/components/XInput';
import { keychainHelper, KeychainObject } from '../../../shared/utils/keychainHelper';
import XText from '../../../shared/components/XText';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import XAvatar from '../../../shared/components/XAvatar';
import XBottomSheetSearch from '../../../shared/components/XBottomSheetSearch';
import BottomSheet from '@gorhom/bottom-sheet';
import { checkBiometricAvailable, simpleBiometricAuth } from '../../../shared/services/BiometricService';
import XAlert from '../../../shared/components/XAlert';

export default function LoginScreen() {
  const { login, isLoading, error } = useAuthStore();
  const screenHeight = Dimensions.get('window').height;
  const topSpacing = screenHeight * 0.1;
  const navigation = useNavigation();
  const theme = useTheme();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowUsername, setIsShowUsername] = useState(true);
  const [fullName, setFullName] = useState('');
  const [avatarUri, setAvatarUri] = useState(null);
  const fields: XFormField[] = [
    {
      name: 'username',
      label: 'Username',
      rules: {
        required: 'Username is required',
      },

      renderInput: ({ value, onChangeText, errorMessage, ...rest }) => (
        <View style={{ borderRadius: 8, display: isShowUsername ? 'flex' : 'none' }}>
          <XInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Enter your username"
            iconLeft="user"
            errorMessage={errorMessage}
            style={{ backgroundColor: 'transparent', borderWidth: 0 }}
            {...rest}
          />
        </View>
      ),
    },
    {
      name: 'password',
      label: 'Password',
      rules: {
        required: 'Password is required',
      },
      renderInput: ({ value, onChangeText, errorMessage, ...rest }) => (
        <View style={{ borderRadius: 8, }}>
          <XInput
            
            value={value}
            onChangeText={onChangeText}
            placeholder="Enter your password"
            secureTextEntry={!isShowPassword}
            iconLeft="passwordCheck"
            iconRight={isShowPassword ? 'showPassword' : 'hidePassword'}
            onIconRightPress={() => {
              setIsShowPassword(!isShowPassword);
            }}
            errorMessage={errorMessage}
            style={{ backgroundColor: 'transparent', borderWidth: 0 }}
            {...rest}
          />
        </View>
      ),
    },
  ];


  const [defaultValues, setDefaultValues] = useState( {
    username: '',
    password: '',
  });

  const handleFaceIdLogin = async () => {
    const { available, biometryType } = await checkBiometricAvailable();
    if (!available) {
      // Hiển thị thông báo không hỗ trợ
      console.log('Thiết bị không hỗ trợ Face ID/Touch ID');
      return;
    }
    const success = await simpleBiometricAuth();
    if (success) {
      // TODO: Tự động đăng nhập (ví dụ: lấy token đã lưu, gọi API, v.v.)
      const json = await keychainHelper.getObject();  
      if(json!=null) {
        handleLogin({username: json.userName, password: json.password});
      }
    } else {
      console.log('Xác thực thất bại!');
    }
  };
  const handleLogin = async (data: { username: string; password: string }) => {
    const loginResult = await login(data.username, data.password);
    if(isSuccess(loginResult)) {
      console.log('loginResult go to home', loginResult);
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.HOME as never }],
      });
    }
    else{
      setDefaultValues({
        username: data.username,
        password: data.password,
      });
      useAuthStore.setState({ error: loginResult.error?.message });
    }
  };

  useEffect(() => {
    useAuthStore.setState({ isLoading: true });
    keychainHelper.getObject().then(json => {
      
      if(json!=null && json.userName!=null) {
        console.log('json', json?.userName);
        setIsShowUsername(false);
        setDefaultValues({
            username: json?.userName,
            password: '',
          });
        setFullName(json?.firstName + ' ' + json?.lastName);
        setAvatarUri(json?.avatarUri || null);
        setTimeout(() => {
          handleFaceIdLogin();
        }, 500);
      }
      useAuthStore.setState({ isLoading: false });
      
    });
  }, []);

  
  return (
    <XScreen
      keyboardAvoiding={false}
      dismissKeyboard={true}
      backgroundColor={theme.colors.white}
      loading={isLoading}
      error={error}
    >
      {/* <LoginForm onSubmit={handleLogin} loading={isLoading} /> */}
      <View style={{ 
        alignItems: 'center', 
        flexDirection: 'column', 
        width: '100%', 
        flex: 1,
        paddingHorizontal: 20,
        marginTop: "10%",
      }}>
        <XText variant="h1" style={{ textAlign: 'center', marginBottom: 20 }}>
              GALAXY ME
        </XText>
        
        {fullName!='' && (
          <>
            <View style={{ alignItems: 'center', marginBottom: 20, flexDirection: 'column' }}>
              <XAvatar
                size={120}
                editable={false}
                uri={avatarUri || undefined}
              />
              <XText variant="h4" style={{ textAlign: 'center', marginTop: 20,color: theme.colors.gray700 }}>
                {fullName}
              </XText>
            </View>
            
          </>
        )}
        <XForm 
          fields={fields} 
          style={{width: '100%'}} 
          onSubmit={handleLogin} 
          defaultValues={defaultValues} 
          maxHeight={isShowUsername ? "30%" : "20%"} 
          scrollEnabled={false}
        />
        
        {fullName!='' && (
        <TouchableOpacity onPress={() => {
            console.log('sign in with face id');
            handleFaceIdLogin();
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
              
              <View style={{padding: 10, backgroundColor: theme.colors.buttonFaceID, borderRadius: 10}}>
                <XIcon name="faceID" height={20} width={20} color="#999" />
              </View>
              <XText variant="signInFaceID" style={{ marginLeft: 10 }}>
                Sign in with Face ID
              </XText>
          </View>
        </TouchableOpacity>)}
      </View>  
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
