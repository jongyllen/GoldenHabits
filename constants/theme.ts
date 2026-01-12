/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export interface ThemeColors {
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  primary: string;
  secondary: string;
  surface: string;
  onSurface: string;
  primaryContainer: string;
  secondaryContainer: string;
  goldGradient: readonly [string, string, ...string[]];
  tealGradient: readonly [string, string, ...string[]];
  cardShadow: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
}

export const Colors: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    tint: '#D4AF37', // Golden
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#D4AF37',
    primary: '#D4AF37',
    secondary: '#002D36', // Deep Teal
    surface: '#F8F9FA',
    onSurface: '#11181C',
    primaryContainer: '#FDF7E2', // Slightly warmer, more subtle
    secondaryContainer: '#F0F9F8', // More subtle teal background
    goldGradient: ['#E6B800', '#FFD700', '#DAA520'] as const, // Less harsh, more balanced
    tealGradient: ['#006064', '#009688', '#4DB6AC'] as const, // Muted-premium teal
    cardShadow: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.04,
      shadowRadius: 16,
      elevation: 4,
    }
  },
  dark: {
    text: '#ECEDEE',
    background: '#0a0a0a',
    tint: '#FFD700', // Bright Gold
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#FFD700',
    primary: '#FFD700',
    secondary: '#004D40',
    surface: '#121212',
    onSurface: '#ECEDEE',
    primaryContainer: '#2c2c2c',
    secondaryContainer: '#1a1a1a',
    goldGradient: ['#FFD700', '#D4AF37', '#8B4513'] as const,
    tealGradient: ['#00796B', '#004D40', '#002D36'] as const,
    cardShadow: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 8,
    }
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
