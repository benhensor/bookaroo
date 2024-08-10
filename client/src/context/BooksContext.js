import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react'
import { useAuth } from './AuthContext'
import axios from 'axios'
import { useQuery } from 'react-query'

const BooksContext = createContext()

export const BooksProvider = ({ children }) => {
	const { user, isAuthenticated, searchUsers } = useAuth()
	const [currentBook, setCurrentBook] = useState([])

	// Fetch books and user details
	const fetchBooks = async () => {
		const token = sessionStorage.getItem('authToken')
		const { data } = await axios.get(
			`${process.env.REACT_APP_API_URL}/api/books`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)

		// Fetch user details for each book in parallel
		const booksWithUserDetails = await Promise.all(
			data.map(async (book) => {
				const userDetail = await searchUsers(book.userId)
				return { ...book, user: userDetail }
			})
		)

		return booksWithUserDetails.sort(() => Math.random() - 0.5)
	}

	// Use `useQuery` to manage the books fetching
	const {
		data: books = [],
		isLoading,
		error,
		refetch,
	} = useQuery('books', fetchBooks, {
		enabled: isAuthenticated, // Only run the query when the user is authenticated
		retry: 3, // Retry failed requests up to 3 times
		staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
		cacheTime: 1000 * 60 * 10, // Cache data for 10 minutes
	})

	// Derived state for userBooks and recommendations using useMemo
	const userBooks = useMemo(
		() => books.filter((book) => book.userId === user?.id),
		[books, user?.id]
	)

	const recommendations = useMemo(
		() =>
			user?.preferences && user.preferences.length > 0
				? books.filter(
						(book) =>
							book.userId !== user?.id &&
							book.category.some((category) =>
								user.preferences.includes(category)
							)
				  )
				: [],
		[books, user?.id, user?.preferences]
	)




	// Function to set the currently selected book in state
	
	const selectCurrentBook = useCallback((book) => {
		//console.log('book', book)
		setCurrentBook(book)
	}, [])

	const clearCurrentBook = useCallback(() => {
		setCurrentBook(null)
	}, [])

	// useEffect(() => {
	// 	console.log('book', currentBook)
	// }, [currentBook])



	// Function to search for books
	// const searchBooks = useCallback(async (query) => {
	// 	// console.log('Query:', query)
	//   if (!query.trim()) return // Don't search if the query is empty

	//   const token = sessionStorage.getItem('authToken')
	//   const { data } = await axios.get(
	//     `${process.env.REACT_APP_API_URL}/api/books/search`,
	//     {
	//       headers: {
	//         Authorization: `Bearer ${token}`,
	//       },
	//       params: { query },
	//     }
	//   )

	//   return data.sort(() => Math.random() - 0.5)
	// }, [])

	// Function to search for books locally
	const searchBooks = useCallback(
		(query) => {
			if (!query.trim()) return []

			const lowercaseQuery = query.toLowerCase()
			return books.filter(
				(book) =>
					book.title.toLowerCase().includes(lowercaseQuery) ||
					book.author.toLowerCase().includes(lowercaseQuery) ||
					book.category.some((cat) =>
						cat.toLowerCase().includes(lowercaseQuery)
					)
			)
		},
		[books]
	)

	return (
		<BooksContext.Provider
			value={{
				books,
				userBooks,
				recommendations,
				currentBook,
				selectCurrentBook,
				clearCurrentBook,
				searchBooks,
				refetchBooks: refetch, // Use `refetch` to manually refetch books
				loading: isLoading,
				error,
			}}
		>
			{children}
		</BooksContext.Provider>
	)
}

export const useBooks = () => React.useContext(BooksContext)
