import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styled from 'styled-components'

const CompleteProfile = () => {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		username: '',
		email: '',
		password: '',
		phone: '',
		addressLine1: '',
		addressLine2: '',
		city: '',
		postcode: ''
	})
	const navigate = useNavigate()
	const { setUser } = useAuth()

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const response = await axios.post(
				'http://localhost:5000/oauth2complete',
				formData,
				{ withCredentials: true }
			)
			console.log('Registration completed:', response.data)
			setUser(response.data.user)
			navigate('/')
		} catch (error) {
			console.error('Error completing registration:', error)
		}
	}

	return (
		<Container>
			<h1>Complete Your Profile</h1>
			<Form onSubmit={handleSubmit}>
				<InputGroup>
					<label htmlFor="firstName">First Name</label>
					<input
						type="text"
						name="firstName"
						placeholder="First Name"
						onChange={handleChange}
						required
					/>
				</InputGroup>
				<InputGroup>
					<label htmlFor="lastName">Last Name</label>
					<input
						type="text"
						name="lastName"
						placeholder="Last Name"
						onChange={handleChange}
						required
					/>
				</InputGroup>
				<InputGroup>
					<label htmlFor="username">Username</label>
					<input
						type="text"
						name="username"
						placeholder="Username"
						onChange={handleChange}
						required
					/>
				</InputGroup>
				<InputGroup>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						name="email"
						placeholder="Email"
						onChange={handleChange}
						required
					/>
				</InputGroup>
				<InputGroup>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						placeholder="Password"
						onChange={handleChange}
						required
					/>
				</InputGroup>
				<InputGroup>
					<label htmlFor="phone">Phone</label>
					<input
						type="text"
						name="phone"
						placeholder="Phone"
						onChange={handleChange}
						required
					/>
				</InputGroup>
				<InputGroup>
					<label htmlFor="addressLine1">Address Line 1</label>
					<input
						type="text"
						name="addressLine1"
						placeholder="Address Line 1"
						onChange={handleChange}
						required
					/>
				</InputGroup>
				<InputGroup>
					<label htmlFor="addressLine2">Address Line 2</label>
					<input
						type="text"
						name="addressLine2"
						placeholder="Address Line 2"
						onChange={handleChange}
					/>
				</InputGroup>
				<InputGroup>
					<label htmlFor="city">City</label>
					<input
						type="text"
						name="city"
						placeholder="City"
						onChange={handleChange}
						required
					/>
				</InputGroup>
				<InputGroup>
					<label htmlFor="postcode">Postcode</label>
					<input
						type="text"
						name="postcode"
						placeholder="Postcode"
						onChange={handleChange}
						required
					/>
				</InputGroup>
				<button type="submit">Submit</button>
			</Form>
		</Container>
	)
}

export default CompleteProfile

const Container = styled.section`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 6rem;
`

const Form = styled.form`
	display: flex;
	flex-direction: column;
	width: 300px;
	margin-top: var(--lg);
	button {
		padding: var(--sm);
		font-size: 1.2rem;
		background-color: var(--accentGreen);
		color: var(--blkGreen);
		border: none;
		border-radius: var(--xs);
		cursor: pointer;
	}
`

const InputGroup = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: var(--sm);
	label {
		font-size: 1.2rem;
		margin-bottom: var(--xs);
	}
	input {
		padding: var(--xs);
		font-size: 1.2rem;
		border: 1px solid #ccc;
		border-radius: var(--xs);
	}
`