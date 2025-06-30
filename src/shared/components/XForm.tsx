import React, { useRef } from 'react';
import { View, TextInput, ReturnKeyTypeOptions, ScrollView } from 'react-native';
import { useForm, Controller, FieldValues, UseFormProps, RegisterOptions } from 'react-hook-form';
import XInput from './XInput';
import XButton from './XButton';
import XText from './XText';
import { iconMap } from './XIcon';
import {  useTheme } from '../theme';
export type XFormField = {
  name: string;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions;
  type?: 'text' | 'email' | 'password' | 'number' | 'phone';
  iconLeft?: keyof typeof iconMap;
  iconRight?: keyof typeof iconMap;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  renderInput?: (props: any) => React.ReactElement; // custom render
};

type XFormProps<T extends FieldValues> = {
  fields: XFormField[];
  onSubmit: (data: T) => void;
  defaultValues?: UseFormProps<T>['defaultValues'];
  loading?: boolean;
  confirmTitle?: string;
  onCancel?: () => void;
  style?: any;
  confirmDisabled?: boolean;
  errorMessage?: string;
  cancelTitle?: string;
};

export default function XForm<T extends FieldValues = any>({
  fields,
  onSubmit,
  defaultValues,
  loading,
  confirmTitle = 'CONFIRM',
  onCancel,
  style,
  confirmDisabled,
  errorMessage,
  cancelTitle = 'CANCEL',
}: XFormProps<T>) {
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<T>({
    mode: 'onChange',
    defaultValues,
  });
  const theme = useTheme();
  // Tạo ref cho từng input để điều hướng next/done
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Xác định returnKeyType và onSubmitEditing cho từng input
  const getInputProps = (idx: number) => {
    const isLast = idx === fields.length - 1;
    return {
      returnKeyType: (isLast ? 'done' : 'next') as ReturnKeyTypeOptions,
      blurOnSubmit: isLast,
      onSubmitEditing: isLast
        ? handleSubmit(onSubmit)
        : () => inputRefs.current[idx + 1]?.focus(),
      ref: (ref: TextInput | null) => { inputRefs.current[idx] = ref; },
    };
  };

  return (
    <View style={[{ flex: 1, backgroundColor: '#fff' }, style]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.xs, paddingBottom: theme.spacing.sm }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {fields.map((field, idx) => (
          <Controller
            key={field.name}
            control={control}
            name={field.name as any}
            rules={field.rules as any}
            render={({ field: { onChange, value } }) => {
              if (field.renderInput) {
                const input = field.renderInput({
                  value,
                  onChangeText: onChange,
                  errorMessage: errors[field.name]?.message,
                  ...getInputProps(idx),
                });
                return input ? input : <></>;
              }
              return (
                <XInput
                  label={field.label}
                  placeholder={field.placeholder}
                  value={value}
                  onChangeText={onChange}
                  iconLeft={field.iconLeft}
                  iconRight={field.iconRight}
                  secureTextEntry={field.type === 'password' || field.secureTextEntry}
                  autoCapitalize={field.autoCapitalize}
                  keyboardType={field.keyboardType}
                  errorMessage={errors[field.name]?.message as string}
                  {...getInputProps(idx)}
                />
              );
            }}
          />
        ))}
        {errorMessage ? (
          <XText style={{ color: 'red', marginBottom: 12, textAlign: 'center' }}>{errorMessage}</XText>
        ) : null}
      </ScrollView>
      <View style={{ padding: 16, backgroundColor: '#fff' }}>
        <View style={{ flexDirection: 'row', justifyContent: onCancel ? 'space-between' : 'center', alignItems: 'center' }}>
          {onCancel && (
            <XButton
              title={cancelTitle}
              onPress={onCancel}
              useGradient={false}
              backgroundColor="#ccc"
              style={{ flex: 1, marginRight: 8 }}
            />
          )}
          <XButton
            title={confirmTitle}
            onPress={handleSubmit(onSubmit)}
            disabled={confirmDisabled ?? (!isValid || loading)}
            loading={loading}
            style={{ flex: 2 }}
          />
        </View>
      </View>
    </View>
  );
} 