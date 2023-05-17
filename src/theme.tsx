import { BusEventWithPayload, createTheme, EventBusExtended, EventBusSrv, GrafanaTheme2 } from '@grafana/data';
import { ThemeContext } from '@grafana/ui';
import memoizeOne from 'memoize-one';
import React, { useContext, useEffect, useState } from 'react';

export const appEvents: EventBusExtended = new EventBusSrv();

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

export class ThemeChangedEvent extends BusEventWithPayload<GrafanaTheme2> {
  static type = 'theme-changed';
}

const getDefaultThemeId = () => {
  const value = window.localStorage.getItem('theme');
  if (value) {
    return value;
  }

  const mediaResult = window.matchMedia('(prefers-color-scheme: dark)');
  return mediaResult.matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  const [theme, setTheme] = useState<GrafanaTheme2>(getThemeById(getDefaultThemeId()));

  useEffect(() => {
    document.body.className = theme.name.toLowerCase();
    const sub = appEvents.subscribe(ThemeChangedEvent, (event) => {
      const newTheme = event.payload;
      const newThemeName = newTheme.name.toLowerCase();
      setTheme(newTheme);
      localStorage.setItem('theme', newThemeName);
      // TODO this will break if body has other classes
      document.body.className = newThemeName;
    });

    return () => sub.unsubscribe();
  }, [theme.name]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within the ThemeProvider');
  }
  return context;
}

function getSystemPreferenceTheme() {
  const mediaResult = window.matchMedia('(prefers-color-scheme: dark)');
  const id = mediaResult.matches ? 'dark' : 'light';
  return getThemeById(id);
}

// TODO store selected theme in the local storage
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

export const toggleTheme = (theme: GrafanaTheme2) => {
  const newTheme = theme.isDark ? getThemeById('light') : getThemeById('dark');
  appEvents.publish(new ThemeChangedEvent(newTheme));
};
