/**
 * Design System Entry Point
 * 
 * Re-exports all design tokens and theme configurations for easy importing.
 * 
 * Usage:
 * import { theme, tokens, lightTheme, darkTheme } from '@/src/design';
 * import { spacing, colors } from '@/src/design/tokens';
 * import { getTheme, themeUtils } from '@/src/design/theme';
 */

// Export all tokens
export * from './tokens';

// Export all theme configurations
export * from './theme';

// Default exports for convenience
export { theme as defaultTheme } from './theme';