/**
 * Theme Configuration
 * 
 * Semantic theme definitions using design tokens.
 * Provides light and dark theme variants with consistent naming.
 */

import { colors, spacing, borderRadius, typography, shadows, zIndex } from './tokens';

// Base theme structure with semantic naming
const createTheme = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';
  
  return {
    // Theme mode identifier
    mode,
    
    // Semantic Colors
    colors: {
      // Primary brand colors
      primary: colors.brand.blue700,
      primaryLight: colors.brand.blue500,
      primaryDark: colors.brand.blue800,
      
      // Secondary/accent colors
      secondary: colors.accent.yellow500,
      secondaryLight: colors.accent.yellow400,
      secondaryDark: colors.accent.yellow600,
      
      // Background colors
      background: isDark ? colors.neutral.gray900 : colors.neutral.white,
      backgroundSecondary: isDark ? colors.neutral.gray800 : colors.neutral.gray50,
      backgroundTertiary: isDark ? colors.neutral.gray700 : colors.neutral.gray100,
      
      // Surface colors (for cards, modals, etc.)
      surface: isDark ? colors.neutral.gray800 : colors.neutral.white,
      surfaceSecondary: isDark ? colors.neutral.gray700 : colors.neutral.gray50,
      surfaceElevated: isDark ? colors.neutral.gray700 : colors.neutral.white,
      
      // Text colors
      text: isDark ? colors.neutral.white : colors.neutral.gray900,
      textSecondary: isDark ? colors.neutral.gray300 : colors.neutral.gray600,
      textTertiary: isDark ? colors.neutral.gray400 : colors.neutral.gray500,
      textOnPrimary: colors.neutral.white,
      textOnSecondary: colors.neutral.gray900,
      textOnDark: colors.neutral.white,
      textDisabled: isDark ? colors.neutral.gray600 : colors.neutral.gray400,
      
      // Border colors
      border: isDark ? colors.neutral.gray700 : colors.neutral.gray200,
      borderSecondary: isDark ? colors.neutral.gray600 : colors.neutral.gray300,
      borderOnDark: 'rgba(255, 255, 255, 0.6)',
      borderFocus: colors.brand.blue500,
      
      // Interactive states
      interactive: colors.brand.blue700,
      interactiveHover: colors.brand.blue600,
      interactivePressed: colors.brand.blue800,
      interactiveDisabled: isDark ? colors.neutral.gray700 : colors.neutral.gray300,
      
      // Semantic feedback colors
      success: colors.semantic.success,
      successBackground: isDark ? colors.semantic.successLight : colors.semantic.successLight,
      warning: colors.semantic.warning,
      warningBackground: isDark ? colors.semantic.warningLight : colors.semantic.warningLight,
      error: colors.semantic.error,
      errorBackground: isDark ? colors.semantic.errorLight : colors.semantic.errorLight,
      info: colors.semantic.info,
      infoBackground: isDark ? colors.semantic.infoLight : colors.semantic.infoLight,
      
      // Overlay colors
      overlay: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
      overlayLight: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.3)',
      
      // Shadow colors
      shadowColor: isDark ? colors.neutral.black : colors.neutral.gray900,
    },
    
    // Spacing (re-exported for convenience)
    spacing,
    
    // Border radius (re-exported for convenience)
    borderRadius,
    
    // Typography with theme-aware styles
    typography: {
      ...typography,
      // Component-specific typography styles
      components: {
        button: {
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.medium,
          lineHeight: typography.lineHeight.normal,
        },
        input: {
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.normal,
          lineHeight: typography.lineHeight.normal,
        },
        card: {
          titleFontSize: typography.fontSize.lg,
          titleFontWeight: typography.fontWeight.semibold,
          bodyFontSize: typography.fontSize.base,
          bodyFontWeight: typography.fontWeight.normal,
        },
      },
    },
    
    // Shadows with theme-aware colors
    shadows: {
      ...shadows,
      // Apply shadow color based on theme
      sm: {
        ...shadows.sm,
        shadowColor: isDark ? colors.neutral.black : colors.neutral.gray900,
      },
      md: {
        ...shadows.md,
        shadowColor: isDark ? colors.neutral.black : colors.neutral.gray900,
      },
      lg: {
        ...shadows.lg,
        shadowColor: isDark ? colors.neutral.black : colors.neutral.gray900,
      },
      xl: {
        ...shadows.xl,
        shadowColor: isDark ? colors.neutral.black : colors.neutral.gray900,
      },
      '2xl': {
        ...shadows['2xl'],
        shadowColor: isDark ? colors.neutral.black : colors.neutral.gray900,
      },
    },
    
    // Z-index (re-exported for convenience)
    zIndex,
    
    // Component-specific styles
    components: {
      button: {
        primary: {
          backgroundColor: colors.brand.blue700,
          color: colors.neutral.white,
          borderRadius: borderRadius.md,
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[6],
        },
        secondary: {
          backgroundColor: 'transparent',
          color: colors.brand.blue700,
          borderColor: colors.brand.blue700,
          borderWidth: 1,
          borderRadius: borderRadius.md,
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[6],
        },
        ghost: {
          backgroundColor: 'transparent',
          color: isDark ? colors.neutral.white : colors.neutral.gray900,
          borderRadius: borderRadius.md,
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[6],
        },
      },
      
      card: {
        backgroundColor: isDark ? colors.neutral.gray800 : colors.neutral.white,
        borderRadius: borderRadius.lg,
        padding: spacing[4],
        shadowColor: isDark ? colors.neutral.black : colors.neutral.gray900,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      
      input: {
        backgroundColor: isDark ? colors.neutral.gray700 : colors.neutral.white,
        borderColor: isDark ? colors.neutral.gray600 : colors.neutral.gray300,
        borderWidth: 1,
        borderRadius: borderRadius.md,
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[4],
        fontSize: typography.fontSize.base,
        color: isDark ? colors.neutral.white : colors.neutral.gray900,
      },
    },
  } as const;
};

