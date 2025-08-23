# Design System

A comprehensive design system for React Native/Expo applications with semantic design tokens and theme configuration.

## File Structure

```
src/design/
├── tokens.ts      # Core design tokens (spacing, typography, colors, etc.)
├── theme.ts       # Theme configuration with light/dark variants
├── index.ts       # Entry point for easy imports
└── README.md      # This file
```

## Quick Start

```typescript
// Import the default theme
import { theme } from '@/src/design';

// Import specific tokens
import { spacing, colors, typography } from '@/src/design/tokens';

// Import theme utilities
import { lightTheme, darkTheme, getTheme } from '@/src/design/theme';
```

## Design Tokens

### Spacing Scale (4px grid system)
```typescript
spacing.0  // 0px
spacing.1  // 4px
spacing.2  // 8px
spacing.3  // 12px
spacing.4  // 16px
spacing.6  // 24px
spacing.8  // 32px
```

### Typography Hierarchy
```typescript
typography.display   // 48px, weight 800 - For hero headings
typography.title     // 32px, weight 700 - For page titles
typography.subtitle  // 24px, weight 600 - For section headings
typography.body      // 16px, weight 400 - For body text
typography.caption   // 14px, weight 400 - For captions
```

### Color System
- **Brand Colors**: `colors.brand.blue700` (primary), `colors.accent.yellow500`
- **Neutral Colors**: `colors.neutral.white` to `colors.neutral.black`
- **Semantic Colors**: `colors.semantic.success`, `error`, `warning`, `info`

## Theme Usage

### Basic Theme Usage
```typescript
import { theme } from '@/src/design';

const MyComponent = () => {
  return (
    <View style={{
      backgroundColor: theme.colors.background,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.md,
    }}>
      <Text style={{
        color: theme.colors.text,
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.semibold,
      }}>
        Hello World
      </Text>
    </View>
  );
};
```

### Dynamic Theme Switching
```typescript
import { getTheme } from '@/src/design';
import { useColorScheme } from 'react-native';

const MyComponent = () => {
  const colorScheme = useColorScheme();
  const currentTheme = getTheme(colorScheme);
  
  return (
    <View style={{
      backgroundColor: currentTheme.colors.background,
      // ... other styles
    }}>
      {/* Component content */}
    </View>
  );
};
```

### Using Component Styles
```typescript
import { theme } from '@/src/design';

const MyButton = () => {
  return (
    <TouchableOpacity style={theme.components.button.primary}>
      <Text style={{ color: theme.colors.textOnPrimary }}>
        Primary Button
      </Text>
    </TouchableOpacity>
  );
};
```

## Theme Structure

### Semantic Color Naming
- `primary` - Main brand color
- `secondary` - Accent color
- `background` - Page background
- `surface` - Card/modal background
- `text` - Primary text color
- `textSecondary` - Secondary text color
- `border` - Border color
- `success/warning/error/info` - Feedback colors

### Component Styles
Pre-defined styles for common components:
- `theme.components.button.primary`
- `theme.components.button.secondary`
- `theme.components.card`
- `theme.components.input`

## Best Practices

### 1. Use Semantic Names
```typescript
// ✅ Good - Semantic naming
backgroundColor: theme.colors.surface

// ❌ Bad - Descriptive naming
backgroundColor: colors.neutral.white
```

### 2. Consistent Spacing
```typescript
// ✅ Good - Using spacing scale
margin: theme.spacing[4]

// ❌ Bad - Arbitrary values
margin: 15
```

### 3. Typography Hierarchy
```typescript
// ✅ Good - Using typography scale
fontSize: theme.typography.title.fontSize

// ❌ Bad - Arbitrary font sizes
fontSize: 28
```

### 4. Theme-Aware Styling
```typescript
// ✅ Good - Adapts to theme changes
color: theme.colors.text

// ❌ Bad - Hard-coded colors
color: '#000000'
```

## Extending the System

### Adding New Colors
```typescript
// In tokens.ts, add to the appropriate section
export const colors = {
  // ... existing colors
  brand: {
    // ... existing brand colors
    purple500: '#8B5CF6', // Add new brand color
  },
} as const;
```

### Adding New Component Styles
```typescript
// In theme.ts, add to components section
components: {
  // ... existing components
  modal: {
    backgroundColor: isDark ? colors.neutral.gray800 : colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing[6],
  },
}
```

## TypeScript Support

All tokens and themes are fully typed with TypeScript:

```typescript
import type { Theme, Colors, Spacing } from '@/src/design';

interface ComponentProps {
  theme: Theme;
  spacing?: Spacing;
}
```

## Accessibility

The theme includes:
- Sufficient color contrast ratios
- Consistent focus states
- Semantic color naming for screen readers
- Scalable typography system