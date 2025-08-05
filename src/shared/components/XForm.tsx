import React, { useRef } from 'react';
import { View, TextInput, ReturnKeyTypeOptions, ScrollView, DimensionValue } from 'react-native';
import { useForm, Controller, FieldValues, UseFormProps, RegisterOptions } from 'react-hook-form';
import XInput from './XInput';
import XButton from './XButton';
import XText from './XText';
import { iconMap } from './XIcon';
import {  useTheme } from '../theme';



// Phone number validation function
const validatePhoneNumber = (text: string): boolean => {
  const cleaned = text.replace(/\D/g, '');
  return cleaned.length === 10;
};

/*
Example usage for phone field:
const phoneFields: XFormField[] = [
  {
    name: 'phone',
    label: 'Phone Number',
    placeholder: '(033) 668-8197',
    type: 'phone',
    rules: {
      required: 'Phone number is required',
      validate: (value) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length !== 10) {
          return 'Phone number must be 10 digits';
        }
        return true;
      }
    }
  }
];
*/

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
  onIconRightPress?: () => void;
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
  maxHeight?: DimensionValue|undefined;
  scrollEnabled?: boolean;
  gap?: number;
  isGradient?: boolean;
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
  maxHeight = '100%',
  scrollEnabled = true,
  gap = 8,
  isGradient = false,
  
}: XFormProps<T>) {
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<T>({
    mode: 'onChange',
    defaultValues:defaultValues,
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
        ? handleSubmit((data) => {
          onSubmit(data);
          
        })
        : () => inputRefs.current[idx + 1]?.focus(),
      ref: (ref: TextInput | null) => { inputRefs.current[idx] = ref; },
    };
  };
  let children = <View style={{gap: gap, flexDirection: 'column'}}>{fields.map((field, idx) => (
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

        // Handle phone number formatting
        const handlePhoneChange = (text: string) => {
          if (field.type === 'phone') {
            const formatted = text.formatPhoneNumber();
            onChange(formatted);
          } else {
            onChange(text);
          }
        };

        // Set keyboard type for phone fields
        const keyboardType = field.type === 'phone' ? 'phone-pad' : field.keyboardType;

        return (
          
          <XInput
            label={field.label}
            placeholder={field.placeholder}
            value={value}
            onChangeText={handlePhoneChange}
            iconLeft={field.iconLeft}
            iconRight={field.iconRight}
            secureTextEntry={field.type === 'password' && field.secureTextEntry}
            autoCapitalize={field.autoCapitalize}
            keyboardType={keyboardType}
            errorMessage={errors[field.name]?.message as string}
            onIconRightPress={field.onIconRightPress}
            {...getInputProps(idx)}
          />
         
        );
      }}
    />
  ))}
  {errorMessage ? (
    <XText style={{ color: 'red', marginBottom: 12, textAlign: 'center' }}>{errorMessage}</XText>
  ) : null}</View>
  
  if(scrollEnabled) 
  {
    children = 
      <ScrollView
        style={{ flex:1 }}
        contentContainerStyle={{ padding: theme.spacing.xs, paddingBottom: theme.spacing.sm }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
      >
        {children}
      </ScrollView>
  }

  
  return (
    <View style={[{ flex: scrollEnabled?1:0, backgroundColor: theme.colors.background, maxHeight: maxHeight }, style]}>
      {children}
      <View style={{ paddingBottom: theme.spacing.md,}}>
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
            style={{ flex: 1 }}
            useGradient={isGradient}
          />
        </View>
      </View>
    </View>
  );
} 