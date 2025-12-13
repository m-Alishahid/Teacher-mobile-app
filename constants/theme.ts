/**
 * Global Theme Configuration for Teacher Mobile App
 * 
 * STRICT RULE: Never hardcode hex codes in components!
 * Always import and use colors from this theme file.
 * 
 * Usage Example:
 * import { AppColors } from '@/constants/theme';
 * <View style={{ backgroundColor: AppColors.primary.main }} />
 */

import { Platform } from 'react-native';
import type {
    AppColorsType,
    BorderRadiusType,
    FontSizesType,
    SpacingType
} from './theme.types';

/**
 * Primary Colors - Used for main buttons, headers, and key UI elements
 */
const PRIMARY = {
  main: '#288511ff',        // 4A90E2 Professional blue
  light: '#60da66ff',       // 6BA3E8 Lighter shade for hover/pressed states
  dark: '#253806ff',        //3A7BC8 Darker shade for depth
  contrast: '#FFFFFF',    // Text color on primary background
};

/**
 * Secondary Colors - Used for accents and active states
 */
const SECONDARY = {
  main: '#7B68EE',        // Medium slate blue (purple accent)
  light: '#9B88FF',       // Lighter purple for highlights
  dark: '#5B48CE',        // Darker purple for depth
  contrast: '#FFFFFF',    // Text color on secondary background
};

/**
 * Background Colors - Used for screen backgrounds and surfaces
 */
const BACKGROUND = {
  primary: '#FFFFFF',     // Main background (white)
  secondary: '#F5F7FA',   // Light grey for cards and sections
  tertiary: '#E8EBF0',    // Slightly darker grey for borders/dividers
};

/**
 * Text Colors - Used for all text elements
 */
const TEXT = {
  primary: '#1A1A1A',     // Main text color (dark)
  secondary: '#6B7280',   // Secondary text (grey)
  tertiary: '#9CA3AF',    // Tertiary text (lighter grey)
  disabled: '#D1D5DB',    // Disabled text
  inverse: '#FFFFFF',     // Text on dark backgrounds
};

/**
 * Status Colors - Used for attendance, grades, and status indicators
 */
const STATUS = {
  // Present / Pass / Success
  success: {
    main: '#10B981',      // Green
    light: '#34D399',     // Light green
    dark: '#059669',      // Dark green
    background: '#D1FAE5', // Light green background
    text: '#065F46',      // Dark green text
  },
  // Absent / Fail / Error
  error: {
    main: '#EF4444',      // Red
    light: '#F87171',     // Light red
    dark: '#DC2626',      // Dark red
    background: '#FEE2E2', // Light red background
    text: '#991B1B',      // Dark red text
  },
  // Late / Pending / Warning
  warning: {
    main: '#F59E0B',      // Amber/Yellow
    light: '#FBBF24',     // Light amber
    dark: '#D97706',      // Dark amber
    background: '#FEF3C7', // Light amber background
    text: '#92400E',      // Dark amber text
  },
  // Info / Neutral
  info: {
    main: '#3B82F6',      // Blue
    light: '#60A5FA',     // Light blue
    dark: '#2563EB',      // Dark blue
    background: '#DBEAFE', // Light blue background
    text: '#1E40AF',      // Dark blue text
  },
};

/**
 * Dark Mode Colors - Complete dark theme palette
 */
const DARK = {
  primary: {
    main: '#5BA3F5',
    light: '#7BB8F7',
    dark: '#4A90E2',
    contrast: '#000000',
  },
  secondary: {
    main: '#9B88FF',
    light: '#B5A3FF',
    dark: '#7B68EE',
    contrast: '#000000',
  },
  background: {
    primary: '#0F1419',   // Dark background
    secondary: '#1A1F2E', // Slightly lighter for cards
    tertiary: '#2D3748',  // Borders/dividers
  },
  text: {
    primary: '#F9FAFB',
    secondary: '#D1D5DB',
    tertiary: '#9CA3AF',
    disabled: '#6B7280',
    inverse: '#1A1A1A',
  },
};

/**
 * Additional UI Colors
 */
const UI = {
  border: '#E5E7EB',
  divider: '#F3F4F6',
  shadow: '#00000029',
  overlay: '#00000080',
  card: '#FFFFFF',
  input: {
    background: '#F9FAFB',
    border: '#D1D5DB',
    focus: PRIMARY.main,
    error: STATUS.error.main,
  },
};

/**
 * Main Color Export - Use this in your components
 */
export const AppColors: AppColorsType = {
  primary: PRIMARY,
  secondary: SECONDARY,
  background: BACKGROUND,
  text: TEXT,
  status: STATUS,
  ui: UI,
  dark: DARK,
};

/**
 * Legacy Colors Export (for backward compatibility with existing themed components)
 */
export const Colors = {
  light: {
    text: TEXT.primary,
    background: BACKGROUND.primary,
    tint: PRIMARY.main,
    icon: TEXT.secondary,
    tabIconDefault: TEXT.secondary,
    tabIconSelected: PRIMARY.main,
  },
  dark: {
    text: DARK.text.primary,
    background: DARK.background.primary,
    tint: DARK.primary.main,
    icon: DARK.text.secondary,
    tabIconDefault: DARK.text.secondary,
    tabIconSelected: DARK.primary.main,
  },
};

/**
 * Font Configuration
 */
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

/**
 * Font Sizes
 */
export const FontSizes: FontSizesType = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

/**
 * Spacing Scale
 */
export const Spacing: SpacingType = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

/**
 * Border Radius
 */
export const BorderRadius: BorderRadiusType = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};
