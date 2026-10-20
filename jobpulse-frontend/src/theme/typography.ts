import { TypographyOptions } from '@mui/material/styles/createTypography';

export const typography: TypographyOptions = {
  fontFamily: "'Open Sans', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",

  // Secondary / Headings (Roboto weights: 500, 700)
  h1: {
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 700,
    fontSize: '2.25rem',
    lineHeight: 1.25,
    letterSpacing: '-0.02em',
    color: '#1a1a1a'
  },
  h2: {
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 700,
    fontSize: '1.75rem',
    lineHeight: 1.3,
    letterSpacing: '-0.015em',
    color: '#1a1a1a'
  },
  h3: {
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 700,
    fontSize: '1.4rem',
    lineHeight: 1.35,
    letterSpacing: '-0.01em',
    color: '#1a1a1a'
  },
  h4: {
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 700,
    fontSize: '1.2rem',
    lineHeight: 1.4,
    color: '#1a1a1a'
  },
  h5: {
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 700,
    fontSize: '1.05rem',
    lineHeight: 1.4,
    color: '#1a1a1a'
  },
  h6: {
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 500,
    fontSize: '0.95rem',
    lineHeight: 1.45,
    color: '#1a1a1a'
  },

  // Event Titles / Subheadings: Open Sans 13px, weight 700, uppercase, letter-spacing 0.8px, color #0d3b66
  subtitle1: {
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    lineHeight: 1.4,
    color: '#0d3b66'
  },
  subtitle2: {
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    lineHeight: 1.4,
    color: '#0d3b66'
  },

  // Base / Body Copy: Open Sans, Roboto, 15px, line-height 1.6, weight 400, color #222222
  body1: {
    fontFamily: "'Open Sans', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    fontSize: '15px',
    lineHeight: 1.6,
    fontWeight: 400,
    color: '#222222'
  },
  body2: {
    fontFamily: "'Open Sans', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    fontSize: '14px',
    lineHeight: 1.6,
    fontWeight: 400,
    color: '#444444'
  },

  // Action Buttons: Open Sans, 12px, 600, uppercase, letter-spacing 0.5px
  button: {
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    lineHeight: 1.5
  },

  caption: {
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '12px',
    lineHeight: 1.5,
    fontWeight: 400,
    color: '#666666'
  },
  overline: {
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    color: '#0d3b66'
  }
};
