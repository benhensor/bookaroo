import React, { createContext, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const [likedBooks, setLikedBooks] = useState([]);

  const fetchUserListings = async () => {
    const token = sessionStorage.getItem('authToken');
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/books/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { userId: user.id },
    });
    return response.data;
  };

  const fetchRecommendations = async () => {
    const token = sessionStorage.getItem('authToken');
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/books/recommendations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { userId: user.id, preferences: user.preferences },
    });
    // console.log('Recommendations:', response.data);
    return response.data;
  };

  const fetchLikedBooks = async () => {
    const token = sessionStorage.getItem('authToken');
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/userbooks/liked`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { userId: user.id },
    });
  
    // If the response data is not an array, return an empty array
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.warn('Expected an array but got:', response.data);
      return []; // Return an empty array if no liked books
    }
  };
  

  const likeBook = async (bookId) => {
    const token = sessionStorage.getItem('authToken');
    await axios.post(`${process.env.REACT_APP_API_URL}/api/userbooks/like`, {
      userId: user.id,
      bookId,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setLikedBooks((prev) => [...prev, bookId]);
  }

  const unlikeBook = async (bookId) => {
    const token = sessionStorage.getItem('authToken');
    await axios.post(`${process.env.REACT_APP_API_URL}/api/userbooks/unlike`, {
      userId: user.id,
      bookId,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setLikedBooks((prev) => prev.filter((id) => id !== bookId));
  }

  const {
    data: userListings = [],
    isLoading: userListingsLoading,
    isError: userListingsError,
    refetch: refetchUserListings,
  } = useQuery(['userListings', user?.id], fetchUserListings, {
    enabled: !!user, // Only run query if the user exists
  });

  const {
    data: recommendations = [],
    isLoading: recommendationsLoading,
    isError: recommendationsError,
    refetch: refetchRecommendations,
  } = useQuery(['recommendations', user?.id, user?.preferences], fetchRecommendations, {
    enabled: !!user && user.preferences?.length > 0, // Only run query if the user and preferences exist
  });

  useQuery(['likedBooks', user?.id], fetchLikedBooks, {
    enabled: !!user,
    onSuccess: (data) => {
      if (Array.isArray(data)) {
        setLikedBooks(data.map(book => book.id));
        // console.log('Liked books:', data.map(book => book.id)); // Add this for debugging
      } else {
        console.warn('Expected an array but got:', data);
        setLikedBooks([]); // Fallback to an empty array
      }
    },
  });
  
  

  return (
    <UserContext.Provider
      value={{
        userListings,
        recommendations,
        likedBooks,
        userListingsLoading,
        userListingsError,
        recommendationsLoading,
        recommendationsError,
        likedBooksLoading: false, // No need to keep separate loading states for simplicity
        likedBooksError: false,
        likeBook,
        unlikeBook,
        refetchUserListings,
        refetchRecommendations,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => React.useContext(UserContext);
