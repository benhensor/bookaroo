import React, { useState } from 'react'
import styled from 'styled-components'
import Book from '../books/Book'

export default function SearchResults({ title, items}) {
  const [isOpened, setIsOpened] = useState(false)
  const [wrapperHeight, setWrapperHeight] = useState('auto')
  return (
    <ResultsContainer
    >
      <h2>{title}</h2>
      <ResultsWrapper>

        {items.map((book) => (
          <BookPreview key={book.id}>
            <Book book={book} />
          </BookPreview>
        ))}
      </ResultsWrapper>
    </ResultsContainer>
  )
}

const ResultsContainer = styled.div`
  z-index: 1000;
  margin-bottom: var(--lg);
`

const ResultsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
	margin: var(--lg) 0;
`

const BookPreview = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
`
