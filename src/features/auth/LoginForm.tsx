import React from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { LoginInput } from './AuthTypes';

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

  return (
    <View style={styles.container}>
      <Text>Email</Text>
      <Controller
        control={control}
        name="email"
        rules={{ required: 'Email là bắt buộc' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Nhập email"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Text>Mật khẩu</Text>
      <Controller
        control={control}
        name="password"
        rules={{ required: 'Mật khẩu không được để trống' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            value={value}
            onChangeText={onChange}
            secureTextEntry
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <Button
        title={loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        onPress={handleSubmit(onSubmit)}
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
