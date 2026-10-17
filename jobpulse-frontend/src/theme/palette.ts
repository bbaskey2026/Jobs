import { PaletteOptions } from '@mui/material/styles';

export const palette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#2563EB',      // Blue
    dark: '#1D4ED8',      // Dark blue
    light: '#EFF6FF',     // Light blue
    contrastText: '#FFFFFF'
  },
  secondary: {
    main: '#242424',      // Main text / Black
    dark: '#000000',
    light: '#6B6B6B',
    contrastText: '#FFFFFF'
  },
  info: {
    main: '#2563EB',
    dark: '#1D4ED8',
    light: '#EFF6FF',
    contrastText: '#FFFFFF'
  },
  success: {
    main: '#2563EB',
    dark: '#1D4ED8',
    light: '#EFF6FF',
    contrastText: '#FFFFFF'
  },
  warning: {
    main: '#6B6B6B',
    dark: '#242424',
    light: '#F7F7F7',
    contrastText: '#FFFFFF'
  },
  error: {
    main: '#242424',
    dark: '#000000',
    light: '#F7F7F7',
    contrastText: '#FFFFFF'
  },
  background: {
    default: '#FFFFFF',   // Pure white editorial background
    paper: '#FFFFFF'      // Pure white surfaces
  },
  text: {
    primary: '#242424',   // Main text
    secondary: '#6B6B6B', // Secondary text
    disabled: '#A8A8A8'   // Disabled text
  },
  divider: '#E6E6E6'      // Thin editorial divider
};
