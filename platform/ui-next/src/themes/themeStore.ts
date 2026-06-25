import './themes.css';
import { themePresets } from './index';

const STORAGE_KEY_THEME = 'ohif:theme';
const STORAGE_KEY_CUSTOM_CSS = 'ohif:custom-theme-css';
const CUSTOM_STYLE_ID = 'ohif-custom-theme';
const VALID_THEMES = new Set(['default', 'custom', ...themePresets.map(p => p.name)]);

function isValidUrlTheme(theme: string | null): theme is string {
  return !!theme && theme !== 'custom' && VALID_THEMES.has(theme);
}

function removeThemeClasses() {
  const classList = document.body.classList;
  const toRemove: string[] = [];
  classList.forEach(cls => {
    if (cls.startsWith('theme-')) {
      toRemove.push(cls);
    }
  });
  toRemove.forEach(cls => classList.remove(cls));
}

function removeCustomStyleElement() {
  const style = document.getElementById(CUSTOM_STYLE_ID);
  if (style) {
    style.remove();
  }
}

function parseCssVars(cssText: string): string[] {
  const vars: string[] = [];
  const stripped = cssText.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\*[\s\S]*$/, '');

  for (const raw of stripped.split(/[\n;]/)) {
    let line = raw.trim();

    const braceIdx = line.lastIndexOf('{');
    if (braceIdx !== -1) {
      line = line.slice(braceIdx + 1).trim();
    }

    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const name = line.slice(0, colonIdx).trim();
    if (!/^--[a-zA-Z0-9-]+$/.test(name)) continue;

    const value = line
      .slice(colonIdx + 1)
      .replace(/[{}]/g, '')
      .trim();
    if (!value) continue;

    if (value.includes('(') || value.includes(')')) continue;

    vars.push(`  ${name}: ${value};`);
  }

  return vars;
}

function injectCustomStyles(vars: string[]) {
  const block = vars.join('\n');
  const css = `:root {\n${block}\n}\n.dark {\n${block}\n}`;

  let style = document.getElementById(CUSTOM_STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = CUSTOM_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = css;
}

// --- State ---

type ThemeSnapshot = {
  activeTheme: string;
  customCss: string;
};

let snapshot: ThemeSnapshot = Object.freeze({
  activeTheme: 'default',
  customCss: '',
});

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach(fn => fn());
}

function updateSnapshot(partial: Partial<ThemeSnapshot>) {
  snapshot = Object.freeze({ ...snapshot, ...partial });
  emit();
}

// --- Public API ---

function setActiveTheme(theme: string) {
  if (!VALID_THEMES.has(theme)) return;

  removeThemeClasses();

  if (theme !== 'default' && theme !== 'custom') {
    document.body.classList.add(`theme-${theme}`);
  }

  if (theme !== 'custom') {
    removeCustomStyleElement();
  }

  if (theme === 'default') {
    localStorage.removeItem(STORAGE_KEY_THEME);
  } else {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }

  updateSnapshot({ activeTheme: theme });
}

function applyCustomTheme(cssText: string): boolean {
  const vars = parseCssVars(cssText);
  if (vars.length === 0) return false;

  injectCustomStyles(vars);

  localStorage.setItem(STORAGE_KEY_CUSTOM_CSS, cssText);
  removeThemeClasses();
  localStorage.setItem(STORAGE_KEY_THEME, 'custom');

  updateSnapshot({ activeTheme: 'custom', customCss: cssText });
  return true;
}

function clearCustomTheme() {
  removeCustomStyleElement();

  localStorage.removeItem(STORAGE_KEY_CUSTOM_CSS);
  removeThemeClasses();
  localStorage.removeItem(STORAGE_KEY_THEME);

  updateSnapshot({ activeTheme: 'default', customCss: '' });
}

export const themeStore = {
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: (): ThemeSnapshot => snapshot,
  setActiveTheme,
  applyCustomTheme,
  clearCustomTheme,
};

// --- Initialize on import ---

function initialize() {
  if (typeof window === 'undefined') return;

  const urlTheme = new URLSearchParams(window.location.search).get('theme');

  let initialTheme = 'default';

  if (isValidUrlTheme(urlTheme)) {
    initialTheme = urlTheme;
    if (urlTheme === 'default') {
      localStorage.removeItem(STORAGE_KEY_THEME);
    } else {
      localStorage.setItem(STORAGE_KEY_THEME, urlTheme);
    }
  } else {
    const stored = localStorage.getItem(STORAGE_KEY_THEME);
    if (stored && VALID_THEMES.has(stored)) {
      if (stored === 'custom' && !localStorage.getItem(STORAGE_KEY_CUSTOM_CSS)) {
        initialTheme = 'default';
      } else {
        initialTheme = stored;
      }
    }
  }

  const initialCustomCss = localStorage.getItem(STORAGE_KEY_CUSTOM_CSS) || '';

  snapshot = Object.freeze({ activeTheme: initialTheme, customCss: initialCustomCss });

  if (initialTheme === 'custom' && initialCustomCss) {
    const vars = parseCssVars(initialCustomCss);
    if (vars.length > 0) {
      injectCustomStyles(vars);
    }
  } else if (initialTheme !== 'default') {
    document.body.classList.add(`theme-${initialTheme}`);
  }
}

initialize();
