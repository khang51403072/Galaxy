import { StyleSheet } from 'react-native';
import { Fonts } from './fonts';
import { XColors } from './colors';

export const TextStyles = StyleSheet.create({
  h1: {
    fontFamily: Fonts.OrbitronSemiBold,
    // 👈 bạn phải chọn đúng file .ttf weight 600
    fontSize: 32,
    lineHeight: 32,                   // 100% = fontSize
    letterSpacing: 0.32,  
    color: XColors.primary,
  },
  inputText: {
    fontFamily: Fonts.OutfitRegular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.14,
    color: XColors.textInputText,
  },
});
