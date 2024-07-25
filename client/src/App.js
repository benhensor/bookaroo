import React from 'react'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/header/Header'
import Login from './components/login/Login'
import CompleteProfile from './components/completeProfile/CompleteProfile'
import Dashboard from './pages/Dashboard'

const ProtectedRoute = ({ children }) => {
	const { user, loading } = useAuth()
  if (loading) {
    return <div>Loading...</div>
  }
	return user ? children : <Navigate to="/login" />
}

function App() {
	return (
		<AuthProvider>
			<div className="App">
				<Header />
				<main>
					<Router>
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route
								path="/complete-profile"
								element={<CompleteProfile />}
							/>
							<Route
								path="/"
								element={
									<ProtectedRoute>
										<Dashboard />
									</ProtectedRoute>
								}
							/>
						</Routes>
					</Router>
				</main>
			</div>
		</AuthProvider>
	)
}

export default App
