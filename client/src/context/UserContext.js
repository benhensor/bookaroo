import React, { createContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useBooks } from './BooksContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const { refetchBooks } = useBooks();
  const queryClient = useQueryClient();

  // create a listing
  const createListing = async (listingData) => {
    const token = sessionStorage.getItem('authToken');
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/books/list`, listingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { success: true, message: 'Book listed successfully!' };
    } catch (error) {
      console.error('Error submitting book listing:', error);
      return { success: false, message: 'An error occurred while submitting your listing. Please try again.' };
    }
  };

  // delete a listing
  const deleteListing = async (bookId) => {
    const token = sessionStorage.getItem('authToken');
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/books/delete/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { bookId },
      });
      await refetchBooks(); // Refetch the books data after
      return { success: true, message: 'Book deleted successfully!' };
    } catch (error) {
      console.error('Error deleting book listing:', error);
      return { success: false, message: 'An error occurred while deleting the book. Please try again.' };
    }
  };

  const fetchLikedBooks = async () => {
    if (!user) {
      // console.log('No user, returning empty array');
      return [];
    }
    const token = sessionStorage.getItem('authToken');
    // console.log('Fetching liked books for user:', user.id);  // Add this line
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/userbooks/liked`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { userId: user.id },
    });
    // console.log('Fetched liked books:', response.data);  // Add this line
    return response.data;
  };

  const { data: likedBooks, isLoading: likedBooksLoading, isError: likedBooksError, refetch: refetchLikedBooks } = useQuery(
    ['likedBooks', user?.id],
    fetchLikedBooks,
    {
      enabled: !!user, // Ensures the query only runs if a user is logged in
      onSuccess: (data) => {
        // console.log('Successfully fetched liked books:', data);  // Log success
      },
      onError: (error) => {
        // console.error('Error fetching liked books:', error);  // Log any errors
      },
    }
  );
  

  const likeMutation = useMutation(
    async ({ userId, bookId }) => {
      const token = sessionStorage.getItem('authToken');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/userbooks/like`, 
        { userId, bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['likedBooks', user?.id]);
      },
    }
  );

  const unlikeMutation = useMutation(
    async ({ userId, bookId }) => {
      const token = sessionStorage.getItem('authToken');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/userbooks/unlike`, 
        { userId, bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    {
      onSuccess: (data, variables) => {
        const { bookId } = variables;

        // Directly update the likedBooks query data by filtering out the unliked book
        queryClient.setQueryData(['likedBooks', user?.id], (oldData) => 
          oldData ? oldData.filter((book) => book.id !== bookId) : []
        );
      },
    }
  );

  const likeBook = (userId, bookId) => likeMutation.mutate({ userId, bookId });
  const unlikeBook = (userId, bookId) => unlikeMutation.mutate({ userId, bookId });

  useEffect(() => {
    if (user) {
      refetchLikedBooks();
    }
  }, [user, refetchLikedBooks]);

  return (
    <UserContext.Provider
      value={{
        likedBooks,
        likedBooksLoading,
        likedBooksError,
        createListing,
        deleteListing,
        likeBook,
        unlikeBook,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => React.useContext(UserContext);
