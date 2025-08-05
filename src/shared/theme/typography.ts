import { Fonts } from '../constants/fonts';

export const typography = {
  // Headings
  h1: {
    fontFamily: Fonts.OrbitronSemiBold,
    fontSize: 32,
    lineHeight: 32,
    letterSpacing: 0.32,
  },
  // Appbar title, dialog title
  headingRegular: {
    fontFamily: Fonts.Outfit400, 
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: 0.20,
  },
  headingMedium: {
    fontFamily: Fonts.Outfit500,
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: 0.20,
  },
  headingLight: {
    fontFamily: Fonts.Outfit300,
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: 0.20,
  },
  // Body text
  titleMedium: {
    fontFamily: Fonts.Outfit500,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.18,
  },
  titleRegular: {
    fontFamily: Fonts.Outfit400,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.18,
  },
  titleLight: {
    fontFamily: Fonts.Outfit300,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.18,
  },

  bodyLight: {
    fontFamily: Fonts.Outfit300,
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: 0.16,
  },
  bodyMedium: {
    fontFamily: Fonts.Outfit500,
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: 0.16,
  },
  bodyRegular: {
    fontFamily: Fonts.Outfit400,
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: 0.16,
  },
  
  captionRegular: {
    fontFamily: Fonts.Outfit400,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.14,
  },
  captionLight: { 
    fontFamily: Fonts.Outfit300,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.14,
  },
  captionMedium: {
    fontFamily: Fonts.Outfit500,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.14,
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
    fontSize: 14,
    lineHeight: 28,
    letterSpacing: 0.18,
  },
  // Bottom sheet
  bottomSheetTitle: {
    fontFamily: Fonts.Outfit400,
    fontSize: 18,
    lineHeight: 20,
    letterSpacing: 0.18,
  },
  bottomSheetItemText: {
    fontFamily: Fonts.Outfit400,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.18,
  },
} as const;

export type Typography = typeof typography; 