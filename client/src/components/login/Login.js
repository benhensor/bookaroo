import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ActionButton from '../buttons/ActionButton'
import WordButton from '../buttons/WordButton'
import { Content } from '../../assets/styles/GlobalStyles'

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
			await login({
				email,
				password,
			})
			console.log('Logged in successfully')
			navigate('/dashboard')
		} catch (error) {
			console.error('Error during login:', error.message);
			// Display error message to user
		} 
	}

	return (
		<section>
			<Content>
				<h1>Login</h1>
				<form onSubmit={onSubmit}>
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
					<ActionButton type="action" text="Login" />
				</form>
				<p>Don't have an account? &nbsp;<WordButton to="/register" text="Register" /></p>
				
			</Content>
		</section>
	)
}

export default Login