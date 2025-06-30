import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import XText from './XText';
import XButton from './XButton';

export default function ThemeDemo() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Spacing demo */}
      <View style={[styles.section, { marginBottom: theme.spacing.lg }]}>
        <XText variant="h1" style={{ marginBottom: theme.spacing.md }}>
          Theme System Demo
        </XText>
        
        <XText variant="body" style={{ marginBottom: theme.spacing.sm }}>
          This component demonstrates the theme system
        </XText>
      </View>

      {/* Colors demo */}
      <View style={[styles.section, { marginBottom: theme.spacing.lg }]}>
        <XText variant="h2" style={{ marginBottom: theme.spacing.md }}>
          Colors
        </XText>
        
        <View style={[styles.colorBox, { backgroundColor: theme.colors.primary }]}>
          <XText variant="buttonText">Primary</XText>
        </View>
        
        <View style={[styles.colorBox, { backgroundColor: theme.colors.success }]}>
          <XText variant="buttonText">Success</XText>
        </View>
        
        <View style={[styles.colorBox, { backgroundColor: theme.colors.error }]}>
          <XText variant="buttonText">Error</XText>
        </View>
      </View>

      {/* Border radius demo */}
      <View style={[styles.section, { marginBottom: theme.spacing.lg }]}>
        <XText variant="h2" style={{ marginBottom: theme.spacing.md }}>
          Border Radius
        </XText>
        
        <View style={[
          styles.radiusBox, 
          { 
            borderRadius: theme.borderRadius.sm,
            backgroundColor: theme.colors.surface,
            marginBottom: theme.spacing.sm
          }
        ]}>
          <XText variant="caption">Small Radius</XText>
        </View>
        
        <View style={[
          styles.radiusBox, 
          { 
            borderRadius: theme.borderRadius.lg,
            backgroundColor: theme.colors.surface,
            marginBottom: theme.spacing.sm
          }
        ]}>
          <XText variant="caption">Large Radius</XText>
        </View>
      </View>

      {/* Buttons demo */}
      <View style={styles.section}>
        <XText variant="h2" style={{ marginBottom: theme.spacing.md }}>
          Buttons
        </XText>
        
        <XButton 
          title="Primary Button" 
          onPress={() => {}} 
          style={{ marginBottom: theme.spacing.sm }}
        />
        
        <XButton 
          title="Secondary Button" 
          onPress={() => {}} 
          backgroundColor={theme.colors.secondary}
          useGradient={false}
          style={{ marginBottom: theme.spacing.sm }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    width: '100%',
  },
  colorBox: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  radiusBox: {
    padding: 16,
    alignItems: 'center',
  },
}); 