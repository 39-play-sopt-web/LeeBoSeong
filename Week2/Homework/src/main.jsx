import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Global, css } from '@emotion/react';
import App from './App.jsx';

const globalStyle = css`
  :root {
    --color-background: #eef7f3;
    --color-surface: #ffffff;
    --color-text: #243b35;
    --color-text-muted: #65776f;
    --color-menu-text: #53665f;
    --color-primary: #286c58;
    --color-primary-light: #e0f0e8;
    --color-border: #cadbd2;
    --color-divider: #d7e6df;
    --color-danger: #a32020;
    --color-danger-light: #fff1f0;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background-color: var(--color-background);
    color: var(--color-text);
    font-family: Arial, 'Malgun Gothic', sans-serif;
  }

  button,
  select {
    font: inherit;
  }

`;

// index.html에 있던 id = 'root'인 요소를 찾는 부분
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Global styles={globalStyle} />
    <App />
  </StrictMode>,
);
