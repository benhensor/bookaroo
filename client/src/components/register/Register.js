import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import ActionButton from '../buttons/ActionButton'
import LinkButton from '../buttons/LinkButton'

const Register = () => {
  const navigate = useNavigate()
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
    phone: '',
		addressLine1: '',
		addressLine2: '',
		city: '',
		postcode: '',
	})

	const {
		username,
		email,
		password,
    phone,
		addressLine1,
		addressLine2,
		city,
		postcode,
	} = formData

	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value })

	const onSubmit = async (e) => {
		e.preventDefault()
		try {
			const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, formData)
			console.log(res.data)
      navigate('/dashboard')
		} catch (error) {
			console.error(error.response.data)
		}
	}

	return (
		<section>
      <Content>
				<h1>Register</h1>
				<Form onSubmit={onSubmit} method="post" autoComplete="false">
								<input autoComplete="false" name="hidden" type="text" style={{display:' none'}}></input>
								<InputGroup>
									<label htmlFor="username">Username</label>
									<input
										type="text"
										name="username"
							value={username}
										placeholder="Username"
										onChange={onChange}
										required
									/>
								</InputGroup>
								<InputGroup>
									<label htmlFor="email">Email</label>
									<input
										type="email"
										name="email"
							value={email}
										placeholder="Email"
										onChange={onChange}
										required
									/>
								</InputGroup>
								<InputGroup>
									<label htmlFor="password">Password</label>
									<input
										type="password"
										name="password"
							value={password}
										placeholder="Password"
										onChange={onChange}
										required
									/>
								</InputGroup>
								<InputGroup>
									<label htmlFor="phone">Phone</label>
									<input
										type="text"
										name="phone"
							value={phone}
										placeholder="Phone"
										onChange={onChange}
										required
									/>
								</InputGroup>
								<InputGroup>
									<label htmlFor="addressLine1">Address Line 1</label>
									<input
										type="text"
										name="addressLine1"
							value={addressLine1}
										placeholder="Address Line 1"
										onChange={onChange}
										required
									/>
								</InputGroup>
								<InputGroup>
									<label htmlFor="addressLine2">Address Line 2</label>
									<input
										type="text"
										name="addressLine2"
							value={addressLine2}
										placeholder="Address Line 2"
										onChange={onChange}
									/>
								</InputGroup>
								<InputGroup>
									<label htmlFor="city">City</label>
									<input
										type="text"
										name="city"
							value={city}
										placeholder="City"
										onChange={onChange}
										required
									/>
								</InputGroup>
								<InputGroup>
									<label htmlFor="postcode">Postcode</label>
									<input
										type="text"
										name="postcode"
							value={postcode}
										placeholder="Postcode"
										onChange={onChange}
										required
									/>
								</InputGroup>
								<ActionButton text="Submit" />
							</Form>
				<p>Already have an account?</p>
							<LinkButton to="/login" text="Sign In" />
			</Content>
    </section>
	)
}

export default Register

const Content = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`

const Form = styled.form`
	display: flex;
	flex-direction: column;
	width: 30rem;
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
		font-size: 1.4rem;
		border: 1px solid #ccc;
		border-radius: var(--xs);
	}
`