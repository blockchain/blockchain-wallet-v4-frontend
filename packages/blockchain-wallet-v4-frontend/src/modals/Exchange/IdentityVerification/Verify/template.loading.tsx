import React from 'react'
import styled from 'styled-components'

import { BlockchainLoader } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 600px;
  padding: 5px;
  box-sizing: border-box;
`

export default () => {
  return (
    <Wrapper>
      <BlockchainLoader width='80px' height='80px' />
    </Wrapper>
  )
}
