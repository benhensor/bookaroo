import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useBooks } from '../context/BooksContext'
import WordButton from '../components/buttons/WordButton'
import { PageHeader } from '../assets/styles/GlobalStyles'
import BooksGallery from '../components/books/BooksGallery'

export default function Browse() {
	const { books, searchBooks } = useBooks()
	const [isScrolled, setIsScrolled] = useState(false)
  const [query, setQuery] = useState('')

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

 
  useEffect(() => {
    searchBooks(query)
  }, [query, searchBooks])  
	
	// console.log(books)
	return (
		<>
			<Controls $isScrolled={isScrolled}>
				<PageHeader style={{ maxWidth: '100rem' }}>
					<h1>Browse</h1>
					<WordButton to="/dashboard" text="Return" />
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
			</Controls>
			<section style={{ marginTop: '23rem' }}>
				<Display>
					<BooksGallery books={books} />
				</Display>
			</section>
		</>
	)
}

const Controls = styled.div`
	position: fixed;
	top: 5.8rem;
	width: 100%;
	height: 12rem;
	z-index: 100;
	background-color: var(--white);
	padding: var(--lg) 0;

	box-shadow: ${(props) =>
		props.$isScrolled ? '0 5px 5px rgba(0, 0, 0, 0.1)' : 'none'};
	transition: var(--medium);
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

const Display = styled.div``
