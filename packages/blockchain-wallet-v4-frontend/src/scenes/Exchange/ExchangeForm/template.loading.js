import React from 'react'
import styled from 'styled-components'

import { BlockchainLoader } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 500px;
`

export default () => (
  <Wrapper>
    <BlockchainLoader width='200px' height='200px' />,
  </Wrapper>
)
