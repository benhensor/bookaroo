import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useBooks } from '../context/BooksContext'
import Button from '../components/buttons/Button'
import { PageHeader } from '../assets/styles/GlobalStyles'
import BooksGallery from '../components/books/BooksGallery'
import Carousel from '../components/carousel/Carousel'

export default function Browse() {
	const { searchBooks } = useBooks()
	const [isScrolled, setIsScrolled] = useState(false)
  const [query, setQuery] = useState('')
	const [searchResults, setSearchResults] = useState([])
	const [error, setError] = useState(null)
	const ref = useRef(null)

	const resultsRef = useRef(null)

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setIsScrolled(true)
			} else {
				setIsScrolled(false)
			}
		}
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

 
  // useEffect(() => {
  //   searchBooks(query)
  // }, [query, searchBooks])  

	useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setError(null) // Clear any previous errors
        const results = await searchBooks(query)
        setSearchResults(results)
        if (results.length === 0) {
          setError('No results found. Please try a different search term.')
        }
      } catch (err) {
        console.error('Error fetching search results:', err)
        setError('An error occurred while searching. Please try again later.')
        setSearchResults([])
      }
    }

    if (query.trim()) {
      fetchSearchResults()
    } else {
      setSearchResults([])
      setError(null)
    }
  }, [query, searchBooks])
	
	// console.log(resultsRef.current?.clientHeight)

	const renderSearchContent = () => {
    if (error) {
      return (
				<SearchResults ref={resultsRef}>
					<ErrorMessage>{error}</ErrorMessage>
				</SearchResults>
			)
    }
    if (searchResults.length > 0) {
      return (
        <SearchResults ref={resultsRef}>
          <Carousel title="Search Results" items={searchResults} />
        </SearchResults>
      )
    }
    return null
  }

	return (
		<>
			<Controls ref={ref} $isScrolled={isScrolled}>
				<PageHeader style={{ maxWidth: '100rem' }}>
					<h1>Browse</h1>
					<Button type="word" to="/dashboard" text="Return" />
				</PageHeader>
				<SearchBar>
          <label htmlFor="search-input" className="visually-hidden">
            Search
          </label>
          <SearchInput
            type="search"
            id="search-input"
            placeholder="Search..."
            onChange={event => setQuery(event.target.value)}
            value={query}
          />
        </SearchBar>
				{renderSearchContent()}
			</Controls>
			<section style={{ marginTop: '23rem' }}>
				<Display >
					<BooksGallery />
				</Display>
			</section>
		</>
	)
}

const Controls = styled.div`
	position: fixed;
	top: 5.8rem;
	width: 100%;
	max-height: 100%;
	z-index: 100;
	background-color: var(--white);
	padding: var(--lg) 0;
	box-shadow: ${(props) =>
		props.$isScrolled ? '0 5px 5px rgba(0, 0, 0, 0.1)' : 'none'};
	transition: var(--slow);
	@media only screen and (max-width: 999px) {
		padding: var(--sm) var(--md);
	}
	@media only screen and (max-width: 450px) {
		padding: var(--sm);
	}
`

const SearchBar = styled.div`
	max-width: 100rem;
	width: 100%;
	margin: 0 auto var(--lg) auto;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: var(--xs);
	label {
		display: flex;
		flex-direction: row;
		gap: none;
		width: 100%;
		align-items: center;
		border-radius: none;
	}
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}
`

const SearchInput = styled.input`
	width: 100%;
	padding-right: 2.5rem; /* Adds space for the icon */
	border-radius: none;
`

const SearchResults = styled.div`
	max-width: 100rem;
	margin: 0 auto;
`

const ErrorMessage = styled.div`
  max-width: 100rem;
  margin: 1rem auto;
  padding: var(--sm);
  background-color: var(--creamA);
  color: var(--mdBrown);
  border: 1px solid var(--creamB);
  border-radius: 0.25rem;
  text-align: center;
`

const Display = styled.div`
  transition: max-height 0.5s ease, opacity 0.5s ease;

  overflow: hidden;
`