import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import styled from 'styled-components'
import axios from 'axios'
import ActionButton from '../components/buttons/ActionButton'
import WordButton from '../components/buttons/WordButton'
import { PageHeader } from '../assets/styles/GlobalStyles'


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
		category: '',
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
			category: '',
			condition: '',
			notes: '',
			userId: user?.id || '',
		})
	}, [user])

	const genres = [
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
		'Politics',
	]

	// Reset state on component mount
	useEffect(() => {
		handleReset()
	}, [user, handleReset])

	const handleSearch = async (e) => {
		e.preventDefault()
		try {
			const response = await axios.get(
				`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
					searchTerm
				)}&country=UK`
			)
			setBookResults(response.data.items || [])
			if (!response.data.items || response.data.items.length === 0) {
				setError('No books found. Please try a different search term.')
			} else {
				setError('')
			}
		} catch (error) {
			console.error('Error fetching books:', error)
			setError(
				'An error occurred while searching for books. Please try again later.'
			)
		}
	}

	const ensureHttps = (url) => {
		if (url.startsWith('http:')) {
			return url.replace('http:', 'https:')
		}
		return url
	}

	const handleSelectBook = async (e) => {
		const bookId = e.target.value
		const book = bookResults.find((book) => book.id === bookId)

		if (book) {
			try {
				// Fetch detailed book information using the selfLink
				const detailsResponse = await axios.get(book.selfLink)

				const detailedBook = detailsResponse.data
				const isbnValue =
					detailedBook.volumeInfo.industryIdentifiers?.find(
						(id) => id.type === 'ISBN_13'
					)?.identifier || ''

				setIsbn(isbnValue)
				setBookData({
					isbn: isbnValue || '',
					coverImg: ensureHttps(
						detailedBook.volumeInfo.imageLinks.extraLarge ||
							detailedBook.volumeInfo.imageLinks.large ||
							detailedBook.volumeInfo.imageLinks.medium ||
							detailedBook.volumeInfo.imageLinks.small ||
							detailedBook.volumeInfo.imageLinks.thumbnail ||
							''
					),
					title: detailedBook.volumeInfo.title || '',
					author: detailedBook.volumeInfo.authors?.join(', ') || '',
					publishedDate: detailedBook.volumeInfo.publishedDate || '',
					publisher: detailedBook.volumeInfo.publisher || '',
					category: bookData.category || '',
					condition: '',
					notes: '',
					userId: user?.id || '',
				})
				// console.log('Book data:', detailedBook)
				setError('') // Clear any previous errors
			} catch (error) {
				console.error('Error fetching detailed book info:', error)
				setError('An error occurred while retrieving book details.')
			}
		}
	}

	const handleInputChange = (e) => {
    const { name, value } = e.target;

    setBookData((prevData) => ({
        ...prevData,
        [name]: name === 'category' ? [value] : value, // Store as an array with one element
    }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = sessionStorage.getItem('authToken');
	
		// Validate fields before submission
		const validData = {
			isbn: bookData.isbn || '',
			coverImg: bookData.coverImg || '',
			title: bookData.title || '',
			author: bookData.author || '',
			publishedDate: bookData.publishedDate || '',
			publisher: bookData.publisher || '',
			category: bookData.category.length > 0 ? bookData.category : ['Unknown'], // Ensure it's always an array
			condition: bookData.condition || 'Unknown',
			notes: bookData.notes || '',
			userId: bookData.userId || user?.id || '',
		};
	
		console.log('Book data:', validData);
	
		if (!validData.title) {
			setError('Please select a book from the list.');
			return;
		}
	
		if (!validData.condition || validData.condition === 'none') {
			setError('Please select the book condition.');
			return;
		}
	
		try {
			await axios.post(`${process.env.REACT_APP_API_URL}/api/books/list`, validData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setMessage('Book listed successfully!');
			handleReset();
		} catch (error) {
			console.error('Error submitting book listing:', error);
			setError('An error occurred while submitting your listing. Please try again.');
		}
	};

	return (
		<section>
			<PageHeader>
				<h1>Add Book</h1>
				<WordButton to="/dashboard" text="Return" />
			</PageHeader>

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
							value={
								bookData.title
									? bookResults.find(
											(book) =>
												book.volumeInfo.title ===
												bookData.title
									  )?.id
									: ''
							}
						>
							<option value="">Select a Book</option>
							{bookResults.map((book) => (
								<option key={book.id} value={book.id}>
									{book.volumeInfo.title} -{' '}
									{book.volumeInfo.authors
										? book.volumeInfo.authors.join(', ')
										: 'Unknown Author'}
								</option>
							))}
						</select>
					</label>
					{bookData.title && (
						<>
							<h2>Selected Book</h2>
							{isbn && (
								<>
									{/* {console.log('Selected book:', bookData.coverImg)} */}
									<img
										src={bookData.coverImg}
										alt={bookData.title}
									/>
								</>
							)}
							<p>{bookData.title}</p>
							<p>
								<span>
									{bookData.author || 'Unknown Author'}
								</span>
							</p>

							<label>
                Genre:
                <select
                  name="category"
                  value={bookData.category[0] || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Select Genre</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
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
	)
}

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
