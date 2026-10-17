import { describe, it, expect } from 'vitest';
import { theme } from '../src/theme/index.js';

describe('JobPulse Medium-Inspired Design System', () => {
  it('should have Primary Blue as primary color', () => {
    expect(theme.palette.primary.main).toBe('#2563EB');
  });

  it('should have Dark Blue as primary dark color', () => {
    expect(theme.palette.primary.dark).toBe('#1D4ED8');
  });

  it('should have Light Blue as primary light color', () => {
    expect(theme.palette.primary.light).toBe('#EFF6FF');
  });

  it('should have Main Text as #242424', () => {
    expect(theme.palette.text.primary).toBe('#242424');
  });

  it('should have Secondary Text as #6B6B6B', () => {
    expect(theme.palette.text.secondary).toBe('#6B6B6B');
  });

  it('should have #E6E6E6 for borders and dividers', () => {
    expect(theme.palette.divider).toBe('#E6E6E6');
  });

  it('should have #FFFFFF as editorial background default', () => {
    expect(theme.palette.background.default).toBe('#FFFFFF');
  });

  it('should configure Manrope for headings', () => {
    expect(theme.typography.h1.fontFamily).toContain('Manrope');
    expect(theme.typography.h2.fontFamily).toContain('Manrope');
    expect(theme.typography.h3.fontFamily).toContain('Manrope');
  });
});
