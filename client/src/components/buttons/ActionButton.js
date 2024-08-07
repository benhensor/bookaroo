import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

export default function ActionButton({ type, text, onClick }) {
  const [backgroundColor, setBackgroundColor] = useState('')
  const [backgroundHoverColor, setBackgroundHoverColor] = useState('')
  const [color, setColor] = useState('')

  useEffect(() => {
    if (type === 'action') {
      setColor('var(--blkGreen)')
      setBackgroundColor('var(--accentGreen)')
      setBackgroundHoverColor('var(--accentLtGreen)')
    }
    if (type === 'contact') {
      setColor('var(--white)')
      setBackgroundColor('var(--ltBrown)')
      setBackgroundHoverColor('var(--dkBrown)')
    }
    if (type === 'delete') {
      setColor('var(--white)')
      setBackgroundColor('var(--danger)')
      setBackgroundHoverColor('var(--dangerDk)')
    }
  }, [type])

  const handleClick = (event) => {
    if (onClick) {
      onClick(event)
    }
  }

  return (
    <StyledButton
      onClick={handleClick}
      $color={color}  
      $backgroundColor={backgroundColor}
      $backgroundHoverColor={backgroundHoverColor}
    >
      {text}
    </StyledButton>
  )
}

const StyledButton = styled.button`
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  color: ${({ $color }) => $color};
  font-size: 1.2rem;
  cursor: pointer;
  transition: var(--fast);
  &:hover {
    background-color: ${({ $backgroundHoverColor }) => $backgroundHoverColor};
    color: ${({ $color }) => $color};
  }
`