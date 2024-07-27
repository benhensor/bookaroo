import React from 'react'
import styled from 'styled-components'
import LinkButton from '../components/buttons/LinkButton'

export default function Listing() {
  return (
    <section>
      <h1>Add Book</h1>
      <LinkButton
        to="/dashboard"
        text="Return"
      />
    </section>
  )
}