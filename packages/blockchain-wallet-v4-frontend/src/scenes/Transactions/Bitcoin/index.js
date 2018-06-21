import React from 'react'
import styled from 'styled-components'
import Content from './Content'

const Wrapper = styled.div`
  width: 100%;
`

const BitcoinTransactionsContainer = () => {
  return (
    <Wrapper>
      <Content />
    </Wrapper>
  )
}

export default BitcoinTransactionsContainer
