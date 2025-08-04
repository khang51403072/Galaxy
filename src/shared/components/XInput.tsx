import React, { forwardRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  Text,
} from 'react-native';
import XIcon, { iconMap } from './XIcon';
import { useTheme } from '../theme';
import XText from './XText';

type XInputProps = TextInputProps & {
  iconLeft?: keyof typeof iconMap;
  iconRight?: keyof typeof iconMap | React.ReactNode;
  onIconRightPress?: () => void;
  errorMessage?: string;
  isRequired?: boolean;
  label?: string;
  autoCompleteType?: React.ComponentProps<typeof TextInput>["autoComplete"];
  autoCorrect?: boolean;
  display?: 'none' | 'flex';
  editable?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';

};

const XInput = forwardRef<TextInput, XInputProps>(
  (
    {
      placeholder,
      value,
      onChangeText,
      iconLeft,
      iconRight,
      onIconRightPress,
      secureTextEntry,
      onSubmitEditing,
      blurOnSubmit,
      style,
      errorMessage,
      isRequired = false,
      label,
      autoCompleteType = 'off',
      autoCorrect = false,
      display = 'flex',
      editable = true,
      keyboardType = 'default',
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const theme = useTheme()
    const borderColor = isFocused ? theme.colors.border : theme.colors.primary;
    const iconColor = isFocused ? theme.colors.primary : '#999';
    const styles = StyleSheet.create({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: theme.colors.primary,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 0,
        backgroundColor: theme.colors.background,
        marginBottom: 0
      },
      iconLeft: {
        marginRight: ICON_MARGIN_HORIZONTAL,
      }, 
      iconRight: {
        marginLeft: ICON_MARGIN_HORIZONTAL,
      },
      
    });
    return (
      <View style={[{ width: '100%',}, style]}>
        {label && (
          <View style={{ flexDirection: 'row', 
          alignItems: 'center',  marginBottom: theme.spacing.xs}}>
            <XText variant='bodyRegular'>{label}</XText>
            {isRequired && <Text style={{ color: 'red', marginLeft: 2 }}>*</Text>}
          </View>
        )}
        <View style={[
          styles.container,
          { borderColor: borderColor},
        ]}> 
          {iconLeft && (
            <XIcon
              style={[styles.iconLeft]}
              name={iconLeft}
              width={20}
              height={20}
              color={iconColor}
            />
          )}
          <TextInput
            ref={ref}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textInputPlaceholder}
            editable={editable}
            pointerEvents={editable ? 'auto' : 'none'} 
            style={[
              theme.typography.titleRegular,
              {
                paddingVertical: theme.spacing.sm,
                paddingHorizontal: theme.spacing.sm,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                textAlignVertical: 'center',
                includeFontPadding: true,

              },
            ]}
            value={value}
            onChangeText={(text)=>{
              if(keyboardType === 'phone-pad'){
                onChangeText?.(text.replace(/[^0-9]/g, '').formatPhoneNumber());
              }else{
                onChangeText?.(text);
              }
            }}
            secureTextEntry={secureTextEntry}
            onSubmitEditing={onSubmitEditing}
            blurOnSubmit={blurOnSubmit}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoComplete={autoCompleteType}
            autoCorrect={autoCorrect}
            keyboardType={keyboardType}
            {...rest}
          />
          {iconRight && (
            <TouchableOpacity onPress={onIconRightPress} style={styles.iconRight}>
              {typeof iconRight === 'string' ? (
                <XIcon name={iconRight as any} width={20} height={20} color={theme.colors.textInputPlaceholder} />
              ) : iconRight}
            </TouchableOpacity>
          )}
        </View>
        {errorMessage ? (
            <XText variant='captionLight' style={{ color: 'red', marginBottom: 8, marginStart: 12 }}>{errorMessage}</XText>
          ) : null}
      </View>
    );
  }
);
const ICON_MARGIN_HORIZONTAL = 8;



export default XInput;
