import React, { createContext, useCallback } from 'react'
import { useAuth } from './AuthContext'
import axios from 'axios'
import { useQuery } from 'react-query'

const BooksContext = createContext()

export const BooksProvider = ({ children }) => {
  const { user, isAuthenticated, searchUsers } = useAuth()
  

  // Fetch books and user details
  const fetchBooks = async () => {
    const token = sessionStorage.getItem('authToken')
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/books`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

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
  const { data: books = [], isLoading, error, refetch } = useQuery(
    'books',
    fetchBooks,
    {
      enabled: isAuthenticated, // Only run the query when the user is authenticated
      retry: 3, // Retry failed requests up to 3 times
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
      cacheTime: 1000 * 60 * 10, // Cache data for 10 minutes
    }
  )

  // Derived state for userBooks and recommendations
  const userBooks = books.filter((book) => book.userId === user?.id);

// Recommendations should be empty if no preferences are set
const recommendations = user?.preferences && user.preferences.length > 0 
  ? books.filter(
      (book) =>
        book.userId !== user?.id && // Exclude books listed by the current user
        book.category.some((category) => user.preferences.includes(category))
    )
  : [];

  // Function to search for books
  const searchBooks = useCallback(async (query) => {
		// console.log('Query:', query)
    if (!query.trim()) return // Don't search if the query is empty

    const token = sessionStorage.getItem('authToken')
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/books/search`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { query },
      }
    )

    return data.sort(() => Math.random() - 0.5)
  }, [])

  return (
    <BooksContext.Provider
      value={{
        books,
        userBooks,
        recommendations,
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
