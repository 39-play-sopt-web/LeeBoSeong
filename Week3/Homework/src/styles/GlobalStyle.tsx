import { Global } from '@emotion/react';

export default function GlobalStyle() {
  return (
    <Global
      styles={(theme) => ({
        ':root': {
          colorScheme: 'dark',
          '--app-canvas': theme.colors.canvas,
          '--app-surface': theme.colors.surface,
          '--app-ink': theme.colors.ink,
          '--app-muted': theme.colors.muted,
          '--app-accent': theme.colors.accent,
          '--app-line': theme.colors.line,
        },
        body: {
          minWidth: 320,
          margin: 0,
          backgroundColor: theme.colors.canvas,
          color: theme.colors.ink,
          fontFamily: theme.fontFamily,
          lineHeight: 1.6,
          WebkitFontSmoothing: 'antialiased',
        },
        '#root': { minHeight: '100dvh' },
        ':focus-visible': {
          outline: `2px solid ${theme.colors.accent}`,
          outlineOffset: 5,
        },
        '::selection': {
          backgroundColor: theme.colors.accent,
          color: theme.colors.canvas,
        },
      })}
    />
  );
}
