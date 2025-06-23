import React, { useRef, useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Keyboard, NativeSyntheticEvent, TextInputSubmitEditingEventData } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { LoginInput } from '../types/AuthTypes';
import XText from '../../../shared/components/XText';
import XInput from '../../../shared/components/XInput';
import { XColors } from '../../../shared/constants/colors';
import XButton from '../../../shared/components/XButton';
import XIcon from '../../../shared/components/XIcon';

type Props = {
  onSubmit: (data: LoginInput) => void;
  loading?: boolean;
};

export default function LoginForm({ onSubmit, loading }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>();
  const [secureTextEntry, setSecureTextEntry] = useState(false);
    const passwordRef = useRef<TextInput>(null);
  // khi nhấn Enter trên username → focus password
  const onUsernameSubmit = (
  ) => {
    passwordRef.current?.focus();
  };

  // khi nhấn Enter trên password → submit luôn, hide keyboard
  const onPasswordSubmit = () => {
    Keyboard.dismiss();
    {handleSubmit(onSubmit)};
    // onSubmit({ email: username, password });
  };
  
  return (
    <View style={styles.container}>
      <XText variant="h1" style={{ textAlign: 'center' , marginBottom: 20 }}>GALAXY ME</XText>
      <Controller
        control={control}
        name="email"
        rules={{ required: 'Email là bắt buộc' }}
        render={({ field: { onChange, value } }) => (
          <XInput placeholder="Username" 
          value={value} onChangeText={onChange} iconLeft="user" onSubmitEditing={onUsernameSubmit}/>
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        rules={{ required: 'Mật khẩu không được để trống' }}
        render={({ field: { onChange, value } }) => (
          <XInput secureTextEntry={secureTextEntry} 
            ref={passwordRef}
            placeholder="Password" value={value} onChangeText={onChange} 
            iconLeft="passwordCheck"
            iconRight={secureTextEntry?"showPassword":"hidePassword"}
            onIconRightPress={() => setSecureTextEntry(prev => !prev)}
            onSubmitEditing={onPasswordSubmit}
            />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <XButton
        title="Sign In"
        onPress={handleSubmit(onSubmit)}
        backgroundColor={ XColors.primary}
        disabled={loading}
        
      />
      
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6 },
  error: { color: 'red' },
});
