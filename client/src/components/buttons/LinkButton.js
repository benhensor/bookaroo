import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

export default function LinkButton({ to, text, onClick }) {

  const handleClick = (event) => {
    if (onClick) {
      onClick(event)
    }
  }

  return (
    <StyledLink
      to={to}
      onClick={handleClick}
      $text={text}
    >
      {text}
    </StyledLink>
  )
}

const StyledLink = styled(Link)`
  display: inline-block;
  box-sizing: border-box;
  padding: var(--sm) var(--md);
  border: none;
  border-radius: var(--xs);
  background-color: ${(props) => props.$text === 'Sign Out' ? 'var(--danger)' : 'var(--accentGreen)'};
  color: ${(props) => props.$text === 'Sign Out' ? 'var(--white)' : 'var(--blkGreen)'};
  text-decoration: none;
  text-align: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: var(--fast);
  &:hover {
    background-color: ${(props) => props.$text === 'Sign Out' ? 'var(--dangerDk)' : 'var(--dkGreen)'};
    color: var(--white);
  }
`