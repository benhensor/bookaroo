import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

export default function WordButton({ to, text, onClick }) {

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
  color: var(--dkGreen);
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: var(--fast);
  &:hover {
    color: var(--accentGreen);
  }
`