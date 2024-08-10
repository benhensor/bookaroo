import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useMessages } from '../../context/MessagesContext'
import Button from '../buttons/Button'
import Logo from '../../assets/images/bookarooLogo.webp'
import MenuIcon from '../../icons/MenuIcon'

export default function Header() {
	const { user, logout } = useAuth()
	const { messages } = useMessages()
	const navigate = useNavigate()
	const [isOpen, setIsOpen] = useState(false)


	const toggleMenu = useCallback(() => {
		setIsOpen((prevIsOpen) => !prevIsOpen)
	}, [])


	const handleEditProfile = () => {
		setIsOpen(false)
		navigate('/dashboard')
	}


	const handleLogout = () => {
		logout()
		setIsOpen(false)
		navigate('/')
	}


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
					{!user && (
						<Button type="link" text="Login" to='/login' />
					)}
					<MenuIcon isOpen={isOpen} onClick={toggleMenu}/>
				</UserControls>
				
			</Container>
		{isOpen && (
			<UserMenu $isActive={isOpen}>
				<MenuItem>
					<Button type="word" text="Messages" onClick={handleEditProfile} />
					<Notification>{messages?.length}</Notification>
				</MenuItem>
				<MenuItem>
					<Button type="word" text="Edit Profile" onClick={handleEditProfile} />
				</MenuItem>
				<MenuItem>
					<Button type="word" text="Sign Out" onClick={handleLogout} />
				</MenuItem>
			</UserMenu>
		)}
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
	position: relative;
`

const LogoContainer = styled.div`
	display: flex;
	align-items: center;
	width: fit-content;
	p {
		font-size: clamp(2.5rem, 2.5vw, 4.5rem);
		letter-spacing: .1rem;
		line-height: 1em;
		font-weight: 700;
		color: var(--blkGreen);
		font-family: 'HaveHeartOne', sans-serif;
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
	margin-right: var(--md);
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
	gap: var(--lg);
	cursor: pointer;
`

const UserMenu = styled.div`
	outline: 1px solid var(--greyGreen);
	position: absolute;
	top: 5.8rem;
	right: calc((100vw - 100rem) / 2);
	height: auto;
  width: 15rem;
	border-bottom-left-radius: var(--xs);
	background-color: #fff;
  opacity: ${({ $isActive }) => ($isActive ? '1' : '0')};
	transition: all 2s ease-in-out;
	padding: var(--sm);
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: var(--sm);
	overflow-y: auto;
	z-index: 1001;
	@media only screen and (max-width: 999px) {
		right: 0;
	}
`

const MenuItem = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const Notification = styled.div`
margin-left: var(--sm);
	background-color: var(--danger);
	color: var(--white);
	border-radius: 50%;
	width: 2rem;
	height: 2rem;
	display: flex;
	justify-content: center;
	align-items: center;
	font-family: 'Centra', sans-serif;
	font-size: 1.2rem;
	font-weight: bold;
`