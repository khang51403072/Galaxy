import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useBackHandler = (onBack: () => void) => {
  const navigation = useNavigation();

  useEffect(() => {
    const backHandler = () => {
      onBack();
      return true;
    };

    // iOS gesture back và navigation back
    navigation.addListener('beforeRemove', backHandler);
    
    // Android hardware back button
    const androidBackHandler = BackHandler.addEventListener('hardwareBackPress', backHandler);
    
    return () => {
      navigation.removeListener('beforeRemove', backHandler);
      androidBackHandler.remove();
    };
  }, [navigation, onBack]);
}; 