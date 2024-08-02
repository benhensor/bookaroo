import React from 'react'
import styled from 'styled-components'
import { useBooks } from '../../context/BooksContext'
import Book from './Book'

export default function BooksGallery() {
  const { books } = useBooks()

  // randomise the order of the books
  //books.sort(() => Math.random() - 0.5)

  return (
    <GalleryContainer>
      <Gallery>
        {books.map((book) => (
          <Book key={book.id} book={book} />
        ))}
      </Gallery>
    </GalleryContainer>
  )
}

const GalleryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: var(--lg);
  max-width: 100%;

  @media only screen and (max-width: 450px) {
    grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
  }
`