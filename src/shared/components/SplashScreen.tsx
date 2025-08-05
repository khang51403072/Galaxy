import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LoadingAnimation from './LoadingAnimation';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ROUTES, RootStackParamList } from '../../app/routes';
import { useTheme } from '../theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const hasNavigated = useRef(false);
  const theme = useTheme()
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width,
      height,
      backgroundColor: theme.colors.primaryMain,
    },
  }); 
 
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        navigation.reset({ index: 0, routes: [{ name: ROUTES.LOGIN }] });
      }
    }, 3800);
    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LoadingAnimation />
    </View>
  );
}

