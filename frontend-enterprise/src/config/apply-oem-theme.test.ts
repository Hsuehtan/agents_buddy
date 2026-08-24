// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';

import { applyOemShellTheme } from './apply-oem-theme';
import { DEFAULT_OEM_SHELL_THEME } from './oem-brand';

describe('OEM shell theme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('style');
  });

  it('maps every shell color to an isolated OEM CSS variable', () => {
    applyOemShellTheme({
      ...DEFAULT_OEM_SHELL_THEME,
      shellBackground: '#102030',
      sidebarActiveBackground: '#4567de',
    });

    expect(document.documentElement.style.getPropertyValue('--oem-shell-background')).toBe('#102030');
    expect(document.documentElement.style.getPropertyValue('--oem-sidebar-active-background')).toBe('#4567de');
    expect(document.documentElement.style.getPropertyValue('--background')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--primary')).toBe('');
  });

  it('falls back for invalid colors without preventing other values from applying', () => {
    applyOemShellTheme({
      ...DEFAULT_OEM_SHELL_THEME,
      shellOutline: 'not-a-color',
      sidebarForeground: '#f0f4ff',
    });

    expect(document.documentElement.style.getPropertyValue('--oem-shell-outline'))
      .toBe(DEFAULT_OEM_SHELL_THEME.shellOutline);
    expect(document.documentElement.style.getPropertyValue('--oem-sidebar-foreground')).toBe('#f0f4ff');
  });
});
