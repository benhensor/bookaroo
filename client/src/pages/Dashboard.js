import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import styled from 'styled-components'
import Genre from '../components/dashboard/Genre'

export default function Dashboard() {
	const { user, updateUserPreferences } = useAuth()
	const [dropdownOpen, setDropdownOpen] = useState(false)
	const [selectedPreferences, setSelectedPreferences] = useState(user.preferences || [])

	const {
		firstName,
		lastName,
		email,
		phone,
		addressLine1,
		addressLine2,
		city,
		postcode,
	} = user

  const genres = [
    'Mystery', 'Romance', 'Science Fiction', 'Fantasy', 
    'Thriller/Suspense', 'Historical Fiction', 'Young Adult', 
    'Horror', 'Non-Fiction'
  ]

	useEffect(() => {
		setSelectedPreferences(user.preferences || [])
	}, [user])

  const handleGenreSelect = (genre) => {
    setSelectedPreferences((prevPreferences) => {
      if (prevPreferences.includes(genre)) {
        return prevPreferences.filter((g) => g !== genre)
      } else {
        return [...prevPreferences, genre]
      }
    })
  }

  const handleSavePreferences = useCallback(() => {
    updateUserPreferences(selectedPreferences)
  }, [selectedPreferences, updateUserPreferences])

  useEffect(() => {
    if (!dropdownOpen) {
      handleSavePreferences()
    }
  }, [dropdownOpen, handleSavePreferences])

  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState)
  }


	return (
		<section>
			<Container>
				<h1>Dashboard</h1>
				<UserDetails>
          <p>
            Welcome, {firstName} {lastName}!
          </p>
          <p>Email: {email}</p>
          <p>Phone: {phone}</p>
          <p>
                    Address: {addressLine1}
                    {addressLine2 ? `, ${addressLine2}` : ''}
                    , {city}, {postcode}
                  </p>
        </UserDetails>
				<Preferences>
					<button type="button" onClick={toggleDropdown}>
						{dropdownOpen ? 'Save Preferences' : 'Select Preferences'}
					</button>
					{dropdownOpen && (
						<Dropdown>
              {genres.map((genre) => (
                <Genre
                  key={genre}
                  name={genre}
                  isSelected={selectedPreferences.includes(genre)}
                  onSelect={handleGenreSelect}
                />
              ))} 
						</Dropdown>
					)}
				</Preferences>
			</Container>
			<Controls>
        <button>Edit Details</button>
				<button>List a Book</button>
				<button>Search for Books</button>
			</Controls>
			<div>
				<h2>Your Listings</h2>
			</div>
			<div>
				<h2>Recommended for You</h2>
			</div>
		</section>
	)
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--lg);
  h1 {
    margin-bottom: var(--sm);
  }
`

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--lg);
  p {
    margin-bottom: var(--xs);
  }
`

const Preferences = styled.div`
  position: relative;
  width: 100%;
	display: flex;
	flex-direction: column;
  button {
		background-color: var(--accentGreen);
		color: var(--blkGreen);
    &:hover {
      background-color: var(--accentLtGreen);
    }
	}
`

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;

	display: flex;
	flex-direction: column;
	margin-top: 10px;
	border: 1px solid #ccc;
	border-radius: var(--xs);
	background: #fff;
	label {
		font-size: 1.2rem;
		margin-bottom: var(--xs);
	}
	input {
		padding: var(--xs);
		font-size: 1.2rem;
		border: 1px solid #ccc;
		border-radius: var(--xs);
	}
`

const Controls = styled.div`
  display: flex;
  gap: 2%;
  margin-bottom: var(--lg);
`