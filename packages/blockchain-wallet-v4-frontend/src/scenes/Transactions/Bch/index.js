import React from 'react'
import styled from 'styled-components'

import Content from './Content'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'

const Wrapper = styled.div`
  width: 100%;
`

const BchTransactionsContainer = () => {
  return (
    <ErrorBoundary>
      <Wrapper>
        <Content />
      </Wrapper>
    </ErrorBoundary>
  )
}

export default BchTransactionsContainer
