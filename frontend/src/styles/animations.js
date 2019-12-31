import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  .dialog-enter {
    opacity: 0.01;
    transform: scale(1.1);
  }
  .dialog-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: all 300ms;
  }
  .dialog-exit {
    opacity: 1;
    transform: scale(1);
  }
  .dialog-exit-active {
    opacity: 0.01;
    transform: scale(1.1);
    transition: all 300ms;
  }


  .fadein-enter {
    opacity: 0.01;

  }
  .fadein-enter-active {
    opacity: 1;
    transition: all 3000ms;
  }

  .slideleft-enter {
    opacity: 0.01;
    transform: translate3d(-100%, 0, 0);
    visibility: visible;
  }
  .slideleft-enter-active {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    transition: all 500ms;
  }

`;
