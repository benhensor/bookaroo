import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'


export const fetchUser = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/current_user`, { withCredentials: true })
        return response.data
    } catch (error) {
        console.error('Error fetching user:', error)
    }
}


export const updateUserPreferences = async (preferences) => {
    try {
        await axios.post(
            `${API_BASE_URL}/api/update_preferences`,
            { preferences },
            { withCredentials: true }
        )
    } catch (error) {
        console.error('Error updating preferences:', error)
        throw error
    }
}