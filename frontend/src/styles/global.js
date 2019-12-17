import { createGlobalStyle } from 'styled-components';
import { darken, lighten } from 'polished';

import 'react-toastify/dist/ReactToastify.css';

export default createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap');
  :root {
  --color-primary: #ee4d64;
  --color-primary-light: ${lighten(0.03, '#ee4d64')};
  --color-primary-dark: ${darken(0.03, '#ee4d64')};
  --text-color: #444;
  --text-color-dark: #666;
  --text-color-light: #999;
  --text-color-table: #666;

  --color-success: #00c851;
  --color-info: #4dbaf9;
  --color-error: #f94d6a;
  --color-warning: #ffbb33;
  --color-success-dark: ${darken(0.03, '#00c851')};
  --color-info-dark: ${darken(0.03, '#4dbaf9')};
  --color-error-dark: ${darken(0.03, '#f94d6a')};
  --color-warning-dark: ${darken(0.03, '#ffbb33')};
}
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }
  *:focus {
    outline: 0;
  }
  html {
    font-size: 62.5%; /* 10px */
  }

  html, body {
    height: 100%;
  }
  body {
    background: linear-gradient(to bottom, var(--color-primary), var(--color-primary-light)) fixed;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale;
  }
  body, input, button, textarea {
    font: 1.4rem 'Roboto', sans-serif;
    color: var(--text-color);
  }
  a {
    text-decoration: none;
  }
  ul {
    list-style: none
  }
  button {
    cursor: pointer;
  }

  span.logo {
    font-size: 29px;
    font-weight: bold;
    color: var(--color-primary);
  }
  div.logo {
    display: block;
    margin: 0 auto;
    width: 124px;
    img {
      width: 62px;
      display: inline-block;
      position: relative;
      top: 0;
      left: 12px;
    }

    img + img {
      width: 62px;
      display: inline-block;
      position: relative;
      top: 0;
      left: -12px;
    }
  }
`;
