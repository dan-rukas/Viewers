import * as React from 'react';

export type UINextVersion = 'old' | 'new';

type UINextVersionContextValue = {
  version: UINextVersion;
  setVersion: (version: UINextVersion) => void;
};

const UINextVersionContext = React.createContext<UINextVersionContextValue>({
  version: 'old',
  setVersion: () => {},
});

const STORAGE_KEY = 'ohif:ui-next:version';

function readInitialVersion(): UINextVersion {
  // 1) URL override (easy for testing): ?uiNext=new
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('uiNext');
    if (fromUrl === 'new' || fromUrl === 'old') {
      return fromUrl;
    }

    // 2) localStorage (persist choice)
    try {
      const fromStorage = window.localStorage.getItem(STORAGE_KEY);
      if (fromStorage === 'new' || fromStorage === 'old') {
        return fromStorage as UINextVersion;
      }
    } catch {
      // localStorage may be unavailable in some environments
    }
  }

  // 3) default
  return 'old';
}

/**
 * Global version provider for switching between old and new UI component implementations.
 *
 * Can be used globally (wrap the whole app) OR locally (wrap just a section)
 * to compare old vs new side-by-side.
 *
 * Usage:
 * - URL parameter: ?uiNext=new or ?uiNext=old
 * - localStorage: persists the choice under 'ohif:ui-next:version'
 * - forcedVersion prop: override for specific sections
 */
export function UINextVersionProvider({
  children,
  forcedVersion,
}: {
  children: React.ReactNode;
  forcedVersion?: UINextVersion;
}) {
  const [version, setVersionState] = React.useState<UINextVersion>(readInitialVersion);

  const setVersion = React.useCallback((next: UINextVersion) => {
    setVersionState(next);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // localStorage may be unavailable in some environments
      }
    }
  }, []);

  const value = React.useMemo<UINextVersionContextValue>(
    () => ({
      version: forcedVersion ?? version,
      setVersion,
    }),
    [forcedVersion, version, setVersion]
  );

  return <UINextVersionContext.Provider value={value}>{children}</UINextVersionContext.Provider>;
}

/**
 * Hook to get the current UI version ('old' or 'new').
 * Use this in proxy components to decide which implementation to render.
 */
export function useUINextVersion(): UINextVersion {
  return React.useContext(UINextVersionContext).version;
}

/**
 * Hook to get both the version and the setter.
 * Use this for UI controls that let users toggle between versions.
 */
export function useUINextVersionControls() {
  const ctx = React.useContext(UINextVersionContext);
  return { version: ctx.version, setVersion: ctx.setVersion };
}
