// src/features/home/screens/MainTabsScreen.tsx
import React, { useState, useRef, useEffect, useCallback, ComponentType, useMemo } from 'react';
import { View, Dimensions, TouchableOpacity, Alert } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';
import { useTheme } from '@/shared/theme';
import XIcon from '../../../shared/components/XIcon';
import HomeScreen from './tabs/HomeScreen';
import { appConfig } from '@/shared/utils/appConfig';
import { useUserStore } from '../stores/profileStore';
import ProfileScreenNew from './tabs/MEScreen';
import { ReviewScreen } from '@/features/review/screens/ReviewScreen';
import { useHomeStore } from '../stores/homeStore';
import { useShallow } from 'zustand/react/shallow';
import { useReviewStore } from '@/features/review/stores/reviewStore';
import { Permissions } from '@/features/auth/types/AuthTypes';

// --- TYPE DEFINITIONS ---
interface MainTabsRoutesProps { 
  name: string;
  component: ComponentType<any>; // SỬA 1: Sửa type ở đây
  icon: string;
  label: string;
}

interface CustomTabBarProps {
  activeIndex: number;
  handleTabChange: (index: number) => void;
  routes: MainTabsRoutesProps[];
  slideAnim: Animated.SharedValue<number>; // SỬA 2: Sửa type ở đây
}

// --- COMPONENTS ---
const CustomTabBar = ({ activeIndex, handleTabChange, routes, slideAnim }: CustomTabBarProps) => {
  const theme = useTheme();

  // SỬA 3: Định nghĩa animated style ở đây
  const animatedTabBarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            slideAnim.value,
            [0, 1],
            [100, 0], // Tăng giá trị để thấy rõ animation
            Extrapolate.CLAMP
          ),
        },
      ],
      opacity: slideAnim.value,
    };
  });

  return (
    <Animated.View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: theme.colors.background,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingBottom: 20,
          paddingTop: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          ...theme.shadows.md,
        },
        animatedTabBarStyle, // SỬA 4: Áp dụng style ở đây
      ]}
    >
      {routes.map((route, index) => (
        <TouchableOpacity
          key={route.name}
          style={{ flex: 1, alignItems: 'center', paddingVertical: 8 }}
          onPress={() => handleTabChange(index)}
        >
          <XIcon
            name={activeIndex === index ? `${route.icon}Filled` as any : `${route.icon}Outline` as any}
            width={24}
            height={24}
            color={activeIndex === index ? theme.colors.primaryMain : theme.colors.gray700}
          />
          <Animated.Text
            style={{
              ...theme.typography.captionRegular,
              marginTop: 4,
              color: theme.colors.gray800,
            }}
          >
            {route.label}
          </Animated.Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
};

export default function MainTabsScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const slideAnim = useSharedValue(0);

  const json = useHomeStore(useShallow(state=> state.json))
  const getPermission = useReviewStore(useShallow(state=>state.getPermission))
  const routes: MainTabsRoutesProps[] = useMemo(
    ()=>{
      return json?.employeeSettings.hideReviewManagement ? [
        { name: 'Dashboard', component: HomeScreen, icon: 'home', label: 'Dashboard' },
        { name: 'ME', component: ProfileScreenNew, icon: 'profile', label: 'ME' },
      ]:[
        { name: 'Dashboard', component: HomeScreen, icon: 'home', label: 'Dashboard' },
        { name: 'Reviews', component: ReviewScreen, icon: 'star', label: 'Reviews' },
        { name: 'ME', component: ProfileScreenNew, icon: 'profile', label: 'ME' },
      ]
    },[json]
  );

  const handleTabChange = useCallback((index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    pagerRef.current?.setPage(index);
  }, [activeIndex]);

  const checkShowBiometricGuide = useCallback(async () => {
    try {
        // 1. Lấy trạng thái đã lưu từ bộ nhớ (AsyncStorage)
        const isBiometricEnabled = await appConfig.getUseBiometric();

        // 2. Nếu tính năng CHƯA BAO GIỜ được bật (hoặc bị tắt)
        if (!isBiometricEnabled) {
            // 3. Hiển thị Alert để hỏi người dùng
            Alert.alert(
                'Enable faster sign-in', // Title
                'Would you like to enable Face ID/Touch ID for quicker access next time?', // Message
                [
                    { text: 'Later', style: 'cancel' }, // Nút "Để sau"
                    { 
                        text: 'Enable Now', // Nút "Bật ngay"
                        onPress: () => {
                            // 4a. Cập nhật state trong Zustand store để màn hình Profile biết cần hiển thị tooltip
                            useUserStore.getState().setShowTooltip(true);

                            // 4b. Chuyển người dùng sang tab Profile (có index là 1)
                            handleTabChange(1);
                        }
                    }
                ]
            );
        }
    } catch (error) {
      console.error("Failed to check biometric guide:", error);
    }
  }, [handleTabChange]);

  useEffect(() => {
    slideAnim.value = withSpring(1, { damping: 10, stiffness: 100 });
    checkShowBiometricGuide();
  }, [checkShowBiometricGuide, slideAnim]);

  const handlePageChange = useCallback((event: any) => {
    const newIndex = event.nativeEvent.position;
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex]);
  console.log("Mainscreen render")
  return (
    <View style={{ flex: 1 }}>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={handlePageChange}
      >
        {routes.map((route) => {
          const RouteComponent = route.component;
          return (
            <View key={route.name}>
              <RouteComponent />
            </View>
          );
        })}
      </PagerView>
      
      <CustomTabBar 
        activeIndex={activeIndex}  
        handleTabChange={handleTabChange} 
        routes={routes} 
        slideAnim={slideAnim} // SỬA 5: Truyền cả object SharedValue
      />
    </View>
  );
}