import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import WordButton from '../components/buttons/WordButton'
import ActionButton from '../components/buttons/ActionButton'
import { useWindowWidth } from '../utils/useWindowWidth'
import { PageHeader } from '../assets/styles/GlobalStyles'


export default function Book() {
	const navigate = useNavigate()
	const location = useLocation()
	const book = location.state?.book
  const bookOwner = location.state?.bookOwner.username

	const [bookDescription, setBookDescription] = useState(null)
  const windowSize = useWindowWidth()


	useEffect(() => {
		const isbn = book?.isbn
		const getBookDescription = async () => {
			try {
				const { data } = await axios.get(
					`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
				)
				// console.log(data)
        if (!data.items) {
          return
        }
				setBookDescription(data.items[0].volumeInfo.description)
			} catch (error) {
				console.error(error)
			}
		}
		// console.log('isbn:', isbn)
		getBookDescription()
	}, [book?.isbn])


	if (!book) {
		navigate(-1)
		return null
	}

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(date).toLocaleDateString('en-US', options
    )
  }

  const formatCategory = (categories) => {
    return (
      <Category>
        {categories.map((category, index) => (
          <React.Fragment key={index}>
            <p>{category}</p>
            {index < categories.length - 1 && <span> • </span>}
          </React.Fragment>
        ))}
      </Category>
    );
  }

  const formatCondition = (condition) => {
    switch (condition) {
      case 'As New':
        return (
          <>
            <p>This copy is in <span>perfect</span> condition.</p>
          </>
        )
      case 'Good':
        return (
          <>
            <p>This copy is in <span>good</span> condition.</p>
          </>
        )
      case 'Fair':
        return (
          <>
            <p>This copy is in <span>fair</span> condition.</p>
          </>
        )
      case 'Poor':
        return (
          <>
            <p>This copy is in <span style={{ color: 'var(--danger)'}}>poor</span> condition.</p>
          </>
        )
      default:
        return (
          <>
            <p>The condition of copy is <span>unknown</span>.</p>
          </>
        )
    }
  }

  const handleContactClick = (e) => {
		e.stopPropagation()
		navigate('/contact', { state: { book, bookOwner } })
	}
  

  const BookTitle = ({ title, author }) => (
    <Title>
      <h1>{title}</h1>
      <h2>{author}</h2>
    </Title>
  )
  
  const BookDetails = ({ book, formatDate, formatCategory }) => (
    <BookInfo>
      <p>{book.isbn}</p>
      <p>{book.publisher}</p>
      <p>{formatDate(book.publishedDate)}</p>
      {formatCategory(book.category)}
    </BookInfo>
  )
  
  const OwnerNotes = ({ bookOwner, book, formatCondition }) => (
    <OwnersNotes>
      <h3>{bookOwner}'s Notes</h3>
      {formatCondition(book.condition)}
      <blockquote>"{book.notes}"</blockquote>
    </OwnersNotes>
  )
  
  const BookBlurb = ({ description }) => (
    <BookDescription>
      <h3>Blurb</h3>
      <p>{description}</p>
    </BookDescription>
  )


const renderLayout = () => {
    switch(true) {
      case windowSize >= 769:
        return (
          <BookContainer>
            <BlockA>
              <BookCover>
                <img src={book.coverImg} alt={book.title} />
              </BookCover>
              <BookDetails book={book} formatDate={formatDate} formatCategory={formatCategory} />
              <OwnerNotes bookOwner={bookOwner} book={book} formatCondition={formatCondition} />
            </BlockA>
            <BlockB>              
              <BookTitle title={book.title} author={book.author} />
              <BookBlurb description={bookDescription} />
              <ActionButton type="action" text={`Contact ${bookOwner}`} onClick={handleContactClick} />
            </BlockB>
          </BookContainer>
        )
      case windowSize >= 451 && windowSize <= 768:
        return (
          <BookContainer>
            <BlockA>
              <BookCover>
                <img src={book.coverImg} alt={book.title} />
              </BookCover>
              <BlockB>
                <BookTitle title={book.title} author={book.author} />
                <BookDetails book={book} formatDate={formatDate} formatCategory={formatCategory} />
                <OwnerNotes bookOwner={bookOwner} book={book} formatCondition={formatCondition} />
                <ActionButton type="action" text={`Contact ${bookOwner}`} onClick={handleContactClick} />
              </BlockB>
            </BlockA>
            <BlockC>
              <BookBlurb description={bookDescription} />
            </BlockC>
          </BookContainer>
        )
      default:
        return (
          <BookContainer>
            <BlockA>
              <BookCover>
                <img src={book.coverImg} alt={book.title} />
              </BookCover>
            </BlockA>
            <BlockB>
              <BookTitle title={book.title} author={book.author} />
              <BookDetails book={book} formatDate={formatDate} formatCategory={formatCategory} />
            </BlockB>
            <BlockC>
              <OwnerNotes bookOwner={bookOwner} book={book} formatCondition={formatCondition} />
              <ActionButton type="action" text={`Contact ${bookOwner}`} onClick={handleContactClick} />
              <BookBlurb description={bookDescription} />
            </BlockC>
            <WordButton text="Return" onClick={() => navigate('/')} />
          </BookContainer>
        )
    }
  }

  return (
    <section>
      <PageHeader style={{ marginBottom: 'var(--xxl)' }}>
        <BackButton>
          <WordButton text="Back" onClick={() => navigate('/')} />
        </BackButton>
      </PageHeader>
      {renderLayout()}
      <Controls></Controls>
    </section>
  )
}


const BackButton = styled.div`
	position: absolute;
	left: 0;
	top: 0;
`
const Title = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: var(--lg);
`

const BookContainer = styled.div`
	display: flex;
  align-items: flex-start;
	gap: var(--lg);
	margin: var(--lg) 0;
  h1 {
    font-size: clamp(2.4rem, 3vw, 4rem);
    color: var(--dkGreen);
  }
  h2 {
    font-size: clamp(1.6rem, 2vw, 2.4rem);
  }
  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`

const BlockA = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	gap: var(--lg);
  @media only screen and (max-width: 768px) {
    flex: 1;
    flex-direction: row;
  }
`

const BlockB = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  @media only screen and (max-width: 768px) {
    flex: 1;
  }
  @media only screen and (max-width: 450px) {
    width: 100%;
  }
`

const BlockC = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--xl);
  @media only screen and (max-width: 768px) {
    gap: var(--sm);
  }
`

const BookInfo = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
  gap: var(--xs);
  width: 100%;
  font-size: 1.4rem;
  span {
    color: var(--ltBrown);
  }
  @media only screen and (max-width: 768px) {
    margin-bottom: var(--lg);
  }
  @media only screen and (max-width: 450px) {
    margin-bottom: 0;
  }
`

const Category = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--xs);
  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`

const BookCover = styled.div`
	position: relative;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  margin-bottom: var(--sm);
  @media only screen and (max-width: 768px) {
    width: 50%;
  }
  @media only screen and (max-width: 450px) {
    width: 100%;
  }
`


const BookDescription = styled.div`
  margin-bottom: var(--xl);
  h3 {
    font-size: clamp(1.6rem, 2vw, 2rem);
    color: var(--mdBrown);
    margin-bottom: var(--lg);
  }
  p {
    font-size: clamp(1.2rem, 2vw, 1.4rem);
  }
  @media only screen and (max-width: 768px) {
    h3 {
      margin-bottom: var(--sm);
    }
  }
  @media only screen and (max-width: 450px) {
    margin-top: var(--lg);
  }
`

const OwnersNotes = styled.div`
	display: flex;
	flex-direction: column;
  h3 {
    font-size: clamp(1.6rem, 2vw, 2rem);
    color: var(--mdBrown);
    margin-bottom: var(--lg);
  }
  @media only screen and (max-width: 768px) {
    margin-bottom: var(--lg);
    h3 {
      margin-bottom: var(--sm);
    }
  }
  span {
    color: var(--dkGreen);
  }
  quote {
    font-style: italic;
  }
`

const Controls = styled.div`
	display: flex;
	gap: 1rem;
`
