import React, { useContext, useEffect, useState } from 'react';
import { BusEventWithPayload, createTheme, GrafanaTheme2 } from '@grafana/data';
import memoizeOne from 'memoize-one';
import { EventBusSrv, EventBusExtended } from '@grafana/data';
import { ThemeContext } from '@grafana/ui';

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

export const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  const [theme, setTheme] = useState<GrafanaTheme2>(getThemeById(''));

  useEffect(() => {
    document.body.className = theme.name.toLowerCase();
    const sub = appEvents.subscribe(ThemeChangedEvent, (event) => {
      const newTheme = event.payload;
      setTheme(newTheme);
      // TODO this will break if body has other classes
      document.body.className = newTheme.name.toLowerCase();
    });

    return () => sub.unsubscribe();
  }, []);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within the ThemeProvider');
  }
  return context;
}

export const useTheme = () => {
  const theme = useThemeContext();
  return theme;
};

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
