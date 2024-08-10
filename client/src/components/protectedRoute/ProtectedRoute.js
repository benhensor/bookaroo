import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children }) => {
	const { isLoading, isAuthenticated } = useAuth()

	// const token = sessionStorage.getItem('authToken')
	

	// useEffect(() => {
	// 	console.log('Token:', token, 'IsAuthenticated:', isAuthenticated)
	// }, [token, isAuthenticated])

	// If still loading, prevent redirect (you can also show a loading spinner here)
	if (isLoading) {
		return <div>Loading...</div> // or return null; if you prefer
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />
	}

	return children
}

export default ProtectedRoute
