import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Global, css } from '@emotion/react';
import App from './App.jsx';

const globalStyle = css`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background-color: #eef7f3;
    color: #243b35;
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
