'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

/**
 * ThemeProvider wraps next-themes to manage light/dark mode.
 *
 * Configuration:
 * - attribute="class": Adds theme as class to <html> (e.g., class="dark")
 * - defaultTheme="dark": OHIF always starts in dark mode
 * - enableSystem={false}: Don't detect OS preference (for now)
 * - disableTransitionOnChange: Prevents flash on theme change
 *
 * Usage in App.tsx:
 * ```tsx
 * const providers = [
 *   [ThemeProvider],  // Must come before UINextVersionProvider
 *   [UINextVersionProvider],
 * ];
 * ```
 *
 * Future: Add ModeToggle component for light/dark switching using useTheme() hook.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
