import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import styled from 'styled-components'
import axios from 'axios'
import ActionButton from '../components/buttons/ActionButton'
import WordButton from '../components/buttons/WordButton'

export default function Listing() {
	const { user } = useAuth()
	const [searchTerm, setSearchTerm] = useState('')
	const [bookResults, setBookResults] = useState([])
	const [isbn, setIsbn] = useState('')
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')

	const [bookData, setBookData] = useState({
		isbn: '',
		coverImg: '',
		title: '',
		author: '',
		publishedDate: '',
		publisher: '',
		genre: '',
		condition: '',
		notes: '',
		userId: user?.id || '',
	})

	const handleReset = useCallback(() => {
		setSearchTerm('')
		setBookResults([])
		setIsbn('')
		setMessage('')
		setError('')
		setBookData({
			isbn: '',
			coverImg: '',
			title: '',
			author: '',
			publishedDate: '',
			publisher: '',
			genre: '',
			condition: '',
			notes: '',
			userId: user?.id || '',
		})
	}, [user]);

	// Reset state on component mount
	useEffect(() => {
		handleReset();
	}, [user, handleReset]);

	const handleSearch = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.get(
				`https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}`
			);
			setBookResults(response.data.docs || []);
			if (!response.data.docs || response.data.docs.length === 0) {
				setError('No books found. Please try a different search term.');
			} else {
				setError('');
			}
		} catch (error) {
			console.error('Error fetching books:', error);
			setError(
				'An error occurred while searching for books. Please try again later.'
			);
		}
	};

	const handleSelectBook = (e) => {
		const bookKey = e.target.value;
		const book = bookResults.find((book) => book.key === bookKey);
		if (book) {
			const isbnValue = book.isbn ? book.isbn[0] : '';
			setIsbn(isbnValue);
			setBookData({
				isbn: isbnValue || '',
				coverImg: `https://covers.openlibrary.org/b/isbn/${isbnValue}-L.jpg` || '',
				title: book.title || '',
				author: book.author_name?.join(', ') || '',
				publishedDate: book.first_publish_year || '',
				publisher: book.publisher?.[0] || '',
				genre: book.subject?.[0] || '',
				condition: '',
				notes: '',
				userId: user?.id || '',
			});
			setError(''); // Clear any previous errors
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setBookData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = sessionStorage.getItem('authToken');

		if (!bookData.title) {
			setError('Please select a book from the list.');
			return;
		}

		if (!bookData.condition || bookData.condition === 'none') {
			setError('Please select the book condition.');
			return;
		}

		try {
			await axios.post(`${process.env.REACT_APP_API_URL}/api/books/list`, bookData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setMessage('Book listed successfully!');
			handleReset();
		} catch (error) {
			console.error('Error submitting book listing:', error);
			setError(
				'An error occurred while submitting your listing. Please try again.'
			);
		}
	};

	return (
		<section>
			<ListingHeader>
				<h1>Add Book</h1>
				<WordButton to="/dashboard" text="Return" />
			</ListingHeader>

			<form onSubmit={handleSearch}>
				<label>
					Search Book:
					<input
						type="text"
						value={searchTerm}
						placeholder="Search by title, author, or ISBN"
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<ActionButton text="Search" />
				</label>
				{error && <ErrorMessage>{error}</ErrorMessage>}
				{message && <SuccessMessage>{message}</SuccessMessage>}
			</form>

			{bookResults.length > 0 && (
				<form onSubmit={handleSubmit}>
					<label>
						Select a Book:
						<select
							onChange={handleSelectBook}
							value={bookData.title ? bookResults.find((book) => book.title === bookData.title)?.key : ''}
						>
							<option value="">Select a Book</option>
							{bookResults.map((book) => (
								<option key={book.key} value={book.key}>
									{book.title} - {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}
								</option>
							))}
						</select>
					</label>
					{bookData.title && (
						<>
							<h2>Selected Book</h2>
							{isbn && (
								<img
									src={`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`}
									alt={bookData.title}
								/>
							)}
							<p>{bookData.title}</p>
							<p><span>{bookData.author || 'Unknown Author'}</span></p>
							<label>
								Genre:
								<select
									name="genre"
									value={bookData.genre}
									onChange={handleInputChange}
								>
									<option value="none" defaultValue>
										Select Genre
									</option>
									<option value="Mystery">Mystery</option>
									<option value="Comedy">Comedy</option>
									<option value="Romance">Romance</option>
									<option value="Science Fiction">Science Fiction</option>
									<option value="Fantasy">Fantasy</option>
									<option value="Thriller/Suspense">Thriller/Suspense</option>
									<option value="Historical Fiction">Historical Fiction</option>
									<option value="Young Adult">Young Adult</option>
									<option value="Horror">Horror</option>
									<option value="Fiction">Fiction</option>
									<option value="Non-fiction">Non-fiction</option>
								</select>
							</label>
							<label>
								Condition:
								<select
									name="condition"
									value={bookData.condition}
									onChange={handleInputChange}
								>
									<option value="none" defaultValue>
										Select Condition
									</option>
									<option value="As New">As New</option>
									<option value="Good">Good</option>
									<option value="Fair">Fair</option>
									<option value="Poor">Poor</option>
								</select>
							</label>
							<label>
								Notes:
								<textarea
									name="notes"
									value={bookData.notes}
									onChange={handleInputChange}
								/>
							</label>
							<ActionButton text="Submit" type="submit" />
						</>
					)}
				</form>
			)}
		</section>
	);
}

const ListingHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	max-width: 40rem;
	margin: 0 auto;
`

const ErrorMessage = styled.p`
	color: red;
	font-weight: bold;
	margin-top: 10px;
`

const SuccessMessage = styled.p`
	color: green;
	font-weight: bold;
	margin-top: 10px;
`
