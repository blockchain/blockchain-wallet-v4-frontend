import React from 'react'
import styled from 'styled-components'
import Content from './Content'
import TxFeedTooltips from '../../../components/TxFeedTooltips'

const Wrapper = styled.div`
  width: 100%;
`

const BchTransactionsContainer = () => {
  return (
    <Wrapper>
      <Content />
      <TxFeedTooltips />
    </Wrapper>
  )
}

export default BchTransactionsContainer
