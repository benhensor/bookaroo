import React from 'react'
import styled from 'styled-components'
import Logo from '../../assets/images/bookarooLogo.webp'

export default function Header() {
  return (
    <Head>
      <Container>
        <LogoContainer>
          <LogoBackground>
            <img src={Logo} alt="Bookaroo" />
          </LogoBackground>
          <p>Bookaroo</p>
        </LogoContainer>
        <UserContainer>
          <User>U</User>
        </UserContainer>
      </Container>
    </Head>
  )
}

const Head = styled.header`
  background-color: #fff;
  border-bottom: 1px solid var(--greyGreen);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
`

const Container = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  p {
    font-size: clamp(1.5rem, 2.5vw, 2.5rem);
    font-weight: 700;
    color: var(--blkGreen);
    font-family: 'Poppins', sans-serif;
  }
`

const LogoBackground = styled.div`
  background-color: var(--accentGreen);
  border-radius: 50%;
  border: 1px solid var(--blkGreen);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3.5rem;
  height: 3.5rem;
  margin-right: var(--xs);
  position: relative;
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 4rem;
  }
`

const UserContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const User = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bgGreenA);
  border-radius: 50%;
  border: 1px solid var(--blkGreen);
  width: 3.5rem;
  height: 3.5rem;
  font-family: 'Poppins', sans-serif;
`