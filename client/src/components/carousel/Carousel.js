import React from 'react'
import styled from 'styled-components'
import Heart from '../../icons/Heart'

export default function Carousel({ items, title }) {
	
	return (
		<CarouselContainer>
			<h2>{title}</h2>
			<ScrollContainer>
				{items.map((item) => (
					<Thumbnail key={item.id}>
						{title !== 'Your Listings' && <Heart bookId={item.id}/>}
						<img src={item.coverImg} alt={item.title} />
					</Thumbnail>
				))}
			</ScrollContainer>
		</CarouselContainer>
	)
}

const CarouselContainer = styled.div`
	z-index: 1000;
	margin-bottom: var(--lg);
`

const ScrollContainer = styled.div`
	display: flex;
	gap: var(--md);
	overflow-x: scroll;
	&::-webkit-scrollbar {
		display: none;
	}
`

const Thumbnail = styled.div`
	flex: 0 0 auto;
	margin: var(--sm) 0;
	text-align: center;
  transition: var(--medium);
	background-color: var(--black);
	box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
	width: 10rem;
	height: 15rem;
	overflow: hidden;
	position: relative;
	p {
		margin-top: var(--xs);
		font-size: 1rem;
	}
`
