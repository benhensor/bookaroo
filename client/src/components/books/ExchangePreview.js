import React from 'react'
import styled from 'styled-components'

export default function Thumbnail({ book }) {

	// console.log('book:', book)

	return (
    <div>
			<BookContainer>
						<BookCover>
							<img src={book?.coverImg} alt={book?.title} />
						</BookCover>
				<BookDetails>
					<h3>{book?.title}</h3>
					<p>{book?.author}</p>
				</BookDetails>
			</BookContainer>
		</div>
	)
}

const BookContainer = styled.div`
	display: block;
	cursor: pointer;
`

const BookCover = styled.div`
	width: 260px;
	max-height: 400px;
	margin-bottom: var(--sm);
	img {
		aspect-ratio: auto 260 / 400;
		max-width: 100%;
		min-height: 400px;
		object-fit: cover;
		object-position: top;
	}
`

const BookDetails = styled.div`
	width: 260px;
	padding-top: var(--sm);
	h3 {
		color: var(--dkGreenA);
		font-size: clamp(1.2rem, 2vw, 1.6rem);
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	p {
		color: var(--ltBrown);
		font-size: clamp(1rem, 2vw, 1.4rem);
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
`