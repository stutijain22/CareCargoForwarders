import { createContext, useContext } from 'react';

export const ThemeContext = createContext<{theme: any} | null>(null);


export const setThemeJSON = () => {
  return useContext(ThemeContext)
};