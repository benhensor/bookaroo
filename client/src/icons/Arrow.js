import React from 'react'
import styled from 'styled-components'

export default function Arrow({ isActive }) {
  return (
    <ArrowWrapper $isActive={isActive}>
      <svg
        width="12"
        height="8"
        viewBox="0 0 12 8"
        fill="none"
      >
        <path
          d="M1.5 1.5L6.5 6.5L11.5 1.5"
          stroke="black"
          strokeWidth="2"
        />
      </svg>
    </ArrowWrapper>
  )
}

const ArrowWrapper = styled.div`
  position: absolute;
	right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.2rem;
  height: 0.8rem;
	rotate: 90deg;
  transition: transform 0.3s ease;

  transform: ${({ $isActive }) =>
    $isActive ? 'rotate(-90deg)' : 'rotate(-180deg)'};
  
  svg path {
    transition: stroke 0.3s ease;
    stroke: ${({ $isActive }) =>
      $isActive ? 'var(--accentGreen)' : 'var(--dkGreen)'};
  }
`
