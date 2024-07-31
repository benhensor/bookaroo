import React from 'react'
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider } from './context/AuthContext'
import Header from './components/header/Header'
import Home from './pages/Home'
import Listing from './pages/Listing'
import Browse from './pages/Browse'
import Login from './components/login/Login'
import Register from './components/register/Register'
import Dashboard from './components/dashboard/Dashboard'
import ProtectedRoute from './components/protectedRoute/ProtectedRoute'

const queryClient = new QueryClient()

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
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
							<Route path="/list" element={
								<ProtectedRoute>
									<Listing />
								</ProtectedRoute>
							} />
							<Route path="/browse" element={
								<ProtectedRoute>
									<Browse />
								</ProtectedRoute>
							} />
							<Route path="*" element={<Home />}/>
						</Routes>
					</main>
				</Router>
			</AuthProvider>
		</QueryClientProvider>
	)
}

export default App
