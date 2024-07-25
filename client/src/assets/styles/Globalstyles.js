import { createGlobalStyle } from 'styled-components';
import '../fonts/fonts.css';

const GlobalStyles = createGlobalStyle`

  :root {

    // Colors
    --accentGreen: #10f98f;
    --accentLtGreen: #4fffb0;
    --bgGreenA: #9ecda6;
    --bgGreenB: #98b5ab;
    --dkGreen: #049660;
    --blkGreen: #02272A;
    --greyGreen: #bcc8b8;
    --ltGreen: #d8e8d4;
    --white: #fff;
    --black: #000;

    // Spacing
    --xs: .4rem;
    --sm: .8rem;
    --md: 1.6rem;
    --lg: 2.4rem;
    --xl: 3.2rem;
  }

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%;
  }

  body {
    font-family: 'Poppins', sans-serif;
    font-size: 1.6rem;
    line-height: 1.6;
    color: var(--blkGreen);
  }

  main {
    margin-top: 6.4rem;
  }

  section {
    max-width: 100rem;
    margin: 0 auto;
    padding: var(--sm) 0;
  }

  button {
    padding: var(--sm) var(--md);
    border: none;
    border-radius: var(--xs);
    cursor: pointer;
  }

  @media only screen and (max-width: 999px) {
    section {
      padding: var(--sm) var(--md);
    }
  }
  @media only screen and (max-width: 450px) {
    section {
      padding: var(--sm);
    }
  }

`

export default GlobalStyles;