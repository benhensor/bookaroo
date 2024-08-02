import React from 'react'
import styled from 'styled-components'
import Heart from '../../icons/Heart'

export default function Book({ book }) {
	// console.log(book)
	return (
		<BookContainer>
			<BookCover>
				<img src={book.coverImg} alt={book.title} />
        <Heart bookId={book.id} />
			</BookCover>
			<BookDetails>
        <h3>{book.title}</h3>
        <p>{book.author}</p>
      </BookDetails>
		</BookContainer>
	)
}

const BookContainer = styled.div`
	display: flex;
	flex-direction: column;
  justify-content: space-between;
	text-align: left;
  padding: var(--xs);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  border-radius: var(--xs);
  overflow: hidden;
  cursor: pointer;
`

const BookCover = styled.div`
	border-radius: var(--xs);
	width: 100%; /* Ensure the cover takes the full width of the container */
  height: calc(100% - 5rem); /* Ensure the cover takes the full height of the container */
	overflow: hidden; /* Hide overflow to maintain consistency */
  position: relative;
  aspect-ratio: 1/1.6; /* Maintain aspect ratio */
	img {
		width: 100%; /* Ensure the image takes the full width of the container */
    height: 100%; /* Ensure the image takes the full height of the container */
		object-fit: cover; /* Cover the container while maintaining aspect ratio */
    object-position: top;
    border-radius: var(--xs);
	}
`;

const BookDetails = styled.div`
  margin-top: var(--sm);
  h3 {
    font-size: clamp(1.4rem, 2vw, 1.8rem);
    margin-top: var(--xs);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  p {
    font-style: italic;
    font-size: clamp(1.2rem, 2vw, 1.6rem);
  }
`