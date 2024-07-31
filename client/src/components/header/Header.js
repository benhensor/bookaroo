import React, { useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../../context/AuthContext'
import ActionButton from '../buttons/ActionButton'
import LinkButton from '../buttons/LinkButton'
import Logo from '../../assets/images/bookarooLogo.webp'

export default function Header() {
	const { isAuthenticated, user, updateUserDetails } = useAuth()

	const [isUserClicked, setIsUserClicked] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const [formData, setFormData] = useState({
		username: user?.username || '',
		email: user?.email || '',
		phone: user?.phone || '',
		addressLine1: user?.addressLine1 || '',
		addressLine2: user?.addressLine2 || '',
		city: user?.city || '',
		postcode: user?.postcode || '',
	})

	const handleUserClick = () => {
		setIsUserClicked((prev) => !prev)
		setIsOpen((prev) => !prev)
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
	}

	const handleFormSubmit = (e) => {
		e.preventDefault()
		updateUserDetails(formData) 
    setIsOpen(false)
	}

	const firstInitial = user && user.username ? user.username.charAt(0) : null

	return (
		<Head>
			<Container>
				<LogoContainer>
					<LogoBackground>
						<img src={Logo} alt="Bookaroo" />
					</LogoBackground>
					<p>Bookaroo</p>
				</LogoContainer>
				<UserControls>
					{user && isAuthenticated ? (
						<>
							<User 
								onClick={handleUserClick}
								$isActive={isUserClicked}
							>
								{firstInitial}
							</User>
							<DetailsDiv $isOpen={isOpen}>
								<form onSubmit={handleFormSubmit}>
									<label>
										Username:
										<input
											type="text"
											name="username"
											value={formData.username}
											onChange={handleInputChange}
										/>
									</label>
									<label>
										Email:
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleInputChange}
										/>
									</label>
									<label>
										Phone:
										<input
											type="text"
											name="phone"
											value={formData.phone}
											onChange={handleInputChange}
										/>
									</label>
									<label>
										Address Line 1:
										<input
											type="text"
											name="addressLine1"
											value={formData.addressLine1}
											onChange={handleInputChange}
										/>
									</label>
									<label>
										Address Line 2:
										<input
											type="text"
											name="addressLine2"
											value={formData.addressLine2}
											onChange={handleInputChange}
										/>
									</label>
									<label>
										City:
										<input
											type="text"
											name="city"
											value={formData.city}
											onChange={handleInputChange}
										/>
									</label>
									<label>
										Postcode:
										<input
											type="text"
											name="postcode"
											value={formData.postcode}
											onChange={handleInputChange}
										/>
									</label>
									<div className="menu-buttons">
                    <ActionButton text="Submit" />
                    <LinkButton to="/" text="Sign Out" onClick={() => setIsOpen(!isOpen)}/>
                  </div>
								</form>
							</DetailsDiv>
						</>
					) : (
            <>
						  <LinkButton to="/login" text="Sign In" />
						  <LinkButton to="/register" text="Register" />
            </>
					)}
				</UserControls>
			</Container>
		</Head>
	)
}

const Head = styled.header`
	background-color: #fff;
	border-bottom: 1px solid var(--greyGreen);
	position: fixed;
	top: 0;
	width: 100%;
	height: 5.8rem;
	z-index: 1000;
`

const Container = styled.section`
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const LogoContainer = styled.div`
	display: flex;
	align-items: center;
	width: fit-content;
	p {
		font-size: clamp(1.5rem, 2.5vw, 2.5rem);
		font-weight: 700;
		color: var(--blkGreen);
		font-family: 'Poppins', sans-serif;
	}
`

const LogoBackground = styled.div`
	background-color: var(--accentGreen);
	border-radius: 50%;
	border: 1px solid var(--blkGreen);
	display: flex;
	justify-content: center;
	align-items: center;
	width: 3.5rem;
	height: 3.5rem;
	margin-right: var(--xs);
	position: relative;
	img {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		max-width: 4rem;
	}
`

const UserControls = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: var(--sm);
	cursor: pointer;
`

const User = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${({ $isActive }) => ($isActive ? 'var(--accentGreen)' : 'var(--ltGreen)')};
	border-radius: 50%;
	border: 1px solid var(--blkGreen);
	width: 3.5rem;
	height: 3.5rem;
	font-family: 'Poppins', sans-serif;
	transition: var(--fast);
	&:hover {
		background-color: var(--accentGreen);
	}
`
const DetailsDiv = styled.div`
	position: fixed;
	top: 5.8rem;
	right: 0;
	height: 100vh;
  width: 100vw;
	background-color: #fff;
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
	transform: ${({ $isOpen }) =>
		$isOpen ? 'translateX(0)' : 'translateX(100%)'};
	transition: var(--medium);
	padding: var(--sm);
	display: flex;
	flex-direction: column;
	overflow-y: auto;
	z-index: 1001;

	form {
		display: flex;
		flex-direction: column;
    justify-content: center;
    margin: 0 auto;
    width: 40rem;
    @media only screen and (max-width: 450px) {
      width: 100%;
      margin: 0;
    }
	}

	label {
    display: flex;
    flex-direction: column;
		margin-bottom: var(--sm);
    font-size: 1rem;
    &:last-of-type {
      margin-bottom: 0;
    }
	}

	input {
		padding: 8px;
		margin-bottom: 10px;
		border: 1px solid var(--greyGreen);
		border-radius: 4px;
	}

  .menu-buttons {
    display: flex;
    flex-direction: column;
    gap: var(--sm);
  }

	button {
		padding: 10px;
		background-color: var(--accentGreen);
		color: var(--blkGreen);
		border: none;
		border-radius: 4px;
		cursor: pointer;
		&:hover {
			background-color: var(--dkGreen);
			color: var(--white);
		}
	}
`
