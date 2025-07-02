import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { LoginInput } from '../types/AuthTypes';
import XInput from '../../../shared/components/XInput';
import FormBase from '../../../shared/components/FormBase';
import XText from '../../../shared/components/XText';

type LoginFormProps = {
  onSubmit: (data: LoginInput) => void;
  loading?: boolean;
  onCancel?: () => void;
};

export default function LoginForm({ onSubmit, loading, onCancel }: LoginFormProps) {
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginInput>();

  const passwordRef = useRef<TextInput>(null);

  const email = watch('email');
  const password = watch('password');

  // Khi nhấn Enter ở username, focus sang password
  const onUsernameSubmit = () => {
    passwordRef.current?.focus();
  };

  // Khi nhấn Enter ở password, submit form
  const onPasswordSubmit = handleSubmit(onSubmit);
  const [showPassword, shetShowPassword] = useState(false);
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.inner}>
          <XText variant="h1" style={{ textAlign: 'center', marginBottom: 20 }}>
            GALAXY ME
          </XText>
          <FormBase
            onConfirm={handleSubmit(onSubmit)}
            onCancel={onCancel}
            confirmTitle="Sign In"
            confirmLoading={loading}
            style={{ gap: -1 }}
            confirmDisabled={!email || !password}
          >
            <Controller
              control={control}
              name="email"
              rules={{ required: 'Email là bắt buộc' }}
              render={({ field: { onChange, value } }) => (
                <XInput
                  placeholder="Username"
                  value={value}
                  onChangeText={onChange}
                  isRequired={true}
                  iconLeft="user"
                  onSubmitEditing={onUsernameSubmit}
                  blurOnSubmit={false}
                  errorMessage={errors.email?.message}
                  returnKeyType="next"
                  autoCorrect={false}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              rules={{ required: 'Mật khẩu không được để trống' }}
              render={({ field: { onChange, value } }) => (
                <XInput
                  ref={passwordRef}
                  placeholder="Password"
                  value={value}
                  onChangeText={onChange}
                  iconLeft="passwordCheck"
                  iconRight={!showPassword ? "showPassword" : "hidePassword"}
                  secureTextEntry={!showPassword}
                  onIconRightPress={() => shetShowPassword(!showPassword)}
                  onSubmitEditing={onPasswordSubmit}
                  blurOnSubmit={true}
                  errorMessage={errors.password?.message}
                  returnKeyType="done"
                />
              )}
            />
          </FormBase>
          
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  inner: {
    justifyContent: 'center'
  },
});

