import React from 'react'
import styled from 'styled-components'
import LinkButton from '../components/buttons/LinkButton'

export default function Browse() {
  return (
    <section>
      <h1>Browse</h1>
      <LinkButton
        to="/dashboard"
        text="Return"
      />
    </section>
  )
}

