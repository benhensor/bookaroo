import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

export default function Thumbnail({ book }) {

	return (
    <BookContainer>
      <BookCoverContainer>
        <BookCover>
          <img src={book.coverImg} alt={book.title} />
        </BookCover>
      </BookCoverContainer>
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
	align-items: center;
	cursor: pointer;
`

const BookCover = styled.div`
	border-radius: var(--xs);
	height: calc(100% - 5rem);
	overflow: hidden;
	position: relative;
	width: 150px;
	max-height: 240px;
	img {
		aspect-ratio: auto 150 / 240;
		max-width: 100%;
		min-height: 240px;
		object-fit: cover;
		object-position: top;
		border-radius: var(--xs);
	}
`

const BookCoverContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	overflow: hidden;
`

const BookDetails = styled.div`
	z-index: 10000;
	width: 150px;
	margin-top: var(--sm);
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
