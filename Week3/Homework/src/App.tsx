import { ThemeProvider } from '@emotion/react';
import { RouterProvider } from 'react-router/dom';
import { router } from './router/router';
import GlobalStyle from './styles/GlobalStyle';
import { theme } from './styles/theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
