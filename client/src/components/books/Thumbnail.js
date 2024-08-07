import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useUser } from '../../context/UserContext'
import { calcDistance } from '../../utils/calculateDistance'
import Heart from '../../icons/Heart'
import ActionButton from '../buttons/ActionButton'

export default function Thumbnail({ book }) {
	const navigate = useNavigate()
	const { user } = useAuth()
	const { deleteListing } = useUser()
	const [isHovered, setIsHovered] = useState(false)
	const [bookOwner, setBookOwner] = useState(null)
	const [distance, setDistance] = useState(null)

	useEffect(() => {
		if (user && book && Array.isArray(book.user) && book.user.length > 0) {
			setBookOwner(book.user[0]) // Safely set bookOwner
		}
	}, [user, book])

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
	// 	console.log('book', book, bookOwner)
	// }, [book, bookOwner])

	const handleClick = (e) => {
		e.stopPropagation()
		deleteListing(book.id)
		// console.log('clicked')
	}

	const handleBookClick = () => {
		navigate('/book', { state: { book, bookOwner } })
	}


	const handleContactClick = (e) => {
		e.stopPropagation()
		navigate('/contact', { state: { book, bookOwner } })

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
						{user.id !== book.userId && <Heart bookId={book.id} onClick={(e) => e.stopPropagation()}/>}
					</BookCover>
					{user.id === book.userId && (
						<Controls $isHovered={isHovered}>
		
							<ActionButton type="delete" text="Delete" onClick={handleClick} />
						</Controls>
					)}
					{user.id !== book.userId && (
						<Controls $isHovered={isHovered}>
							<ActionButton
								type="action"
								text="Contact"
								onClick={handleContactClick}
							/>
						</Controls>
					)}
				</BookCoverContainer>
				<BookDetails id="book-details">
					<h3>{book.title}</h3>
					<p>{book.author}</p>
					{user.id !== book.userId && <p>{distance} miles away</p>}
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
	border-radius: var(--xs);
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
		border-radius: var(--xs);
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
	right: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: var(--sm);
	padding: var(--sm) 1.3rem;
	background-color: var(--white);
	visibility: ${(props) => (props.$isHovered ? 'visible' : 'hidden')};
	transform: translateY(${(props) => (props.$isHovered ? '0' : '100%')});
	transition: var(--fast);
	animation: ${(props) => (props.$isHovered ? slideUpAnimation : 'none')} 0.3s
		ease-out;
`

const BookDetails = styled.div`
	z-index: 10000;
	width: 150px;
	margin-top: var(--sm);
	h3 {
		color: var(--dkGreenA);
		font-size: clamp(1.2rem, 2vw, 1.6rem);
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	p {
		color: var(--ltBrown);
		font-size: clamp(1rem, 2vw, 1.4rem);
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
`
