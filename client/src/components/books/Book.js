import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useAuth } from '../../context/AuthContext'
import { calcDistance } from '../../utils/calculateDistance'
import Heart from '../../icons/Heart'
import ActionButton from '../buttons/ActionButton'

export default function Book({ book }) {
	const { user } = useAuth()
	console.log(book)
	const [isHovered, setIsHovered] = useState(false)

  // const userLat = user.latitude
  // const userLon = user.longitude
  // const listingLat = book.Users[0].latitude
  // const listingLon = book.Users[0].longitude

  // const distance = calcDistance(userLat, userLon, listingLat, listingLon)

	return (
		<BookContainer
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<BookCoverContainer>
				<BookCover>
					<img src={book.coverImg} alt={book.title} />
					{user.id !== book.userId && <Heart bookId={book.id} />}
				</BookCover>
					{user.id !== book.userId && 
          <Controls $isHovered={isHovered}>
						<ActionButton text="Contact" />
						<ActionButton text="Add to Liked" />
					</Controls>}
			</BookCoverContainer>
			<BookDetails id="book-details">
				<h3>{book.title}</h3>
				<p>{book.author}</p>
			</BookDetails>
		</BookContainer>
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
	width: 156px;
	max-height: 240px;
	img {
		aspect-ratio: auto 156 / 240;
		max-width: 100%;
		min-height: 240px;
		width: auto;
		height: auto;
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
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
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
	padding: var(--sm);
	background-color: var(--white);
	visibility: ${(props) => (props.$isHovered ? 'visible' : 'hidden')};
	opacity: ${(props) => (props.$isHovered ? 1 : 0)};
	transform: translateY(${(props) => (props.$isHovered ? '0' : '100%')});
	transition: var(--fast);
	animation: ${(props) => (props.$isHovered ? slideUpAnimation : 'none')} 0.3s
		ease-out;
`

const BookDetails = styled.div`
	z-index: 10000;
	width: 156px;
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
