import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, TouchableOpacity, View } from 'react-native';
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
      
      if(json!=null && json.userName) {
        console.log('json', json?.userName);
        setIsShowUsername(false);
        setDefaultValues({
            username: json?.userName || 'ssss',
            password: '',
          });
        setFullName(json?.firstName + ' ' + json?.lastName);
        setAvatarUri(json?.avatarUri || null);
      }
      
      useAuthStore.setState({ isLoading: false });
    });
  }, []);

  
  return (
    <XScreen
      keyboardAvoiding={false}
      dismissKeyboard={true}
    
      
      loading={isLoading}
      error={error}
    >
      {/* <LoginForm onSubmit={handleLogin} loading={isLoading} /> */}
      <XText variant="h1" style={{ textAlign: 'center', marginBottom: 20 }}>
            GALAXY ME
          </XText>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <XAvatar
          size={120}
          editable={false}
          uri={avatarUri || undefined}
        />
      </View>
      <View style={{ alignItems: 'center', }}>
        <XText variant="h4" style={{ textAlign: 'center', marginBottom: 20, color: theme.colors.gray700 }}>
          {fullName}
        </XText>
      </View>
      <XForm fields={fields} onSubmit={handleLogin} defaultValues={defaultValues} maxHeight={isShowUsername ? "35%" : "20%"} />
      
      
      <TouchableOpacity onPress={() => {
          console.log('sign in with face id');
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            
            <View style={{padding: 10, backgroundColor: theme.colors.buttonFaceID, borderRadius: 10}}>
              <XIcon name="faceID" height={20} width={20} color="#999" />
            </View>
            <XText variant="signInFaceID" style={{ marginLeft: 10 }}>
              Sign in with Face ID
            </XText>
        </View>
      </TouchableOpacity>
        
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
