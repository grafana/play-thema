import React, { useContext, useState } from 'react';
import { createTheme, GrafanaTheme2 } from '@grafana/data';
import memoizeOne from 'memoize-one';

type ThemeObject = {
  id: string;
  name: string;
  build: () => GrafanaTheme2;
};
const themeRegistry: ThemeObject[] = [
  { id: 'system', name: 'System preference', build: getSystemPreferenceTheme },
  { id: 'dark', name: 'Dark', build: () => createTheme({ colors: { mode: 'dark' } }) },
  { id: 'light', name: 'Light', build: () => createTheme({ colors: { mode: 'light' } }) },
];

export enum Theme {
  dark = 'dark',
  light = 'light',
}

type ThemeContextType = [GrafanaTheme2, () => void];

export const ThemeContext = React.createContext<ThemeContextType>([getThemeById(''), () => {}]);

export const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  const [theme, setTheme] = useState<GrafanaTheme2>(getThemeById(''));
  const toggleTheme = () => {
    const newTheme = theme.isDark ? getThemeById('light') : getThemeById('dark');
    setTheme(newTheme);
  };
  return <ThemeContext.Provider value={[theme, toggleTheme]}>{children}</ThemeContext.Provider>;
};

export function useThemeContext() {
  const context = useContext<ThemeContextType>(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within the ThemeProvider');
  }
  return context;
}

export const useTheme = () => {
  const [theme] = useThemeContext();

  return theme;
};

function getSystemPreferenceTheme() {
  const mediaResult = window.matchMedia('(prefers-color-scheme: dark)');
  const id = mediaResult.matches ? 'dark' : 'light';
  return getThemeById(id);
}

export function getThemeById(id: string): GrafanaTheme2 {
  const theme = themeRegistry.find((theme) => theme.id === id);
  if (theme) {
    return theme.build();
  }

  return getSystemPreferenceTheme();
}

export const memoizedStyleCreators = new WeakMap();

export function useStyles<T>(getStyles: (theme: GrafanaTheme2) => T) {
  const theme = useTheme();

  let memoizedStyleCreator = memoizedStyleCreators.get(getStyles) as typeof getStyles;
  if (!memoizedStyleCreator) {
    memoizedStyleCreator = memoizeOne(getStyles);
    memoizedStyleCreators.set(getStyles, memoizedStyleCreator);
  }

  return memoizedStyleCreator(theme);
}
