import React from 'react'
import styled from 'styled-components'

import ExchangeLayout from 'layouts/Exchange'
import { BlockchainLoader } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 100px;
`

export default (props) => (
  <ExchangeLayout>
    <Wrapper>
      <BlockchainLoader width='200px' height='200px' />
    </Wrapper>
  </ExchangeLayout>
)
