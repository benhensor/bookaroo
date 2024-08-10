import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useBooks } from '../../context/BooksContext'
import { useUser } from '../../context/UserContext'
import { useMessages } from '../../context/MessagesContext'
import styled from 'styled-components'
import { categories } from '../../utils/categories'
import CollapsibleItem from './CollapsibleItem'
import Genre from './Genre'
import Message from '../message/Message'
import Carousel from '../carousel/Carousel'
import Button from '../buttons/Button'
import Arrow from '../../icons/Arrow'

export default function Dashboard() {
	const navigate = useNavigate()
	const { user, isLoading, updateUserPreferences, updateUserDetails } =
		useAuth()
	const { userBooks, recommendations, loading } = useBooks()
	const { likedBooks, likedBooksLoading } = useUser()
	const { messages, markAsRead } = useMessages()
	const [activeDropdown, setActiveDropdown] = useState(false)
	const [selectedPreferences, setSelectedPreferences] = useState([])
	const [openMessage, setOpenMessage] = useState(null)
	const userDetailsRef = useRef(null)
	const preferencesRef = useRef(null)
	const likedRef = useRef(null)
	const messagesRef = useRef(null)

	const [formValues, setFormValues] = useState({
		username: '',
		email: '',
		phone: '',
		addressLine1: '',
		addressLine2: '',
		city: '',
		postcode: '',
	})

	// console.log('User:', messages) // Debugging log

	useEffect(() => {
		if (user) {
			setSelectedPreferences(user.preferences || [])
			setFormValues({
				username: user.username || '',
				email: user.email || '',
				phone: user.phone || '',
				addressLine1: user.addressLine1 || '',
				addressLine2: user.addressLine2 || '',
				city: user.city || '',
				postcode: user.postcode || '',
			})
		}
	}, [user])

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormValues((prevValues) => ({
			...prevValues,
			[name]: value,
		}))
	}

	const handleSaveUserDetails = useCallback(() => {
		if (!user) return

		const {
			username,
			email,
			phone,
			addressLine1,
			city,
			postcode,
		} = formValues

		if (
			!username ||
			!email ||
			!phone ||
			!addressLine1 ||
			!city ||
			!postcode
		) {
			console.log('Missing required fields') // Debugging log
			setActiveDropdown(null)
			return
		}

		updateUserDetails(formValues)
			.then(() => {
				setActiveDropdown(false)
			})
			.catch((error) => {
				console.error('Error updating user details:', error)
			})
	}, [formValues, updateUserDetails, user])

	const handleGenreSelect = (genre) => {
		setSelectedPreferences((prevPreferences) => {
			if (prevPreferences.includes(genre)) {
				return prevPreferences.filter((g) => g !== genre)
			} else {
				return [...prevPreferences, genre]
			}
		})
	}

	const handleSavePreferences = useCallback(() => {
		// console.log('handleSavePreferences called') // Debugging log

		if (!user) {
			console.log('No user found') // Debugging log
			setActiveDropdown(false)
			return
		}

		// console.log('User:', user) // Debugging log
		const currentPreferences = user.preferences || [] // Treat undefined preferences as an empty array

		// console.log('Current preferences:', currentPreferences) // Debugging log
		// console.log('Selected preferences:', selectedPreferences) // Debugging log

		const preferencesChanged =
			JSON.stringify(selectedPreferences) !==
			JSON.stringify(currentPreferences)

		if (!preferencesChanged) {
			// console.log('Preferences have not changed') // Debugging log
			setActiveDropdown(false)
			return
		}

		updateUserPreferences(selectedPreferences)
			.then(() => {
				// console.log('Preferences saved successfully') // Debugging log
				setActiveDropdown(false)
			})
			.catch((error) => {
				console.error('Error saving preferences:', error)
			})
	}, [selectedPreferences, updateUserPreferences, user])

	const handleToggleDropdown = (dropdownName) => {
		if (activeDropdown === dropdownName) {
			setActiveDropdown(false)
		} else {
			setActiveDropdown(dropdownName)
		}
	}

	const toggleMessage = (messageId) => {
		//console.log('messageId:', messageId) // Debugging log
		markAsRead(messageId)
		setOpenMessage(openMessage === messageId ? null : messageId)
	}

	const renderCarousel = (items, title, loading) => {
		if (loading) {
			return <CarouselContainer>Loading...</CarouselContainer>
		}

		return (
			<CarouselContainer>
				<Carousel items={items} title={title} />
			</CarouselContainer>
		)
	}

	if (isLoading) {
		return (
			<section>
				<div>Loading...</div>
			</section>
		)
	}

	if (!user)
		return (
			<section>
				<div>No user data available</div>
			</section>
		)

	return (
		<section>
			<Container>
				<DashboardHeader>
					<h1>Dashboard</h1>
					<CollapsibleItem
						onClick={() => handleToggleDropdown('userDetails')}
						isActive={activeDropdown === 'userDetails'}
						text={`Welcome ${user.username}!`}
					>
						<Dropdown
							ref={userDetailsRef}
							$isClicked={activeDropdown === 'userDetails'}
							$position="absolute"
							$top="100%"
							$left="0"
							$transform="none"
							$width="fit-content"
							$padding="var(--sm)"
							$boxShadow="0 0 1rem rgba(0, 0, 0, 0.2)"
							$border="1px solid var(--ltGreen)"
						>
							<Header>
								<h3>Update your details...</h3>
								<Button
									type="word"
									text="Done"
									onClick={handleToggleDropdown}
								/>
							</Header>
							<form>
								<label>Username</label>
								<input
									type="text"
									name="username"
									value={formValues.username}
									onChange={handleInputChange}
									required
								/>
								<label>Email</label>
								<input
									type="email"
									name="email"
									value={formValues.email}
									onChange={handleInputChange}
									required
								/>
								<label>Phone</label>
								<input
									type="text"
									name="phone"
									value={formValues.phone}
									onChange={handleInputChange}
									required
								/>
								<label>Address Line 1</label>
								<input
									type="text"
									name="addressLine1"
									value={formValues.addressLine1}
									onChange={handleInputChange}
									required
								/>
								<label>Address Line 2</label>
								<input
									type="text"
									name="addressLine2"
									value={formValues.addressLine2}
									onChange={handleInputChange}
								/>
								<label>City</label>
								<input
									type="text"
									name="city"
									value={formValues.city}
									onChange={handleInputChange}
									required
								/>
								<label>Post Code</label>
								<input
									type="text"
									name="postCode"
									value={formValues.postcode}
									onChange={handleInputChange}
									required
								/>
								<Button
									type="action"
									text="Submit"
									onClick={handleSaveUserDetails}
								>
									Save
								</Button>
							</form>
						</Dropdown>
					</CollapsibleItem>
				</DashboardHeader>

				<Details>
					<h2>Controls</h2>
					<Controls>
						{/* Browse available books */}
						<Button
							type="dashboard"
							to="/browse"
							text="Browse available books"
						/>

						{/* List your books */}
						<Button
							type="dashboard"
							to="/list"
							text="Create a listing"
						/>

						{/* Set reading preferences */}
						<CollapsibleItem
							onClick={() => handleToggleDropdown('preferences')}
							isActive={activeDropdown === 'preferences'}
							text={<p>Reading Preferences</p>}
						>
							<Dropdown
								ref={preferencesRef}
								$isClicked={activeDropdown === 'preferences'}
								$position="absolute"
								$top="40%"
								$left="0"
								$transform="none"
								$width="fit-content"
								$padding="var(--sm)"
								$boxShadow="0 0 1rem rgba(0, 0, 0, 0.2)"
								$border="1px solid var(--ltGreen)"
							>
								<Header>
									<h3>Preferences</h3>
									<Button
										type="word"
										text="Done"
										onClick={handleSavePreferences}
									/>
								</Header>
								{categories.map((genre) => (
									<Genre
										key={genre}
										name={genre}
										isSelected={selectedPreferences.includes(
											genre
										)}
										onSelect={handleGenreSelect}
									/>
								))}
							</Dropdown>
						</CollapsibleItem>

						{/* View liked books */}
						<CollapsibleItem
							onClick={() => handleToggleDropdown('liked')}
							isActive={activeDropdown === 'liked'}
							text={<p>Your liked books</p>}
						/>

						{/* View messages */}
						<CollapsibleItem
							onClick={() => handleToggleDropdown('messages')}
							isActive={activeDropdown === 'messages'}
							text={
								<p>
									You have&nbsp;<span>{messages?.length}</span>
									&nbsp;
									{messages?.length === 1
										? 'message'
										: 'messages'}
								</p>
							}
						/>
					</Controls>
				</Details>

				<Dropdown
					ref={messagesRef}
					$isClicked={activeDropdown === 'messages'}
					$position="normal"
					$top="0"
					$left="0"
					$transform="none"
					$width="100%"
					$padding="0"
					$boxShadow="none"
					$border="none"
				>
					<MessagingContainer>
						{messages.map((message) => (
							<div key={message.id}>
							<Message
								message={message}
								isOpen={openMessage === message.id}
								onToggle={() => toggleMessage(message.id)}
							/>

							</div>
						))}
					</MessagingContainer>
				</Dropdown>
			</Container>

			<Dropdown
				ref={likedRef}
				$isClicked={activeDropdown === 'liked'}
				$position="normal"
				$top="0"
				$left="0"
				$transform="none"
				$width="100%"
				$padding="0"
				$boxShadow="none"
				$border="none"
			>
				{renderCarousel(likedBooks, 'Liked Books', likedBooksLoading)}
			</Dropdown>
			{renderCarousel(userBooks, 'Your Listings', loading)}
			{renderCarousel(recommendations, 'Recommended for You', loading)}
		</section>
	)
}

