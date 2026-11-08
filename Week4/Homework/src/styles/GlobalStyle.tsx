import { Global } from '@emotion/react';

export default function GlobalStyle() {
  return (
    <Global
      styles={(theme) => ({
        '*': {
          boxSizing: 'border-box',
        },
        body: {
          margin: 0,
          minWidth: 320,
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          fontFamily: '"Pretendard", "Malgun Gothic", system-ui, sans-serif',
          lineHeight: 1.6,
        },
        '#root': {
          minHeight: '100dvh',
        },
        '.board-header': {
          backgroundColor: theme.colors.surface,
          borderBottom: `1px solid ${theme.colors.border}`,
        },
        '.board-header-inner': {
          width: 'calc(100% - 48px)',
          maxWidth: 960,
          margin: '0 auto',
          padding: '16px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        },
        '.board-brand': {
          color: theme.colors.text,
          fontWeight: 700,
          textDecoration: 'none',
        },
        '.board-part': {
          marginLeft: 12,
          color: theme.colors.muted,
          fontSize: 14,
        },
        '.board-header nav': {
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
        },
        '.board-header nav a': {
          color: theme.colors.text,
        },
        '.board-header nav button': {
          padding: 0,
          border: 0,
          background: 'none',
          color: theme.colors.text,
          textDecoration: 'underline',
        },
        '.board-header nav a[aria-current="page"]': {
          color: theme.colors.primary,
          fontWeight: 700,
        },
        'main a': {
          color: theme.colors.primary,
        },
        '.auth-form': {
          display: 'grid',
          gap: 12,
          maxWidth: 360,
          marginBottom: 20,
        },
        '.auth-form select': {
          padding: '8px 12px',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 6,
          backgroundColor: theme.colors.surface,
          color: theme.colors.text,
        },
        '.auth-submit': {
          padding: '8px 12px',
          border: 0,
          borderRadius: 6,
          backgroundColor: theme.colors.primary,
          color: theme.colors.surface,
          transition: 'background-color 150ms ease',
        },
        '.auth-submit:hover:enabled': {
          backgroundColor: '#2856c2',
        },
        '.auth-submit:disabled': {
          opacity: 0.55,
        },
        '.post-search': {
          display: 'grid',
          gap: 8,
          marginBottom: 24,
        },
        '.post-search-fields': {
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
        },
        '.post-search-fields input': {
          flex: '1 1 180px',
          minWidth: 0,
          padding: '8px 12px',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 6,
        },
        '.post-search-fields button': {
          padding: '8px 16px',
          border: 0,
          borderRadius: 6,
          backgroundColor: theme.colors.primary,
          color: theme.colors.surface,
        },
        '.post-search-fields button:disabled': {
          opacity: 0.55,
        },
        '.post-list': {
          display: 'grid',
          gap: 12,
          listStyle: 'none',
          margin: 0,
          padding: 0,
        },
        'main a.post-preview': {
          display: 'block',
          padding: 16,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 8,
          color: theme.colors.text,
          textDecoration: 'none',
          overflowWrap: 'anywhere',
        },
        '.post-preview h2': {
          margin: 0,
          fontSize: 18,
        },
        '.post-preview:hover h2': {
          textDecoration: 'underline',
        },
        '.post-preview p': {
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          overflow: 'hidden',
          margin: '6px 0',
        },
        '.post-preview small': {
          color: theme.colors.muted,
        },
        '.post-create-form': {
          display: 'grid',
          gap: 8,
          maxWidth: 560,
        },
        '.post-create-form input, .post-create-form textarea': {
          width: '100%',
          padding: '8px 12px',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 6,
        },
        '.post-create-form textarea': {
          resize: 'vertical',
        },
        '.post-create-form button': {
          justifySelf: 'start',
          marginTop: 8,
          padding: '8px 16px',
          border: 0,
          borderRadius: 6,
          backgroundColor: theme.colors.primary,
          color: theme.colors.surface,
        },
        '.post-create-form button:disabled': {
          opacity: 0.55,
        },
        '.post-detail': {
          overflowWrap: 'anywhere',
        },
        '.post-detail-content': {
          marginTop: 16,
          color: theme.colors.text,
          whiteSpace: 'pre-wrap',
        },
        'main a.post-list-link': {
          display: 'inline-block',
          marginTop: 20,
        },
        main: {
          width: 'calc(100% - 48px)',
          maxWidth: 960,
          margin: '48px auto',
          padding: 32,
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 12,
        },
        h1: {
          margin: '0 0 12px',
          fontSize: 28,
        },
        p: {
          margin: 0,
          color: theme.colors.muted,
        },
        'button, input, textarea, select': {
          font: 'inherit',
        },
        button: {
          cursor: 'pointer',
        },
        'button:disabled': {
          cursor: 'not-allowed',
        },
        ':focus-visible': {
          outline: `2px solid ${theme.colors.primary}`,
          outlineOffset: 3,
        },
      })}
    />
  );
}
