import { Fonts } from '../constants/fonts';

export const typography = {
  // Headings
  h1: {
    fontFamily: Fonts.OrbitronSemiBold,
    fontSize: 32,
    lineHeight: 32,
    letterSpacing: 0.32,
  },
  h2: {
    fontFamily: Fonts.OrbitronRegular,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: 0.24,
  },
  h3: {
    fontFamily: Fonts.Outfit600,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  h4: {
    fontFamily: Fonts.Outfit500,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.25,
  },
  // Body text
  body: {
    fontFamily: Fonts.Outfit400,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.16,
  },
  bodySmall: {
    fontFamily: Fonts.Outfit400,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.14,
  },

  // Input text
  inputText: {
    fontFamily: Fonts.Outfit400,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.14,
  },

  // Button text
  buttonText: {
    fontFamily: Fonts.Outfit500,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.14,
  },

  // Content text
  contentTitle: {
    fontFamily: Fonts.Outfit500,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.14,
  },
  content300: {
    fontFamily: Fonts.Outfit300,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.14,
  },
  content400: {
    fontFamily: Fonts.Outfit400,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.14,
  },

  // Tab bar
  tabBar: {
    fontFamily: Fonts.Outfit400,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
  },
  signInFaceID: {
    fontFamily: Fonts.Outfit400,
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: 0.21,
  },

  // Caption
  caption: {
    fontFamily: Fonts.Outfit400,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
  },
} as const;

export type Typography = typeof typography; 