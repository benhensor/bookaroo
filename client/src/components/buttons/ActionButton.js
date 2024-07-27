import React from 'react'
import styled from 'styled-components'

export default function ActionButton({ text, onClick }) {



  const handleClick = (event) => {
    if (onClick) {
      onClick(event)
    }
  }

  return (
    <StyledButton
      onClick={handleClick}
    >
      {text}
    </StyledButton>
  )
}

const StyledButton = styled.button`
  display: inline-block;
  box-sizing: border-box;
  padding: var(--sm) var(--md);
  background-color: var(--accentGreen);
  color: var(--blkGreen);
  font-size: 1.2rem;
  cursor: pointer;
  transition: var(--fast);
  &:hover {
    background-color: var(--dkGreen);
    color: var(--white);
  }
`