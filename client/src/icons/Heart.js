import React from 'react'
import styled from 'styled-components'
import { useUser } from '../context/UserContext'

export default function Heart({ bookId }) {

  const { likedBooks, likeBook, unlikeBook } = useUser()

  const isLiked = likedBooks.includes(bookId)

  const handleToggleLike = () => {
    if (isLiked) {
      unlikeBook(bookId)
    } else {
      likeBook(bookId)
    }
  }

	return (
		<SVG
      onClick={handleToggleLike}
			x="0"
			y="0"
			version="1.1"
			viewBox="0 0 29 29"
			fill={isLiked ? 'var(--dangerDk)' : 'var(--white)'}
		>
			<path
				d="m14.854 6.083-.354.353-.354-.354a6.5 6.5 0 0 0-9.192 9.192l.354.354L14.5 24.82l9.192-9.192.354-.354a6.5 6.5 0 0 0-9.192-9.191z"
				stroke={isLiked ? 'var(--white)' : 'var(--blkGreen)'}
				strokeWidth="1"
			></path>
			<path
				d="m14.854 6.083-.354.353-.354-.354a6.5 6.5 0 0 0-9.192 9.192l.354.354L14.5 24.82l9.192-9.192.354-.354a6.5 6.5 0 0 0-9.192-9.191z"
				stroke={isLiked ? 'var(--white)' : 'var(--blkGreen)'}
				strokeWidth="1px"
			></path>
		</SVG>
	)
}

const SVG = styled.svg`
  position: absolute;
  top: .5rem;
  right: .5rem;
  width: 2.5rem;
  height: 2.5rem;
  transition: var(--medium);

  &:hover {
    cursor: pointer;
    animation: heartbeat 1.2s infinite;
  }
  @keyframes heartbeat {
    0% {
      transform: scale(1);
    }
    15% {
      transform: scale(1.2);
    }
    30% {
      transform: scale(1);
    }
    45% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`

