import React from 'react'
import styled from 'styled-components'

import ExchangeByBlockchain from './WhatsNewContent/ExchangeByBlockchain'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  overflow-y: auto;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
`

const WhatsNew = props => (
  <Wrapper>
    <Container>
      <ExchangeByBlockchain />
    </Container>
  </Wrapper>
)

export default WhatsNew
