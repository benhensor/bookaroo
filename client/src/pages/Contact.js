import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import WordButton from '../components/buttons/WordButton'
import { PageHeader } from '../assets/styles/GlobalStyles'

export default function Contact() {
  const location = useLocation()
  const { book, bookOwner } = location.state
  console.log(book, bookOwner)
  return (
    <section>
      <PageHeader>
        <h1>Contact</h1>
        <WordButton to="/dashboard" text="Return" />
      </PageHeader>

      
      
    </section>
  )
}
