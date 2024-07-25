import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/current_user', { withCredentials: true });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const updateUserPreferences = async (preferences) => {
        try {
            await axios.post(
                'http://localhost:5000/api/update_preferences',
                { preferences },
                { withCredentials: true }
            );
            setUser((prevUser) => ({
                ...prevUser,
                preferences: preferences,
            }));
        } catch (error) {
            console.error('Error updating preferences:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, updateUserPreferences }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
