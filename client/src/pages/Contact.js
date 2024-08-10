import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBooks } from '../context/BooksContext'
import styled from 'styled-components'
import ExchangePreview from '../components/books/ExchangePreview'
import { PageHeader, Content } from '../assets/styles/GlobalStyles'
import Button from '../components/buttons/Button'
import axios from 'axios'

export default function Contact() {
	const navigate = useNavigate()
	const { user } = useAuth()
	const { currentBook, clearCurrentBook } = useBooks()
	const [message, setMessage] = useState('')
	const book = currentBook[0]
	const bookOwner = currentBook[1]

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const token = sessionStorage.getItem('authToken')
			await axios.post(
				`${process.env.REACT_APP_API_URL}/api/messages/send`,
				{
					senderId: user.id,
					recipientId: book.userId,
					bookId: book.id,
					message: message,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			// Redirect to the dashboard or a confirmation page
			navigate('/dashboard')
		} catch (error) {
			console.error('Error sending message:', error)
			// Handle the error, perhaps show an error message
		}
	}

	return (
		<section>
			<PageHeader>
				<h1>Contact</h1>
				<Button
					type="word"
					to="/dashboard"
					text="Return"
					onClick={() => clearCurrentBook(null)}
				/>
			</PageHeader>

			<Content>
				<Layout>
					<ExchangePreview book={book} bookOwner={bookOwner} />
					<ContactFormContainer onSubmit={handleSubmit}>
						<FormHeader>New Message</FormHeader>
						<ContactForm>
							<FormField>
								<label>To:</label>
								<input
									type="text"
									value={bookOwner.username}
									readOnly
								/>
							</FormField>
							<FormField>
								<input
									type="text"
									value={`${book.title} by ${book.author}`}
									readOnly
								/>
							</FormField>
							<MessageArea
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								placeholder="Hi! I'm interested in your book..."
							/>
							<Button type="action" text="Send" onClick={handleSubmit}/>
						</ContactForm>
					</ContactFormContainer>
				</Layout>
			</Content>
		</section>
	)
}

const Layout = styled.div`
	margin-top: var(--lg);
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 10%;
	@media only screen and (max-width: 768px) {
		flex-direction: column;
		align-items: center;
		gap: var(--lg);
	}
`

const ContactFormContainer = styled.div`
	width: 100%;
	height: 100%;
`

const ContactForm = styled.div`
	border: 1px solid var(--ltGreen);
	padding: 0 var(--lg) var(--lg) var(--lg);
`

const FormHeader = styled.div`
	font-weight: bold;
	background-color: var(--ltGreen);
	padding: var(--sm) var(--lg);
`

const FormField = styled.div`
	display: flex;
	align-items: center;
	border-bottom: 1px solid var(--ltGreen);

	label {
		width: var(--lg);
		font-weight: bold;
	}

	input {
		flex: 1;
		border: none;
		outline: none;
	}
`

const MessageArea = styled.textarea`
	width: 100%;
	height: 200px;
	padding: var(--sm) 0;
	border: none;
	outline: none;
	resize: none;
	font-family: inherit;
	border-bottom: 1px solid var(--ltGreen);
	margin-bottom: var(--md);
`
