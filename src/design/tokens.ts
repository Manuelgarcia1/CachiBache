/**
 * Design Tokens
 * 
 * Core design tokens for consistent styling across the application.
 * These tokens should be used as the foundation for all theme configurations.
 */

// Spacing Scale - Based on 4px grid system
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

// Border Radius Scale
export const borderRadius = {
  none: 0,
  sm: 6,
  md: 12,
  lg: 20,
  xl: 32,
  full: 9999,
} as const;

// Typography Scale
export const typography = {
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
  },
  
  // Font Weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  // Typography Hierarchy
  display: {
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 1.2,
  },
  
  title: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 1.2,
  },
  
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 1.3,
  },
  
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 1.5,
  },
  
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 1.5,
  },
  
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 1.4,
  },
  
  small: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 1.3,
  },
} as const;

// Base Color Palette
export const colors = {
  // Brand Colors
  brand: {
    blue50: '#EBF5FF',
    blue100: '#DBEAFE',
    blue200: '#BFDBFE',
    blue300: '#93C5FD',
    blue400: '#60A5FA',
    blue500: '#3B82F6',
    blue600: '#2563EB',
    blue700: '#0B5FA5',
    blue800: '#1E3A8A',
    blue900: '#1E2A5A',
  },
  
  // Accent Colors
  accent: {
    yellow50: '#FFFBEB',
    yellow100: '#FEF3C7',
    yellow200: '#FDE68A',
    yellow300: '#FCD34D',
    yellow400: '#FBBF24',
    yellow500: '#FFC107',
    yellow600: '#D97706',
    yellow700: '#B45309',
    yellow800: '#92400E',
    yellow900: '#78350F',
  },
  
  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    black: '#000000',
  },
  
  // Semantic Colors
  semantic: {
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
  },
} as const;

// Z-Index Scale
export const zIndex = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Shadow/Elevation Definitions
export const shadows = {
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  md: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  
  lg: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  
  xl: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  
  '2xl': {
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 16,
  },
} as const;

// Breakpoints for Responsive Design
export const breakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

// Animation Durations
export const duration = {
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500,
} as const;

// Opacity Scale
export const opacity = {
  0: 0,
  5: 0.05,
  10: 0.1,
  20: 0.2,
  25: 0.25,
  30: 0.3,
  40: 0.4,
  50: 0.5,
  60: 0.6,
  70: 0.7,
  75: 0.75,
  80: 0.8,
  90: 0.9,
  95: 0.95,
  100: 1,
} as const;

// Export all tokens for easy importing
export const tokens = {
  spacing,
  borderRadius,
  typography,
  colors,
  zIndex,
  shadows,
  breakpoints,
  duration,
  opacity,
} as const;

// Type definitions for TypeScript support
export type Spacing = keyof typeof spacing;
export type BorderRadius = keyof typeof borderRadius;
export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
export type LineHeight = keyof typeof typography.lineHeight;
export type Colors = typeof colors;
export type ZIndex = keyof typeof zIndex;
export type Shadow = keyof typeof shadows;
export type Breakpoint = keyof typeof breakpoints;
export type Duration = keyof typeof duration;
export type Opacity = keyof typeof opacity;