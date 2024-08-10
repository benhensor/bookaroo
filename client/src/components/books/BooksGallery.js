import React from 'react'
import styled from 'styled-components'
import { useAuth } from '../../context/AuthContext'
import { useBooks } from '../../context/BooksContext'
import Carousel from '../carousel/Carousel'

export default function BooksGallery() {
  
  const { user } = useAuth()
  const { books } = useBooks()

  // console.log(books)

  // Remove users listings from books array
  const booksFiltered = books.filter((book) => book.userId !== user.id)

  // Get unique categories from the books array
  const getUniqueCategories = (booksFiltered) => {
    const categories = new Set()
    booksFiltered.forEach((book) => {
      if (Array.isArray(book.category)) {
        book.category.forEach((cat) => categories.add(cat))
      } else {
        categories.add(book.category)
      }
    })
    return Array.from(categories)
  }

  // Filter books by category
  const getBooksByCategory = (category) => {
    return booksFiltered.filter((book) =>
      Array.isArray(book.category)
        ? book.category.includes(category)
        : book.category === category
    )
  }

  const uniqueCategories = getUniqueCategories(booksFiltered)

  return (
    <GalleryContainer>
      {uniqueCategories.map((category) => (
        <CarouselWrapper key={category}>
          <Carousel title={category} items={getBooksByCategory(category)} />
        </CarouselWrapper>
      ))}
    </GalleryContainer>
  )
}

const GalleryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CarouselWrapper = styled.div`
  width: 100%;
  margin-bottom: var(--lg);
`