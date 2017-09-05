import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  & > * { display:block; margin-bottom:10px; }
`

const Welcome = props => {
  return (
    <Container>
      <span> Hello! </span>
      <span> Welcome to our blockchain-components storybook </span>
      <span> This website will help you with : </span>
      <ul>
        <li>Discovering the different components available</li>
        <li>Getting more information about each component options</li>
      </ul>
    </Container>
  )
}

export default Welcome
