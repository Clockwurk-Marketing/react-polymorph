import React from 'react';
import { ThemeProvider } from '../../source/components/ThemeProvider';
import { SimpleTheme } from '../../source/themes/simple';

export const decorateWithSimpleTheme = (story) => (
  <ThemeProvider theme={SimpleTheme}>
    {story()}
  </ThemeProvider>
);
