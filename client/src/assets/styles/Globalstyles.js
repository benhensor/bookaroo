import { createGlobalStyle } from 'styled-components';
import '../fonts/fonts.css';

const GlobalStyles = createGlobalStyle`

  :root {

    ::-webkit-scrollbar {display:none;}

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
    --danger: #ff4d4d;
    --dangerDk: #cc0000;

    // Fonts

    // Spacing
    --xs: .4rem;
    --sm: .8rem;
    --md: 1.6rem;
    --lg: 2.4rem;
    --xl: 3.2rem;

    // Transitions
    --fast: all .12s ease;
    --medium: all .24s ease;
    --slow: all .36s ease;
  }

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    user-select: none;
    font-size: 62.5%;
  }

  body {
    font-family: 'Poppins', sans-serif;
    font-size: 1.6rem;
    line-height: 1.6;
    color: var(--blkGreen);
    overflow-x: hidden;
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
    border: none;
    border-radius: var(--xs);
    cursor: pointer;
    transition: var(--fast);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--sm);
    margin: 0 auto;
    width: 40rem;
    margin-top: var(--lg);
  }

  label {
    display: flex;
    flex-direction: column;
    gap: var(--sm);
		font-size: 1.2rem;
		margin-bottom: var(--xs);
	}

  input, select, textarea {
		padding: var(--sm);
		font-size: 1.4rem;
		border: 1px solid #ccc;
		border-radius: var(--xs);
	}

  img {
    max-width: 100%;
    height: auto;
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
    form {
      width: 100%;
    }
  }
`

export default GlobalStyles;