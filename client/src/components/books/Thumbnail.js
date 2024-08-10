import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useUser } from '../../context/UserContext'
import { useBooks } from '../../context/BooksContext'
import { calcDistance } from '../../utils/calculateDistance'
import Heart from '../../icons/Heart'
import Button from '../buttons/Button'

export default function Thumbnail({ book }) {
	const navigate = useNavigate()
	const { user, searchUsers } = useAuth()
	const { deleteListing } = useUser()
	const { selectCurrentBook } = useBooks()
	const [isHovered, setIsHovered] = useState(false)
	const [bookOwner, setBookOwner] = useState(null)
	const [distance, setDistance] = useState(null)

	const currentBook = [book, bookOwner]
	//console.log('currentBook', currentBook)

	useEffect(() => {
		const bookOwnerId = book.userId
		const getOwnerOfBook = async () => {
			try {
				const ownerData = await searchUsers(bookOwnerId)
				if (ownerData) {
					// console.log('response', ownerData[0]);
					setBookOwner(ownerData[0])
				} else {
					console.log('No owner data found')
				}
			} catch (error) {
				console.error('Error getting book owner:', error)
			}
		}
		if (bookOwnerId) {
			getOwnerOfBook()
		}
	}, [book.userId, searchUsers])

	// useEffect(() => {
	// 	if (user && book && Array.isArray(book.user) && book.user.length > 0) {
	// 		setBookOwner(book.user[0]) // Safely set bookOwner
	// 	}
	// }, [user, book])

	useEffect(() => {
		if (bookOwner) {
			const userLat = user?.latitude
			const userLon = user?.longitude
			const listingLat = bookOwner?.latitude
			const listingLon = bookOwner?.longitude
			setDistance(calcDistance(userLat, userLon, listingLat, listingLon))
		}
	}, [bookOwner, user])

	// useEffect(() => {
	// 	console.log('distance', book, bookOwner, distance)
	// }, [book, bookOwner, distance])

	const handleClick = (e) => {
		e.stopPropagation()
		deleteListing(book.id)
		// console.log('clicked')
	}

	const handleBookClick = () => {
		// console.log('clicked')
		const currentBook = [book, bookOwner]
		selectCurrentBook(currentBook)
		navigate(`/book`)
	}

	const handleContactClick = (e) => {
		e.stopPropagation()
		selectCurrentBook(currentBook)
	}

	return (
		<>
			<BookContainer
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				onClick={handleBookClick}
			>
				<BookCoverContainer>
					<BookCover>
						<img src={book.coverImg} alt={book.title} />
						{user.id !== book.userId && (
							<Heart
								bookId={book.id}
								onClick={(e) => e.stopPropagation()}
							/>
						)}
					</BookCover>
					{user.id === book.userId && (
						<Controls $isHovered={isHovered}>
							<Button
								type="thumbnail"
								text="Delete"
								onClick={handleClick}
								width="150px"
							/>
						</Controls>
					)}
					{user.id !== book.userId && (
						<Controls $isHovered={isHovered}>
							<ButtonContainer>
								<Button
									type="thumbnail"
									to="/contact"
									text="Contact"
									onClick={handleContactClick}
								/>
							</ButtonContainer>
						</Controls>
					)}
				</BookCoverContainer>
				<BookDetails id="book-details">
					<h3>{book.title}</h3>
					<p>{book.author}</p>
					{user.id !== book.userId && (
						<p>
							<span>{distance}</span>&nbsp;miles away
						</p>
					)}
				</BookDetails>
			</BookContainer>
		</>
	)
}

const BookContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
`

const BookCover = styled.div`
	height: calc(100% - 5rem);
	overflow: hidden;
	position: relative;
	width: 150px;
	max-height: 240px;
	img {
		aspect-ratio: auto 150 / 240;
		max-width: 100%;
		min-height: 240px;
		object-fit: cover;
		object-position: top;
	}
	@media only screen and (max-width: 450px) {
		width: 130px;
		max-height: 210px;
		img {
			min-height: 210px;
		}
	}
`

const BookCoverContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	overflow: hidden;
`

const slideUpAnimation = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`

const Controls = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: var(--sm);
	padding: var(--sm) 1.3rem;
	background-color: var(--white);
	visibility: ${(props) => (props.$isHovered ? 'visible' : 'hidden')};
	transform: translateY(${(props) => (props.$isHovered ? '0' : '100%')});
	transition: var(--fast);
	animation: ${(props) => (props.$isHovered ? slideUpAnimation : 'none')} 0.3s
		ease-out;
`

const ButtonContainer = styled.div`
	max-width: 150px;
	display: flex;
	justify-content: center;
`

const BookDetails = styled.div`
	z-index: 10000;
	width: 150px;
	margin-top: var(--sm);
	h3 {
		color: var(--dkGreenA);
		font-size: clamp(1.2rem, 2vw, 1.4rem);
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	p {
		color: var(--ltBrown);
		font-size: clamp(1rem, 2vw, 1.2rem);
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	span {
		color: var(--dkGreen);
	}
	@media only screen and (max-width: 450px) {
		width: 130px;
	}
`
