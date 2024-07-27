import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import ActionButton from '../buttons/ActionButton'
import WordButton from '../buttons/WordButton'

const Login = () => {
	const navigate = useNavigate()
	const { login } = useAuth()
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	})

	const { email, password } = formData

	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value })

	const onSubmit = async (e) => {
		e.preventDefault()
		try {
			const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, formData)
			// console.log('onSubmit', res.data)
			sessionStorage.setItem('token', res.data.token)
			login()
			navigate('/dashboard')
		} catch (error) {
			console.error(error.response.data)
		}
	}

	return (
		<section>
			<Content>
				<Form onSubmit={onSubmit}>
					<input
						type="email"
						name="email"
						value={email}
						onChange={onChange}
						placeholder="Email"
						required
					/>
					<input
						type="password"
						name="password"
						value={password}
						onChange={onChange}
						placeholder="Password"
						required
					/>
					<ActionButton type="submit" text="Login" />
				</Form>
				<p>Don't have an account? &nbsp;<WordButton to="/register" text="Register" /></p>
				
			</Content>
		</section>
	)
}

export default Login

const Content = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: var(--lg);
`

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: var(--md);
	width: 30rem;
	margin-top: var(--lg);
	label {
		font-size: 1.2rem;
		margin-bottom: var(--xs);
	}
	input {
		padding: var(--xs);
		font-size: 1.4rem;
		border: 1px solid #ccc;
		border-radius: var(--xs);
	}
`