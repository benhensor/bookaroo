import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useUser } from '../../context/UserContext'
import styled from 'styled-components'
import Genre from './Genre'
import Carousel from '../carousel/Carousel'
import WordButton from '../buttons/WordButton'
import Arrow from '../../icons/Arrow'

export default function Dashboard() {
	const { user, isLoading, updateUserPreferences } = useAuth() // Use loading from AuthContext
	const {
    userListings,
    recommendations,
    userListingsLoading,
    userListingsError,
    recommendationsLoading,
    recommendationsError,
  } = useUser();
	const [dropdownOpen, setDropdownOpen] = useState(false)
	const [selectedPreferences, setSelectedPreferences] = useState([])
	const [isClicked, setIsClicked] = useState(false)

	const categories = [
		'Mystery',
		'Comedy',
		'Romance',
		'Science Fiction',
		'Fantasy',
		'Thriller/Suspense',
		'Historical Fiction',
		'Young Adult',
		'Horror',
		'Fiction',
		'Non-Fiction',
		'Biography & Autobiography',
		'History',
		'Politics'
	]

	useEffect(() => {
		// console.log('User:', user) // Debugging log
		if (user && user.preferences) {
			setSelectedPreferences(user.preferences)
		} else {
			setSelectedPreferences([])
		}
	}, [user])

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
			setDropdownOpen(false)
			setIsClicked(false)
			return
		}

		// console.log('User:', user) // Debugging log
		const currentPreferences = user.preferences || [] // Treat undefined preferences as an empty array

		console.log('Current preferences:', currentPreferences) // Debugging log
		console.log('Selected preferences:', selectedPreferences) // Debugging log

		const preferencesChanged =
			JSON.stringify(selectedPreferences) !==
			JSON.stringify(currentPreferences)

		if (!preferencesChanged) {
			// console.log('Preferences have not changed') // Debugging log
			setDropdownOpen(false)
			setIsClicked(false)
			return
		}

		updateUserPreferences(selectedPreferences)
			.then(() => {
				// console.log('Preferences saved successfully') // Debugging log
				setDropdownOpen(false)
				setIsClicked(false)
			})
			.catch((error) => {
				console.error('Error saving preferences:', error)
			})
	}, [selectedPreferences, updateUserPreferences, user])

	const toggleDropdown = () => {
		setDropdownOpen((prevState) => !prevState)
		setIsClicked((prevState) => !prevState)
	}
	
	const renderCarousel = (items, title, isLoading, isError) => {
		if (isLoading) {
			return <CarouselContainer>Loading...</CarouselContainer>
		}

		if (isError) {
			return <CarouselContainer>Error loading data</CarouselContainer>
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
					<p>Welcome, {user.username}!</p>
					<Controls>
						<Preferences>
							<Sentence>
								<p>
									What&nbsp;
									<WordButton
										text="sort of books"
										onClick={
											dropdownOpen
												? handleSavePreferences
												: toggleDropdown
										}
									/>
									&nbsp;are you into?
								</p>
								<Arrow isClicked={isClicked} />
							</Sentence>

							<Dropdown $isClicked={isClicked}>
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
						</Preferences>

						<p>
							<WordButton to="/list" text="List" />
							&nbsp;your books here...
						</p>
						<p>
							or&nbsp;
							<WordButton to="/browse" text="search" />
							&nbsp;for available books.
						</p>

						<p>
							See anything you&nbsp;
							<WordButton text="like" />
							?
						</p>

					</Controls>
				</Details>
			</Container>
				{renderCarousel(userListings, "Your Listings", userListingsLoading, userListingsError)}
				{renderCarousel(recommendations, "Recommended for You", recommendationsLoading, recommendationsError)}
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
		margin-bottom: var(--xs);

		&:last-child {
			margin-bottom: 0;
		}
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

const Preferences = styled.div`
	position: relative;
`

const Sentence = styled.div`
	display: flex;
	align-items: center;
`

const Dropdown = styled.div`
	position: absolute;
	top: 85%;
	left: 0;
	width: 100%;
	z-index: 1000;
	overflow: hidden;
	max-height: ${({ $isClicked }) =>
		$isClicked
			? '50rem'
			: '0'}; /* Set a reasonable max-height for the open state */
	opacity: ${({ $isClicked }) => ($isClicked ? '1' : '0')};
	padding: ${({ $isClicked }) => ($isClicked ? 'var(--sm)' : '0')};
	box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
	display: flex;
	flex-direction: column;
	margin-top: 10px;
	border: 1px solid #ccc;
	border-radius: var(--xs);
	background: #fff;
	transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
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

const CarouselContainer = styled.div`

`