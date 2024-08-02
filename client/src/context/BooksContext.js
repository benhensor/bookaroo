import React, { createContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

const BooksContext = createContext()

export const BooksProvider = ({ children }) => {
	const { user } = useAuth()
	const [books, setBooks] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		fetchBooks()
  }, []) 

	const fetchBooks = async () => {
		setLoading(true)
		setError(null)
		try {
			const token = sessionStorage.getItem('authToken')
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/api/books`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			setBooks(response.data.sort(() => Math.random() - 0.5))
		} catch (err) {
			setError('Failed to fetch books')
		} finally {
			setLoading(false)
		}
	}

	const searchBooks = useCallback(async (query) => {
		setLoading(true)
		setError(null)
    if (!query.trim()) {
      return; // Don't search if the query is empty
    }
		try {
			const token = sessionStorage.getItem('authToken')
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/api/books/search`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
					params: { query },
				}
			)
			setBooks(response.data.sort(() => Math.random() - 0.5))
		} catch (err) {
			setError('Failed to search books')
		} finally {
			setLoading(false)
		}
	}, [])

	return (
		<BooksContext.Provider
			value={{ books, setBooks, searchBooks, fetchBooks, loading, error }}
		>
			{children}
		</BooksContext.Provider>
	)
}

export const useBooks = () => React.useContext(BooksContext)
