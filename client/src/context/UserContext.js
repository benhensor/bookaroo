import React, { createContext, useState, useCallback, useMemo } from 'react'
import axios from 'axios'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const getCurrentUser = useCallback(async () => {
    const token = sessionStorage.getItem('token')
    if (!token) return

    setLoading(true)
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/current`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUser(res.data)
    } catch (error) {
      console.error('Error fetching user data:', error)
      sessionStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUserDetails = async (updatedUser) => {
    const token = sessionStorage.getItem('token')
    if (!token) return

    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/users/update`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUser(res.data)
    } catch (error) {
      console.error('Error updating user data:', error)
    }
  }

  const updateUserPreferences = async (preferences) => {
    
    const token = sessionStorage.getItem('token');
    if (!token) return;
    // console.log('Updating preferences:', preferences, token)
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/preferences`,
        { preferences },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      // console.log('trying...', user)
      setUser((prevUser) => ({
        ...prevUser,
        preferences: preferences,
      }));
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error
    }
  };

  const contextValue = useMemo(() => ({
    user,
    loading,
    getCurrentUser,
    updateUserDetails,
    updateUserPreferences,
  }), [user, loading, getCurrentUser])

  return <UserContext.Provider value={contextValue}>
    {children}
  </UserContext.Provider>
}

export const useUser = () => React.useContext(UserContext)