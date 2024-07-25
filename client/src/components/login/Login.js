import React from 'react'
import styled from 'styled-components'

const Login = () => {
	const handleLogin = () => {
		window.location.href = 'http://localhost:5000/auth/google'
	}



	return (
		<section>
			<Title>Find your next read...</Title>
			<Login onClick={handleLogin}>Login with Google</Login>
      <button></button>
		</section>
	)
}

export default Login

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: var(--md);
`
