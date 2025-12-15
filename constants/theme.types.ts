/**
 * Type definitions for the theme system
 * This file provides TypeScript types for better autocomplete and type safety
 */

export interface ColorShade {
  main: string;
  light: string;
  dark: string;
  contrast: string;
}

export interface StatusColor {
  main: string;
  light: string;
  dark: string;
  background: string;
  text: string;
}

export interface BackgroundColors {
  primary: string;
  secondary: string;
  tertiary: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  tertiary: string;
  disabled: string;
  inverse: string;
}

export interface StatusColors {
  success: StatusColor;
  error: StatusColor;
  warning: StatusColor;
  info: StatusColor;
}

export interface InputColors {
  background: string;
  border: string;
  focus: string;
  error: string;
}

export interface UIColors {
  border: string;
  divider: string;
  shadow: string;
  overlay: string;
  card: string;
  input: InputColors;
}

export interface DarkModeColors {
  primary: ColorShade;
  secondary: ColorShade;
  background: BackgroundColors;
  text: TextColors;
  ui: UIColors;
  status: StatusColors;
}

export interface AppColorsType {
  primary: ColorShade;
  secondary: ColorShade;
  background: BackgroundColors;
  text: TextColors;
  status: StatusColors;
  ui: UIColors;
  dark: DarkModeColors;
}

export interface FontSizesType {
  xs: number;
  sm: number;
  base: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
}

export interface SpacingType {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
}

export interface BorderRadiusType {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  full: number;
}

export interface FontsType {
  sans: string;
  serif: string;
  rounded: string;
  mono: string;
}
