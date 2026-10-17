import { createTheme } from '@mui/material/styles';
import { palette } from './palette.js';
import { typography } from './typography.js';
import { components } from './components.js';
import { shadows } from './spacing.js';

export const theme = createTheme({
  palette,
  typography,
  components,
  shadows,
  shape: {
    borderRadius: 8
  }
});
