import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useThemeContext, getAvailableThemes } from '../theme';
import XText from './XText';
import LinearGradient from 'react-native-linear-gradient';

interface ThemeSelectorProps {
  onThemeChange?: (themeId: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onThemeChange }) => {
  const { currentThemeId, changeTheme } = useThemeContext();
  const availableThemes = getAvailableThemes();

  const handleThemeChange = async (themeId: string) => {
    await changeTheme(themeId as any);
    onThemeChange?.(themeId);
  };


  const styles = StyleSheet.create({
    container: {
      padding: 16,
    },
   
    themeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      gap: 12,
    },
    themeCard: {
      width: '48%', // hoặc '50%' nếu không có gap
      aspectRatio: 1.2, // hoặc height: 80 nếu muốn cố định
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      marginBottom: 12,
      padding: 8
    },
  
    
    checkmark: {
      color: '#000000',
      fontSize: 12,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
     
      <View style={styles.themeGrid}>
        {availableThemes.map((themeInfo) => (
          <TouchableOpacity
            key={themeInfo.id}
            style={[styles.themeCard,{
                flexDirection:'column',
                borderColor: currentThemeId === themeInfo.id ? themeInfo.theme.colors.primaryMain : themeInfo.theme.colors.gray200,
                borderWidth: 1,
                gap:8,
                backgroundColor: currentThemeId === themeInfo.id ? themeInfo.theme.colors.primaryOpacity5 : 'transparent',

            }]}
            onPress={() => handleThemeChange(themeInfo.id)}
            activeOpacity={0.7} 
          >
           
            <LinearGradient
                colors={themeInfo.theme.colors.primaryGradient}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                locations={[0, 1]}
                style={{
                    width:'100%',
                    height: '70%',
                    borderRadius: themeInfo.theme.spacing.md 
                }}
            ></LinearGradient>

            <XText color={themeInfo.theme.colors.gray800} variant='titleRegular'>{themeInfo.name}</XText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};



export default ThemeSelector; 