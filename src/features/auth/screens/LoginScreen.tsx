import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../stores/authStore';
import XIcon from '../../../shared/components/XIcon';
import XScreen from '../../../shared/components/XScreen';
import { ROUTES } from '../../../app/routes';
import { isSuccess } from '../../../shared/types/Result';
import XForm, { XFormField } from '../../../shared/components/XForm';
import XInput from '../../../shared/components/XInput';
import XText from '../../../shared/components/XText';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import XAvatar from '../../../shared/components/XAvatar';
import { checkBiometricAvailable, simpleBiometricAuth } from '../../../shared/services/BiometricService';
import { reset } from '@/app/NavigationService';
import { appConfig } from '@/shared/utils/appConfig';

export default function LoginScreen() {
  const { login, isLoading, error } = useAuthStore();
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

  const handleFaceIdLogin = useCallback(async () => {
    const json = await appConfig.getUser();
    const useBiometric = await appConfig.getUseBiometric();
    if (!useBiometric) return;
    const { available } = await checkBiometricAvailable();
    if (!available) {
      useAuthStore.setState({ error: 'Thiết bị không hỗ trợ Face ID/Touch ID' });
      return;
    }
    const success = await simpleBiometricAuth();
    if (success && json) {
      handleLogin({ username: json.userName, password: json.password });
    } 
    return;
  }, [login]);

  const handleLogin = useCallback(async (data: { username: string; password: string }) => {
    const loginResult = await login(data.username, data.password);
    if(isSuccess(loginResult)) {
      reset([{ name: ROUTES.HOME }], 0);
    }
    else{
      setDefaultValues({
        username: data.username,
        password: data.password,
      });
      useAuthStore.setState({ error: loginResult.error?.message });
    }
  }, [login]);
  
 

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    useAuthStore.setState({ isLoading: true });
    appConfig.getUser().then(json => {
      if(json!=null && json.userName!=null) {
        setIsShowUsername(false);
        setDefaultValues({
            username: json?.userName,
            password: '',
          });
        setFullName(json?.firstName + ' ' + json?.lastName);
        setAvatarUri(json?.avatarUri || null);
        //  timeout = setTimeout(() => {
        //   handleFaceIdLogin();
        // }, 500);
      }
      useAuthStore.setState({ isLoading: false });
    });
    // return () => clearTimeout(timeout);
  }, []);

  const backgroundLogo = <XIcon
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
  const faceIdLoginButton = 
  <TouchableOpacity onPress={handleFaceIdLogin}>
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
      <View style={{padding: 10, backgroundColor: theme.colors.buttonFaceID, borderRadius: 10}}>
        <XIcon name="faceID" height={20} width={20} color="#999" />
      </View>
      <XText variant="signInFaceID" style={{ marginLeft: 10 }}>
        Sign in with Face ID
      </XText>
    </View>
  </TouchableOpacity>
  const avatarAndImage = 
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

  const appName = 
  <XText variant="h1" style={{ textAlign: 'center', marginBottom: 20 }}>
    GALAXY ME
  </XText>

  const loginForm = 
  <XForm 
    fields={fields} 
    style={{width: '100%', gap: theme.spacing.md}} 
    onSubmit={handleLogin} 

    defaultValues={defaultValues} 
    // maxHeight={isShowUsername ? "30%" : "20%"} 
    scrollEnabled={false}
  />
  
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
        {appName}
        {fullName!='' && avatarAndImage}        
        {loginForm}
        {fullName!='' && faceIdLoginButton}
      </View>  
      {backgroundLogo}
      
    </XScreen>
  );
}
