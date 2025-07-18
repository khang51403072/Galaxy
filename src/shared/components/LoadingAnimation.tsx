import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import LogoWhite from '../assets/icons/LogoWhite.svg';
import Group1 from '../assets/icons/Group1.svg';
import Group2 from '../assets/icons/Group2.svg';
import { useTheme } from '../theme';

const { width, height } = Dimensions.get('window');

export default function LoadingAnimation() {
  // Animated values
  const group2Opacity = useRef(new Animated.Value(0)).current;
  const group2Scale = useRef(new Animated.Value(0.7)).current;
  const group1Opacity = useRef(new Animated.Value(0)).current;
  const group1Scale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const theme = useTheme()
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    },
    centered: {
      position: 'absolute',
      left: '50%',
      top: '50%',
    },
  });
  useEffect(() => {
    const showSequence = Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, speed: 12, bounciness: 4, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(group1Opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.spring(group1Scale, { toValue: 1, speed: 12, bounciness: 4, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(group2Opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.spring(group2Scale, { toValue: 1, speed: 12, bounciness: 4, useNativeDriver: true }),
      ]),
    ]);

    const resetSequence = Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 0.7, speed: 12, bounciness: 4, useNativeDriver: true }),
      Animated.timing(group1Opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.spring(group1Scale, { toValue: 0.7, speed: 12, bounciness: 4, useNativeDriver: true }),
      Animated.timing(group2Opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.spring(group2Scale, { toValue: 0.7, speed: 12, bounciness: 4, useNativeDriver: true }),
    ]);

    const fullCycle = Animated.sequence([showSequence, resetSequence]);
    Animated.loop(fullCycle).start();
  }, []);

  const logoSize = 500 * 0.22;
  const group1Size = 500 * 0.34;
  const group2Size = 500 * 0.66;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.centered,
          {
            width: group2Size,
            height: group2Size,
            opacity: group2Opacity,
            transform: [
              { scale: group2Scale },
              { translateX: Animated.multiply(group2Scale, -group2Size / 2) },
              { translateY: Animated.multiply(group2Scale, -group2Size / 2) },
            ],
          },
        ]}
        pointerEvents="none"
      >
        <Group2 width={group2Size} height={group2Size} preserveAspectRatio="xMidYMid meet" />
      </Animated.View>
      <Animated.View
        style={[
          styles.centered,
          {
            width: group1Size,
            height: group1Size,
            opacity: group1Opacity,
            transform: [
              { scale: group1Scale },
              { translateX: Animated.multiply(group1Scale, -group1Size / 2) },
              { translateY: Animated.multiply(group1Scale, -group1Size / 2) },
            ],
          },
        ]}
        pointerEvents="none"
      >
        <Group1 width={group1Size} height={group1Size} preserveAspectRatio="xMidYMid meet" />
      </Animated.View>
      <Animated.View
        style={[
          styles.centered,
          {
            width: logoSize,
            height: logoSize,
            opacity: logoOpacity,
            transform: [
              { scale: logoScale },
              { translateX: Animated.multiply(logoScale, -logoSize / 2) },
              { translateY: Animated.multiply(logoScale, -logoSize / 2) },
            ],
          },
        ]}
        pointerEvents="none"
      >
        <LogoWhite width={logoSize} height={logoSize} preserveAspectRatio="xMidYMid meet" />
      </Animated.View>
    </View>
  );
}