// Light theme configuration
export const lightTheme = createTheme('light');

// Dark theme configuration
export const darkTheme = createTheme('dark');

// Default theme (light)
export const theme = lightTheme;

// Theme type for TypeScript support
export type Theme = typeof lightTheme;

// Helper function to get theme based on color scheme
export const getTheme = (colorScheme: 'light' | 'dark' | null | undefined): Theme => {
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};

// Theme context value type
export interface ThemeContextValue {
  theme: Theme;
  colorScheme: 'light' | 'dark';
  toggleColorScheme: () => void;
}

// Utility functions for common theme operations
export const themeUtils = {
  // Get contrast color (black or white) based on background
  getContrastColor: (backgroundColor: string): string => {
    // Simple implementation - in production, you might want a more sophisticated approach
    return backgroundColor === colors.neutral.white || 
           backgroundColor.includes('light') || 
           backgroundColor.includes('50') || 
           backgroundColor.includes('100') || 
           backgroundColor.includes('200')
      ? colors.neutral.black
      : colors.neutral.white;
  },
  
  // Get hover state color
  getHoverColor: (baseColor: string, theme: Theme): string => {
    if (baseColor === theme.colors.primary) return theme.colors.interactiveHover;
    if (baseColor === theme.colors.secondary) return colors.accent.yellow400;
    return baseColor;
  },
  
  // Get pressed state color
  getPressedColor: (baseColor: string, theme: Theme): string => {
    if (baseColor === theme.colors.primary) return theme.colors.interactivePressed;
    if (baseColor === theme.colors.secondary) return colors.accent.yellow600;
    return baseColor;
  },
  
  // Apply opacity to any color
  withOpacity: (color: string, opacity: number): string => {
    // Convert hex to rgba with opacity
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  },
};

// Export everything for easy importing
export default {
  lightTheme,
  darkTheme,
  theme,
  getTheme,
  themeUtils,
};