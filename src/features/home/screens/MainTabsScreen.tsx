

// src/navigation/MainTabs.tsx
import React, { useRef, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import XIcon from '../../../shared/components/XIcon';
import XBottomTabBar from '../../../shared/components/XBottomTabBar';
import HomeScreen from './tabs/HomeScreen';
import ProfileScreen from './tabs/ProfileScreen';
import { useTheme } from '@/shared/theme';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Animated, Dimensions, Easing } from 'react-native';

const Tab = createBottomTabNavigator();

const TAB_NAMES = ['DashBoard', 'Profile'];
const TAB_COMPONENTS = {
  DashBoard: HomeScreen,
  Profile: ProfileScreen,
};
const SCREEN_WIDTH = Dimensions.get('window').width;

function SwipeableTab({ tabNames }: { tabNames: string[]; children: React.ReactNode }) {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const gestureX = useRef(new Animated.Value(0)).current;
  const animating = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTab, setTransitionTab] = useState<number | null>(null);
  const [slideInDirection, setSlideInDirection] = useState<null | 'left' | 'right'>(null);

  const currentIndex = tabNames.indexOf(route.name);
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : null;
  const nextIndex = currentIndex < tabNames.length - 1 ? currentIndex + 1 : null;
  const CurrentComponent = TAB_COMPONENTS[tabNames[currentIndex] as keyof typeof TAB_COMPONENTS];
  const PrevComponent = prevIndex !== null ? TAB_COMPONENTS[tabNames[prevIndex] as keyof typeof TAB_COMPONENTS] : null;
  const NextComponent = nextIndex !== null ? TAB_COMPONENTS[tabNames[nextIndex] as keyof typeof TAB_COMPONENTS] : null;

  // Always render prev, current, next tab
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: gestureX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (animating.current) return;
    const { translationX, state } = event.nativeEvent;
    if (state === State.END) {
      if (translationX < -SCREEN_WIDTH / 4 && nextIndex !== null) {
        animating.current = true;
        setIsTransitioning(true);
        setTransitionTab(nextIndex);
        setSlideInDirection('left');
        Animated.timing(gestureX, {
          toValue: -SCREEN_WIDTH,
          duration: 350,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic),
        }).start(() => {
          // KHÔNG reset gestureX ở đây, giữ ở -SCREEN_WIDTH
          navigation.navigate(tabNames[nextIndex] as never);
          animating.current = false;
        });
      } else if (translationX > SCREEN_WIDTH / 4 && prevIndex !== null) {
        animating.current = true;
        setIsTransitioning(true);
        setTransitionTab(prevIndex);
        setSlideInDirection('right');
        Animated.timing(gestureX, {
          toValue: SCREEN_WIDTH,
          duration: 350,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic),
        }).start(() => {
          // KHÔNG reset gestureX ở đây, giữ ở SCREEN_WIDTH
          navigation.navigate(tabNames[prevIndex] as never);
          animating.current = false;
        });
      } else {
        Animated.timing(gestureX, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic),
        }).start();
      }
    }
  };

  React.useEffect(() => {
    // Khi tab mới render ra, nếu vừa swipe thì animate gestureX về 0 để tab mới slide vào
    if (isTransitioning && slideInDirection && transitionTab !== null) {
      let fromValue = slideInDirection === 'left' ? SCREEN_WIDTH : -SCREEN_WIDTH;
      gestureX.setValue(fromValue);
      Animated.timing(gestureX, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.cubic),
      }).start(() => {
        setIsTransitioning(false);
        setTransitionTab(null);
        setSlideInDirection(null);
      });
    } else {
      gestureX.setValue(0);
      setIsTransitioning(false);
      setTransitionTab(null);
      setSlideInDirection(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.name]);

  // translateX logic giống native tab view
  const currentTabTranslate = gestureX;
  const prevTabTranslate = Animated.add(gestureX, new Animated.Value(-SCREEN_WIDTH));
  const nextTabTranslate = Animated.add(gestureX, new Animated.Value(SCREEN_WIDTH));

  // Khi đang transition, giữ cả tab cũ và tab mới trên màn hình
  const renderTabs = () => {
    if (isTransitioning && transitionTab !== null) {
      const TransitionComponent = TAB_COMPONENTS[tabNames[transitionTab] as keyof typeof TAB_COMPONENTS];
      const isNext = transitionTab > currentIndex;
      return (
        <>
          {/* Tab cũ */}
          <Animated.View style={{ position: 'absolute', left: 0, top: 0, width: SCREEN_WIDTH, height: '100%', transform: [{ translateX: currentTabTranslate }], backgroundColor: theme.colors.background, zIndex: 2 }}>
            {React.createElement(CurrentComponent)}
          </Animated.View>
          {/* Tab mới */}
          <Animated.View style={{ position: 'absolute', left: 0, top: 0, width: SCREEN_WIDTH, height: '100%', transform: [{ translateX: isNext ? nextTabTranslate : prevTabTranslate }], backgroundColor: theme.colors.background, zIndex: 1 }}>
            {React.createElement(TransitionComponent)}
          </Animated.View>
        </>
      );
    }
    // Bình thường, render prev, current, next như cũ
    return (
      <>
        {PrevComponent && (
          <Animated.View style={{ position: 'absolute', left: 0, top: 0, width: SCREEN_WIDTH, height: '100%', transform: [{ translateX: prevTabTranslate }], backgroundColor: theme.colors.background, zIndex: 1 }}>
            {React.createElement(PrevComponent)}
          </Animated.View>
        )}
        <Animated.View style={{ position: 'absolute', left: 0, top: 0, width: SCREEN_WIDTH, height: '100%', transform: [{ translateX: currentTabTranslate }], backgroundColor: theme.colors.background, zIndex: 2 }}>
          {React.createElement(CurrentComponent)}
        </Animated.View>
        {NextComponent && (
          <Animated.View style={{ position: 'absolute', left: 0, top: 0, width: SCREEN_WIDTH, height: '100%', transform: [{ translateX: nextTabTranslate }], backgroundColor: theme.colors.background, zIndex: 1 }}>
            {React.createElement(NextComponent)}
          </Animated.View>
        )}
      </>
    );
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      activeOffsetX={[-10, 10]}
      failOffsetY={[-20, 20]}
    >
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {renderTabs()}
      </View>
    </PanGestureHandler>
  );
}

export default function MainTabsScreen() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textInputPlaceholder,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          switch (route.name) {
            case 'DashBoard':
              iconName = 'home';
              break;
            case 'Profile':
              iconName = 'profile';
              break;
          }
          return <XIcon name={iconName as any} width={size} height={size} color={color} />;
        },
      })}
      tabBar={(props) => <XBottomTabBar {...props} />}
    >
      <Tab.Screen name="DashBoard">
        {() => <SwipeableTab tabNames={TAB_NAMES}><HomeScreen /></SwipeableTab>}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {() => <SwipeableTab tabNames={TAB_NAMES}><ProfileScreen /></SwipeableTab>}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