const DashboardHeader = styled.div`
	display: flex;
	flex-direction: column;
`

const Container = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: var(--sm);
	margin-bottom: var(--lg);
	@media only screen and (max-width: 768px) {
		flex-direction: column;
	}
`

const Details = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	border: 1px solid var(--ltGreen);
	padding: var(--lg);
	p {
		display: flex;
		align-items: center;
		&:last-child {
			margin-bottom: 0;
		}
	}
	span {
		color: var(--dkGreen);
		font-weight: bold;
	}
`

const MessagingContainer = styled.div`
	border: 1px solid var(--ltGreen);
	display: flex;
	flex-direction: column;
	gap: var(--sm);
	padding: var(--lg) 0;
	
	overflow: hidden;
	overflow-y: auto;
`

const Controls = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: var(--xs);
	margin: var(--sm) 0 0 0;
	button {
		color: var(--dkGreen);
		font-size: 1.6rem;
		text-align: left;
		padding: 0;
		border-radius: 0;
		background: none;
	}
`

const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-bottom: var(--sm);
	border-bottom: 1px solid var(--ltGreen);
`

const Dropdown = styled.div`
	position: ${({ $position }) => $position};
	top: ${({ $top }) => $top};
	left: ${({ $left }) => $left};
	transform: ${({ $transform }) => $transform};
	width: ${({ $width }) => $width};
	z-index: ${({ $isClicked }) => ($isClicked ? '1000' : '-1')};
	overflow: hidden;
	max-height: ${({ $isClicked }) =>
		$isClicked
			? 'auto'
			: '0'}; /* Set a reasonable max-height for the open state */
	opacity: ${({ $isClicked }) => ($isClicked ? '1' : '0')};
	padding: ${({ $padding }) => $padding};
	box-shadow: ${({ $boxShadow }) => $boxShadow};
	display: flex;
	flex-direction: column;
	margin-top: var(--lg);
	border: ${({ $border }) => $border};
	border-radius: var(--xs);
	background: #fff;
	transition: all 2s ease, opacity 0.3s ease, padding 0.3s ease;
	@media only screen and (max-width: 450px) {
		width: 100%;
		border-radius: 0;
	}
`

const CarouselContainer = styled.div`
	position: relative;
`