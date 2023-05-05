import React, { useReducer } from 'react';
import { createTheme, GrafanaTheme2 } from '@grafana/data';

export enum Theme {
  dark = 'dark',
  light = 'light',
}

interface ThemeCfg {
  theme: Theme;
  toggleTheme: React.DispatchWithoutAction;
  grafanaTheme: GrafanaTheme2;
}

const defaultTheme = Theme.dark;

const initialState: ThemeCfg = {
  theme: defaultTheme,
  toggleTheme: (): void => {},
  grafanaTheme: createTheme({ colors: { mode: defaultTheme } }),
};

const themeReducer = (state: ThemeCfg): ThemeCfg => {
  const theme: Theme = state.theme === Theme.dark ? Theme.light : Theme.dark;
  const grafanaTheme: GrafanaTheme2 = createTheme({ colors: { mode: theme } });
  return { ...state, theme, grafanaTheme };
};

export const ThemeContext: React.Context<ThemeCfg> = React.createContext(initialState);

export const ThemeProvider = (props: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  const themeCfg: ThemeCfg = { theme: state.theme, grafanaTheme: state.grafanaTheme, toggleTheme: dispatch };
  return <ThemeContext.Provider value={themeCfg}>{props.children}</ThemeContext.Provider>;
};
