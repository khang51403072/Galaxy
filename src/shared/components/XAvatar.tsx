// src/shared/components/XAvatar.tsx
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import XIcon from './XIcon';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useTheme } from '../theme';

type XAvatarProps = {
  uri?: string;
  size?: number;
  onPickImage?: (type: 'camera' | 'library') => void;
  editable?: boolean;
};

export default function XAvatar({ 
  uri, 
  size = 120, 
  onPickImage, 
  editable = true 
}: XAvatarProps) {
  const { showActionSheetWithOptions } = useActionSheet();
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      position: 'relative',
    },
    avatarWrapper: {
      backgroundColor: '#eee',
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    imageContainer: {
      position: 'relative',
    },
    avatarImage: {
      resizeMode: 'cover',
    },
    placeholder: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    editIndicator: {
      position: 'absolute',
      backgroundColor: "#FFFFFF",
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#FFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  });
  const avatarSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const handlePress = () => {
    if (!editable || !onPickImage) return;
    
    const options = ['Chụp ảnh', 'Chọn từ thư viện', 'Huỷ'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) onPickImage('camera');
        if (buttonIndex === 1) onPickImage('library');
      }
    );
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={handlePress} 
        activeOpacity={editable ? 0.8 : 1}
        disabled={!editable}
      >
        <View style={[styles.avatarWrapper, avatarSize]}>
          {uri!=undefined ? (
            <View style={[styles.imageContainer, avatarSize]}>
              <Image 
                source={{ uri }} 
                style={[styles.avatarImage, avatarSize]}
                
              />
              
            </View>
          ) : (
            <View style={[styles.placeholder, avatarSize]}>
              <XIcon 
                name="user" 
                color="#999" 
                width={size * 0.4} 
                height={size * 0.4} 
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
      
      {/* Edit indicator - đặt ngoài avatar */}
      {editable && (
        <View style={[
          styles.editIndicator, 
          { 
            width: size * 0.3, 
            height: size * 0.3,
            right: size * 0.05,
            bottom: size * 0.05,
          }
        ]}>
          <XIcon 
            name="camera" 
            color="#FFF" 
            width={size * 0.15} 
            height={size * 0.15} 
          />
        </View>
      )}
    </View>
  );
}


