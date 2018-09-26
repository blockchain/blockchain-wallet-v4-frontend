import React from 'react'
import styled from 'styled-components'

import Content from './Content/index'

const Wrapper = styled.div`
  width: 100%;
`

const EtherTransactionsContainer = () => {
  return (
    <Wrapper>
      <Content />
    </Wrapper>
  )
}

export default EtherTransactionsContainer
