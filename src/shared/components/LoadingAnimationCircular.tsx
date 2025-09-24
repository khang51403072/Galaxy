import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Animated, Easing, View } from 'react-native';
import LogoWhite from '../assets/icons/LogoWhite.svg';
import Group1 from '../assets/icons/Group1.svg';
import Group2 from '../assets/icons/Group2.svg';
import { useTheme } from '../theme';
import LinearGradient from 'react-native-linear-gradient';

export default function LoadingAnimationRotating() {
  // --- CÁC ANIMATED VALUE ---
  // Cho hiệu ứng co giãn lan tỏa (giống như cũ)
  const group2Opacity = useRef(new Animated.Value(0)).current;
  const group2Scale = useRef(new Animated.Value(0.7)).current;
  const group1Opacity = useRef(new Animated.Value(0)).current;
  const group1Scale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;

  // Thêm một Animated.Value MỚI chỉ để xoay
  const rotateValue = useRef(new Animated.Value(0)).current;
  
  const theme = useTheme();

  useEffect(() => {
    // --- ANIMATION CO GIÃN (giữ nguyên) ---
    const showSequence = Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, speed: 12, bounciness: 4, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(group1Opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(group1Scale, { toValue: 1, speed: 12, bounciness: 4, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(group2Opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
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

    const scaleCycle = Animated.sequence([showSequence, Animated.delay(5000), resetSequence]);
    
    // --- ANIMATION XOAY (mới) ---
    const rotation = Animated.timing(rotateValue, {
        toValue: 1,
        duration: 3000, // Tốc độ xoay
        easing: Easing.linear,
        useNativeDriver: true,
    });
    
    // Chạy cả hai animation LẶP LẠI MÃI MÃI
    Animated.loop(scaleCycle).start();
    Animated.loop(rotation).start();

  }, [group1Opacity, group1Scale, group2Opacity, group2Scale, logoOpacity, logoScale, rotateValue]);

  // Nội suy giá trị xoay (0 -> 1) thành góc ('0deg' -> '360deg')
  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  // Bạn có thể tạo hiệu ứng xoay ngược chiều cho lớp ở giữa nếu muốn
  const spinReverse = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  const logoSize = 500 * 0.22;
  const group1Size = 500 * 0.34;
  const group2Size = 500 * 0.66;
  // STYLES GIỮ NGUYÊN NHƯ PHIÊN BẢN ĐÚNG TRƯỚC ĐÓ
const styles = useMemo(
    () => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: theme.colors.blackOpacity25
    },
    animatedElement: {
        position: 'absolute',
    },
    }),[theme]
    ) ;



  return (
    <View 
    //   colors={theme.colors.splashScreen}
    //   start={{ x: 0.5, y: 0 }}
    //   end={{ x: 0.5, y: 1 }}
      
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.animatedElement,
          {
            width: group2Size,
            height: group2Size,
            opacity: group2Opacity,
            // THÊM TRANSFORM XOAY
            transform: [{ scale: group2Scale }, { rotate: spin }],
          },
        ]}
        pointerEvents="none"
      >
        <Group2 width="100%" height="100%" />
      </Animated.View>
      
      <Animated.View
        style={[
          styles.animatedElement,
          {
            width: group1Size,
            height: group1Size,
            opacity: group1Opacity,
            transform: [{ scale: group1Scale }, { rotate: spinReverse }], // Xoay ngược chiều
          },
        ]}
        pointerEvents="none"
      >
        <Group1 width="100%" height="100%" />
      </Animated.View>
      
      <Animated.View
        style={[
          styles.animatedElement,
          {
            width: logoSize,
            height: logoSize,
            opacity: logoOpacity,
            transform: [{ scale: logoScale },  ],
          },
        ]}
        pointerEvents="none"
      >
        <LogoWhite width="100%" height="100%" />
      </Animated.View>
    </View>
  );
}

