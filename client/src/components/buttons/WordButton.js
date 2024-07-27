import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../context/AuthContext'

export default function WordButton({ to, text, onClick }) {

  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleClick = (event) => {
    if (text === 'Sign Out') {
      event.preventDefault()
      logout()
      navigate(to)
    } else if (onClick) {
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