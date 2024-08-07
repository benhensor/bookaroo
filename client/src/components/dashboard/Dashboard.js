import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useBooks } from '../../context/BooksContext'
import { useUser } from '../../context/UserContext'
import styled from 'styled-components'
import { categories } from '../../utils/categories'
import Genre from './Genre'
import Carousel from '../carousel/Carousel'
import WordButton from '../buttons/WordButton'
import ActionButton from '../buttons/ActionButton'
import Arrow from '../../icons/Arrow'

export default function Dashboard() {
	const { user, isLoading, updateUserPreferences, updateUserDetails } =
		useAuth()
	const { userBooks, recommendations, loading } = useBooks()
	const { likedBooks, likedBooksLoading } = useUser()
	const [activeDropdown, setActiveDropdown] = useState(false)
	const [selectedPreferences, setSelectedPreferences] = useState([])
	const userDetailsRef = useRef(null)
	const preferencesRef = useRef(null)
	const likedRef = useRef(null)

	const [formValues, setFormValues] = useState({
		username: '',
		email: '',
		phone: '',
		addressLine1: '',
		addressLine2: '',
		city: '',
		postcode: '',
	})

	// console.log('User:', user) // Debugging log

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

	// useEffect(() => {
	// 	console.log('Active dropdown changed:', activeDropdown)
	// }, [activeDropdown])

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (
				userDetailsRef.current &&
				!userDetailsRef.current.contains(e.target) &&
				activeDropdown === 'userDetails'
			) {
				setActiveDropdown(false)
			}
			if (
				preferencesRef.current &&
				!preferencesRef.current.contains(e.target) &&
				activeDropdown === 'preferences'
			) {
				setActiveDropdown(false)
			}
			if (
				likedRef.current &&
				!likedRef.current.contains(e.target) &&
				activeDropdown === 'liked'
			) {
				setActiveDropdown(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () =>
			document.removeEventListener('mousedown', handleClickOutside)
	}, [activeDropdown])

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
			addressLine2,
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
				<Details>
					<h1>Dashboard</h1>
					<Sentence>
						<p>
							Welcome&nbsp;
							<WordButton
								text={` ${user.username}`}
								onClick={() =>
									handleToggleDropdown('userDetails')
								}
							/>
							!
						</p>
						<Arrow isClicked={activeDropdown === 'userDetails'} />
						<Dropdown
							ref={userDetailsRef}
							$isClicked={activeDropdown === 'userDetails'}
							$top="100%"
							$left="0"
							$transform="none"
							$width="fit-content"
						>
							<Header>
								<h3>Update your details...</h3>
								<WordButton
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
								<ActionButton
									type="action"
									text="submit"
									onClick={handleSaveUserDetails}
								>
									Save
								</ActionButton>
							</form>
						</Dropdown>
					</Sentence>
					<Controls>
						<Sentence>
							<p>
								What&nbsp;
								<WordButton
									text="type"
									onClick={
										activeDropdown === 'preferences'
											? handleSavePreferences
											: () =>
													handleToggleDropdown(
														'preferences'
													)
									}
								/>
								&nbsp;of books are you into?
							</p>
							<Arrow
								isClicked={activeDropdown === 'preferences'}
							/>
							<Dropdown
								ref={preferencesRef}
								$isClicked={activeDropdown === 'preferences'}
								$top="40%"
								$left="0"
								$transform="none"
								$width="fit-content"
							>
								<Header>
									<h3>Preferences</h3>
									<WordButton
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
						</Sentence>

						<Sentence>
							<p>
								<WordButton to="/list" text="List" />
								&nbsp;your books here...
							</p>
						</Sentence>
						<Sentence>
							<p>
								Or&nbsp;
								<WordButton to="/browse" text="browse" />
								&nbsp;available books.
							</p>
						</Sentence>

						<Sentence>
							<p>
								See anything you&nbsp;
								<WordButton
									text="like"
									onClick={() =>
										handleToggleDropdown('liked')
									}
								/>
								?
							</p>
							<Arrow isClicked={activeDropdown === 'liked'} />
							<Dropdown
								ref={likedRef}
								$isClicked={activeDropdown === 'liked'}
								$top="40%"
								$left="50%"
								$transform="translateX(-50%)"
								$width="100%"
							>
								{renderCarousel(
									likedBooks,
									'Liked Books',
									likedBooksLoading
								)}
							</Dropdown>
						</Sentence>
					</Controls>
				</Details>
			</Container>

			{renderCarousel(userBooks, 'Your Listings', loading)}
			{renderCarousel(recommendations, 'Recommended for You', loading)}
		</section>
	)
}

const Container = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	margin-bottom: var(--lg);
`

const Details = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	margin-bottom: var(--lg);
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

const Controls = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	margin: var(--lg) 0;
	button {
		color: var(--dkGreen);
		font-size: 1.6rem;
		text-align: left;
		padding: 0;
		border-radius: 0;
		background: none;
	}
`

const Sentence = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: var(--xs);
	position: relative;
`

const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-bottom: var(--sm);
	border-bottom: 1px solid var(--ltGreen);
`

const Dropdown = styled.div`
	position: absolute;
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
	padding: var(--sm);
	box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
	display: flex;
	flex-direction: column;
	margin-top: var(--lg);
	border: 1px solid var(--ltGreen);
	border-radius: var(--xs);
	background: #fff;
	transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
	@media only screen and (max-width: 450px) {
		width: 100%;
		border-radius: 0;
	}
`

const CarouselContainer = styled.div`
	position: relative;
`
