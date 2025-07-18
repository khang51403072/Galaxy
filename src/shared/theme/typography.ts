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
  title: {
    fontFamily: Fonts.Outfit400,
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: 0.03,
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
  // Caption
  helloText300: {
    fontFamily: Fonts.Outfit300,
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: 0.18,
  },
  helloText400: {
    fontFamily: Fonts.Outfit400,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: 0.18,
  },
  saleAndTip300: {
    fontFamily: Fonts.Outfit300,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.18,
  },
  saleAndTip500: {
    fontFamily: Fonts.Outfit500,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.18,
  },

  // Date selector
  dateSelectorMonth: {
    fontFamily: Fonts.Outfit400,
    fontSize: 18,
    lineHeight: 23,
    letterSpacing: 0.14,
  },
  dateSelectorDay: {
    fontFamily: Fonts.Outfit400,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.14,
  },
  dateSelectorWeekDay: {
    fontFamily: Fonts.Outfit300,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.14,
  },
  // Tab bar
  appointmentTabBarSelectedTitle  : {
    fontFamily: Fonts.Outfit500,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.14,
  },
  appointmentTabBarUnselectedTitle: {
    fontFamily: Fonts.Outfit500,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.14,
  },

  appointmentTabBarSelectedCount  : {
    fontFamily: Fonts.Outfit400,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.14,
  },
  appointmentTabBarUnselectedCount: {
    fontFamily: Fonts.Outfit400,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.14,
  },
  // Appointment item
  appointmentItemNormalText: {
    fontFamily: Fonts.Outfit300,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.4,
  },
  appointmentItemServiceName: {
    fontFamily: Fonts.Outfit400,
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: 0.14,
  },
  appointmentItemStatus: {
    fontFamily: Fonts.Outfit500,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.14,
  },
  createAppointmentContent: {
    fontFamily: Fonts.Outfit400,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.18,
  },
} as const;

export type Typography = typeof typography; 