import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LoadingAnimation from './LoadingAnimation';
import { XColors } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ROUTES, RootStackParamList } from '../../app/routes';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const hasNavigated = useRef(false);

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    backgroundColor: XColors.primary,
  },
}); 