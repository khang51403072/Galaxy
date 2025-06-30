import React, { forwardRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  Text,
} from 'react-native';
import { XColors } from '../constants/colors';
import XIcon, { iconMap } from './XIcon';
import { TextStyles } from '../constants/textStyles';

type XInputProps = TextInputProps & {
  iconLeft?: keyof typeof iconMap;
  iconRight?: keyof typeof iconMap;
  onIconRightPress?: () => void;
  errorMessage?: string;
  isRequired?: boolean;
  label?: string;
  autoCompleteType?: React.ComponentProps<typeof TextInput>["autoComplete"];
  autoCorrect?: boolean;
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
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const borderColor = isFocused ? XColors.accent : XColors.primary;
    const iconColor = isFocused ? XColors.primary : '#999';
    return (
      <View style={{ width: '100%' }}>
        {label && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={TextStyles.inputLabel}>{label}</Text>
            {isRequired && <Text style={{ color: 'red', marginLeft: 2 }}>*</Text>}
          </View>
        )}
        <View style={[
          styles.container,
          { borderColor: borderColor },
        ]}> 
          {iconLeft && (
            <XIcon
              style={[styles.iconLeft]}
              name={iconLeft}
              width={18}
              height={18}
              color={iconColor}
            />
          )}
          <TextInput
            ref={ref}
            placeholder={placeholder}
            placeholderTextColor={XColors.textInputPlaceholder}
            style={[
              TextStyles.inputText,
              {
                flex: 1,
                paddingLeft: 0,
                paddingRight: 0,
                paddingVertical: 0,
              },
              style,
            ]}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            onSubmitEditing={onSubmitEditing}
            blurOnSubmit={blurOnSubmit}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoComplete={autoCompleteType}
            autoCorrect={autoCorrect}
            {...rest}
          />
          {iconRight && (
            <TouchableOpacity onPress={onIconRightPress} style={styles.iconRight}>
              <XIcon name={iconRight} width={18} height={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <View style={{ minHeight: 18, justifyContent: 'flex-end', }}>
          {errorMessage ? (
            <Text style={{ color: 'red', fontSize: 12, marginBottom: 8, marginStart: 12 }}>{errorMessage}</Text>
          ) : null}
        </View>
      </View>
    );
  }
);
const ICON_MARGIN_HORIZONTAL = 8;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: XColors.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  iconLeft: {
    marginRight: ICON_MARGIN_HORIZONTAL,
  }, 
  iconRight: {
    marginLeft: ICON_MARGIN_HORIZONTAL,
  },
  
});

export default XInput;
