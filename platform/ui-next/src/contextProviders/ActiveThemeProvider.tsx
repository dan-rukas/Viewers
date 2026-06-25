import { useSyncExternalStore } from 'react';
import { themeStore } from '../themes/themeStore';

export { themeStore } from '../themes/themeStore';

export function useActiveTheme() {
  const { activeTheme, customCss } = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot
  );

  return {
    activeTheme,
    customCss,
    setActiveTheme: themeStore.setActiveTheme,
    applyCustomTheme: themeStore.applyCustomTheme,
    clearCustomTheme: themeStore.clearCustomTheme,
  };
}
