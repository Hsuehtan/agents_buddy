import {
  DEFAULT_OEM_SHELL_THEME,
  OEM_SHELL_THEME,
  type OemShellTheme,
} from './oem-brand';

const SHELL_THEME_VARIABLES: Readonly<Record<keyof OemShellTheme, `--oem-${string}`>> = Object.freeze({
  shellBackground: '--oem-shell-background',
  shellOutline: '--oem-shell-outline',
  sidebarBackground: '--oem-sidebar-background',
  sidebarForeground: '--oem-sidebar-foreground',
  sidebarMutedForeground: '--oem-sidebar-muted-foreground',
  sidebarHoverBackground: '--oem-sidebar-hover-background',
  sidebarActiveBackground: '--oem-sidebar-active-background',
  sidebarActiveForeground: '--oem-sidebar-active-foreground',
  sidebarBorder: '--oem-sidebar-border',
  sidebarFocusRing: '--oem-sidebar-focus-ring',
});

function normalizedCssColor(value: string, fallback: string): string {
  const normalized = value.trim();
  if (/^#[\da-f]{3,4}(?:[\da-f]{3,4})?$/i.test(normalized)) return normalized;

  if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
    return CSS.supports('color', normalized) ? normalized : fallback;
  }

  return fallback;
}

export function applyOemShellTheme(
  theme: Readonly<OemShellTheme> = OEM_SHELL_THEME,
  target: HTMLElement = document.documentElement,
): void {
  (Object.keys(SHELL_THEME_VARIABLES) as Array<keyof OemShellTheme>).forEach((key) => {
    target.style.setProperty(
      SHELL_THEME_VARIABLES[key],
      normalizedCssColor(theme[key], DEFAULT_OEM_SHELL_THEME[key]),
    );
  });
}
