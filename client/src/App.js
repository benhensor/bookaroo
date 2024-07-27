import React from 'react'
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import Header from './components/header/Header'
import Home from './pages/Home'
import Listing from './pages/Listing'
import Browse from './pages/Browse'
import Login from './components/login/Login'
import Register from './components/register/Register'
import Dashboard from './components/dashboard/Dashboard'
import ProtectedRoute from './components/protectedRoute/ProtectedRoute'


function App() {
	return (
		<AuthProvider>
			<UserProvider>
				<Router>
					<Header />
					<main>
						<Routes>
							<Route path="/register" element={<Register />} />
							<Route path="/login" element={<Login />} />
							<Route path="/dashboard" element={
								<ProtectedRoute>
									<Dashboard />
								</ProtectedRoute>
							} />
							<Route path="/add-book" element={<Listing />} />
							<Route path="*" element={<Home />}/>
							<Route path="/list" element={<Listing />} />
							<Route path="/browse" element={<Browse />} />
						</Routes>
					</main>
				</Router>
			</UserProvider>
		</AuthProvider>
	)
}

export default App
