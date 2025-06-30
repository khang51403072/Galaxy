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
  title: {
    fontFamily: Fonts.Outfit400,
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: 0.14,
    color: XColors.textInputText, 
  },
  inputText: {
    fontFamily: Fonts.Outfit400,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.14,
    color: XColors.textInputText,
  },
  inputLabel: {
    fontFamily: Fonts.Outfit400,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.14,
    color: XColors.textInputText,
  },
  buttonText: {
    fontFamily: Fonts.Outfit500,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.14,
    color: XColors.textButton,
  },
  contentTitle: {
    fontFamily: Fonts.Outfit500,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.14,
    color: XColors.textInputText,
  },
  content300: {
    fontFamily: Fonts.Outfit300,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.14,
    color: XColors.textInputText,
  },
  content400: {
    fontFamily: Fonts.Outfit400,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.14,
    color: XColors.textInputText,
  },
  tabBar: {
    fontFamily: Fonts.Outfit400,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    color: XColors.textInputPlaceholder,
  },
});
