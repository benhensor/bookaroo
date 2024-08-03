import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWindowWidth } from '../../utils/useWindowWidth'
import Book from '../books/Book'
import Chevron from '../../icons/Chevron'

export default function Carousel({ items, title }) {
  const [currentIndex, setCurrentIndex] = useState(0)
	const [leftChevronVisible, setLeftChevronVisible] = useState(false)
  const [rightChevronVisible, setRightChevronVisible] = useState(false)

	const windowWidth = useWindowWidth()
	
	const getItemsPerPage = () => {
		if (windowWidth <= 679) return 2
		if (windowWidth <= 849) return 3
		if (windowWidth <= 999) return 4
		return 5
	}

	const itemsPerPage = getItemsPerPage()

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + itemsPerPage, items.length - itemsPerPage))
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      handleNext()
    }
    if (e.key === 'ArrowLeft') {
      handlePrev()
    }
  }

	useEffect(() => {
    setLeftChevronVisible(currentIndex > 0)
    setRightChevronVisible(currentIndex + itemsPerPage < items.length)
  }, [currentIndex, items.length, itemsPerPage])

	useEffect(() => {
		setCurrentIndex((prevIndex) => {
			const maxIndex = items.length - itemsPerPage
			return Math.min(prevIndex, maxIndex)
		})
	}, [items.length, itemsPerPage])


  return (
    <CarouselContainer
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <h2>{title}</h2>
      <CarouselWrapper>
        <ChevronContainer $position={'left'}>

        	<Chevron isVisible={leftChevronVisible} boolean={true} onClick={handlePrev} />

        </ChevronContainer>

        <BooksViewport>
          <BooksWrapper $offset={currentIndex / itemsPerPage}>
            {items.map((item) => (
              <BookPreview key={item.id}>
                <Book book={item} />
              </BookPreview>
            ))}
          </BooksWrapper>
        </BooksViewport>

        <ChevronContainer $position={'right'}>
          <Chevron isVisible={rightChevronVisible} indexboolean={false} onClick={handleNext} />
        </ChevronContainer>
      </CarouselWrapper>
    </CarouselContainer>
  )
}

const CarouselContainer = styled.div`
  z-index: 1000;
  margin-bottom: var(--lg);
`

const CarouselWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
	margin: var(--lg) 0;
`

const ChevronContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$position === 'left' ? 'flex-start' : 'flex-end')};
  margin: ${(props) => (props.$position === 'left' ? '0 var(--lg) 0 0' : '0 0 0 var(--lg)')};
  width: fit-content;
  height: 100%;
	@media only screen and (max-width: 479px) {
		margin: ${(props) => (props.$position === 'left' ? '0 var(--xs) 0 0' : '0 0 0 var(--xs)')};
	}
`

const BooksViewport = styled.div`
  overflow: hidden;
  flex: 1;
`

const BooksWrapper = styled.div`
  display: flex;
  transition: transform 0.5s ease;
  transform: translateX(${(props) => props.$offset * -100}%);
`

const BookPreview = styled.div`
  flex: 0 0 calc(100% / 5);
	position: relative;
  p {
    margin-top: var(--xs);
    font-size: 1rem;
  }
	@media only screen and (max-width: 999px) {
		flex: 0 0 calc(100% / 4);
	}
	@media only screen and (max-width: 849px) {
		flex: 0 0 calc(100% / 3);
	}
	@media only screen and (max-width: 679px) {
		flex: 0 0 calc(100% / 2);
	}
`