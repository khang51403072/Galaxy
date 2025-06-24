import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  ActivityIndicator,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  backgroundColor?: string;
  loading?: boolean;
  useGradient?: boolean;
};

export default function XButton({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
  backgroundColor = '#4A90E2', // default màu xanh
  loading = false,
  useGradient = true,
}: Props) {
  const content = loading ? (
    <ActivityIndicator color="#FFF" />
  ) : (
    <Text style={[styles.text, textStyle]}>{title.toUpperCase()}</Text>
  );

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.wrapper,
        { backgroundColor: (!useGradient || disabled) ? backgroundColor : 'transparent' },
        style,
      ]}
    >
      {(useGradient && !disabled) ? (
        <LinearGradient
          colors={["#3B96F6", "#1D62D8"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View style={[styles.content, { backgroundColor: 'transparent' }]}> 
        {content}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderRadius: 24, // height/2 = 48/2
    // paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 4 },
    //     shadowOpacity: 0.2,
    //     shadowRadius: 6,
    //   },
    //   android: {
    //     elevation: 4,
    //   },
    // }),
  },
  disabledWrapper: {
    opacity: 0.5,
    
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
});
