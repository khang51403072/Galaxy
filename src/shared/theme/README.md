# Theme System - GalaxyMe

## 🎯 Overview

Theme system được thiết kế để:
- **Consistency**: Đảm bảo UI nhất quán across toàn app
- **Maintainability**: Dễ dàng thay đổi design tokens
- **Dark Mode**: Support dark mode out of the box
- **Performance**: Optimized re-renders với React Context

## 🏗️ Architecture

```
src/shared/theme/
├── colors.ts          # Color palette (light/dark)
├── spacing.ts         # Spacing tokens
├── borderRadius.ts    # Border radius tokens
├── typography.ts      # Typography styles
├── shadows.ts         # Shadow styles
├── ThemeProvider.tsx  # Theme context & provider
└── index.ts          # Main exports
```

## 🚀 Usage

### 1. Setup ThemeProvider

```tsx
// App.tsx
import { ThemeProvider } from './src/shared/theme';

function App() {
  return (
    <ThemeProvider>
      {/* Your app components */}
    </ThemeProvider>
  );
}
```

### 2. Use Theme in Components

```tsx
import { useTheme } from '../shared/theme';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <View style={{
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    }}>
      <Text style={theme.typography.h1}>
        Hello World
      </Text>
    </View>
  );
}
```

### 3. Use XText Component

```tsx
import XText from '../shared/components/XText';

// With theme colors
<XText variant="h1">Heading</XText>
<XText variant="body" color={theme.colors.primary}>Custom color</XText>
```

### 4. Use XButton Component

```tsx
import XButton from '../shared/components/XButton';

// Primary button with gradient
<XButton title="Login" onPress={handleLogin} />

// Custom color button
<XButton 
  title="Cancel" 
  onPress={handleCancel}
  backgroundColor={theme.colors.error}
  useGradient={false}
/>
```

## 🎨 Design Tokens

### Colors
```tsx
theme.colors.primary        // #1D62D8
theme.colors.background     // #FFFFFF (light) / #1A1A1A (dark)
theme.colors.text          // #000000 (light) / #FFFFFF (dark)
theme.colors.success       // #34C759
theme.colors.error         // #FF3B30
```

### Spacing
```tsx
theme.spacing.xs   // 4px
theme.spacing.sm   // 8px
theme.spacing.md   // 16px (most used)
theme.spacing.lg   // 24px
theme.spacing.xl   // 32px
```

### Border Radius
```tsx
theme.borderRadius.sm   // 4px
theme.borderRadius.md   // 8px
theme.borderRadius.lg   // 16px
theme.borderRadius.xl   // 24px
```

### Typography
```tsx
theme.typography.h1        // Heading 1
theme.typography.body      // Body text
theme.typography.buttonText // Button text
theme.typography.caption   // Caption text
```

## 🌙 Dark Mode

Theme system tự động detect system theme và switch giữa light/dark mode.

### Manual Theme Control
```tsx
import { ThemeProvider, lightTheme, darkTheme } from '../shared/theme';

// Force light theme
<ThemeProvider theme={lightTheme}>
  {/* App content */}
</ThemeProvider>

// Force dark theme  
<ThemeProvider theme={darkTheme}>
  {/* App content */}
</ThemeProvider>
```

## 🔧 Best Practices

1. **Always use theme tokens** thay vì hardcode values
2. **Use XText component** cho consistent typography
3. **Use XButton component** cho consistent buttons
4. **Test both light and dark modes**
5. **Use spacing tokens** cho consistent layout

## 📝 Examples

Xem `ThemeDemo.tsx` để có examples đầy đủ về cách sử dụng theme system. 