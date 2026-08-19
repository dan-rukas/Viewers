import { useEffect, useState } from 'react';

/**
 * Breakpoint hook for the experimental mobile shell.
 *
 * Thresholds align with the workspace Tailwind screens
 * (platform/ui/tailwind.config.js: sm 640 / md 768 / lg 1024):
 *   phone   < 768
 *   tablet  768–1023
 *   desktop >= 1024
 *
 * Also exposes orientation and pointer coarseness so the shell can decide
 * on either signal (open question: width vs pointer vs both).
 */
export type BreakpointName = 'phone' | 'tablet' | 'desktop';

export interface BreakpointState {
  name: BreakpointName;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isCoarsePointer: boolean;
  width: number;
  height: number;
}

const TABLET_QUERY = '(min-width: 768px)';
const DESKTOP_QUERY = '(min-width: 1024px)';
const PORTRAIT_QUERY = '(orientation: portrait)';
const COARSE_QUERY = '(pointer: coarse)';

function compute(): BreakpointState {
  const isTabletUp = window.matchMedia(TABLET_QUERY).matches;
  const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
  const name: BreakpointName = isDesktop ? 'desktop' : isTabletUp ? 'tablet' : 'phone';

  return {
    name,
    isPhone: name === 'phone',
    isTablet: name === 'tablet',
    isDesktop,
    isPortrait: window.matchMedia(PORTRAIT_QUERY).matches,
    isCoarsePointer: window.matchMedia(COARSE_QUERY).matches,
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export default function useBreakpoint(): BreakpointState {
  const [state, setState] = useState<BreakpointState>(compute);

  useEffect(() => {
    const queries = [TABLET_QUERY, DESKTOP_QUERY, PORTRAIT_QUERY, COARSE_QUERY].map(q =>
      window.matchMedia(q)
    );
    const onChange = () => setState(compute());

    queries.forEach(mql => mql.addEventListener('change', onChange));
    // width/height in the debug badge should track continuously, not just at thresholds
    window.addEventListener('resize', onChange);

    return () => {
      queries.forEach(mql => mql.removeEventListener('change', onChange));
      window.removeEventListener('resize', onChange);
    };
  }, []);

  return state;
}
