import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBooks } from '../context/BooksContext'
import { useUser } from '../context/UserContext'
import axios from 'axios'
import Button from '../components/buttons/Button'
import { useWindowWidth } from '../utils/useWindowWidth'
import { PageHeader } from '../assets/styles/GlobalStyles'

export default function Book() {
	const navigate = useNavigate()
	const { user } = useAuth()
	const { currentBook, clearCurrentBook } = useBooks()
	const { deleteListing } = useUser()
	const [bookDescription, setBookDescription] = useState(null)
	const windowSize = useWindowWidth()

	const book = currentBook?.[0]
	const bookOwner = currentBook?.[1]

	useEffect(() => {
		if (!book || !bookOwner) {
			
		}
	}, [book, bookOwner])

	useEffect(() => {
		if (book?.isbn) {
			const fetchDescription = async () => {
				try {
					const { data } = await axios.get(
						`https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}`
					)
					const description = data.items?.[0]?.volumeInfo?.description || null
					setBookDescription(description)
				} catch (error) {
					console.error('Error fetching book description:', error)
				}
			}
			fetchDescription()
		}
	}, [book])

	const handleBackClick = () => {
		clearCurrentBook()
		navigate(-1)
	}

	const handleContactClick = () => navigate('/contact')

	const handleDeleteClick = () => {
		deleteListing(book.id)
		navigate('/dashboard')
	}

	if (!book || !bookOwner) return null

	return (
		<section>
			<PageHeader style={{ margin: 'var(--lg) 0' }}>
				<Button type="word" text="Back" onClick={handleBackClick} />
			</PageHeader>
			<Row>
				<Category>
					This item can be found in {book.category.join(' | ')}
				</Category>
			</Row>
			<Row>
				<BookDetailsContainer>
					<BookPreview>
						<BookCover src={book.coverImg} alt={book.title} />
					</BookPreview>
					<BookInfoContainer>
						<div>
							<Title>{book.title}</Title>
							<Subtitle><span>{book.author}</span> (author)</Subtitle>
							<BookInfo>
								<p>{book.isbn}</p>
								<p>Published: {new Date(book.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
								<p>{book.publisher}</p>
							</BookInfo>
						</div>
						{user.id !== book.userId ? (
							<OwnersNotes>
								<h3>{bookOwner.username}'s Notes</h3>
								<p>This copy is in <span>{book.condition}</span> condition.</p>
								<blockquote>"{book.notes}"</blockquote>
								<ButtonContainer>
									<Button type="action" text={`Contact ${bookOwner.username}`} onClick={handleDeleteClick} />
								</ButtonContainer>
							</OwnersNotes>
						) : (
							<OwnersNotes>
							<h3>Your Notes</h3>
							<p>This copy is in <span>{book.condition}</span> condition.</p>
							<blockquote>"{book.notes}"</blockquote>
							<ButtonContainer>
								<Button type="delete" text="Delete this listing" onClick={handleContactClick} />
							</ButtonContainer>
						</OwnersNotes>
						)}
					</BookInfoContainer>
				</BookDetailsContainer>
			</Row>
			<Row>
				<BookDescription>
					<h3>Blurb</h3>
					<p>{bookDescription || 'No description available.'}</p>
				</BookDescription>
			</Row>
			{windowSize <= 450 && (
				<Row>
					<Button type="word" text="Return" onClick={handleBackClick} />
				</Row>
			)}
		</section>
	)
}

// Styled components
const Title = styled.h1`
	font-size: clamp(2rem, 3vw, 3.2rem);
	color: var(--dkGreen);
`

const Subtitle = styled.p`
	font-family: 'Roboto', sans-serif;
	font-size: clamp(1.6rem, 2vw, 2rem);
	span {
		font-weight: 700;
		color: var(--mdBrown);
	}
`

const Row = styled.div`
	display: flex;
	width: 100%;
`

const BookDetailsContainer = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: var(--lg);
	width: 100%;

	@media only screen and (max-width: 768px) {
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: var(--lg);
	}
`

const BookInfoContainer = styled.div`
	width: 50%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: var(--xs);
	font-size: 1.4rem;

	@media only screen and (max-width: 768px) {
		width: 100%;
	}
`

const BookInfo = styled.div`
	font-family: 'Roboto', sans-serif;
	color: var(--bgGreenB);
`

const Category = styled.div`
	font-size: 1.2rem;
	margin-bottom: var(--sm);
	font-family: 'Roboto', sans-serif;
	color: var(--dkGreenA);

	.divide {
		color: var(--ltBrown);
	}
`

const BookPreview = styled.div`
	width: 50%;
	display: flex;
	justify-content: center;
	align-items: center;

	@media only screen and (max-width: 768px) {
		width: 100%;
	}
`

const BookCover = styled.img`
	display: flex;
	justify-content: center;
	align-items: center;
	border: 1px solid var(--ltGreen);
	max-width: 260px;
`

const BookDescription = styled.div`
	margin-bottom: var(--xl);
	border: 1px solid var(--ltGreen);
	padding: var(--lg);
	width: 100%;

	h3 {
		font-size: clamp(1.6rem, 2vw, 2rem);
		color: var(--mdBrown);
		margin-bottom: var(--lg);
	}

	p {
		font-size: clamp(1.2rem, 2vw, 1.4rem);
	}
`

const OwnersNotes = styled.div`
	display: flex;
	flex-direction: column;
	border: 1px solid var(--ltGreen);
	padding: var(--lg);

	h3 {
		font-size: clamp(1.6rem, 2vw, 2rem);
		color: var(--mdBrown);
		margin-bottom: var(--lg);
	}

	span {
		color: var(--dkGreen);
	}

	blockquote {
		font-style: italic;
	}
`

const ButtonContainer = styled.div`
	margin-top: var(--md);
`
