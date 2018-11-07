import React from 'react'
import styled from 'styled-components'

import { BlockchainLoader } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 400px;
  padding: 5px;
  box-sizing: border-box;
`

export default props => {
  return (
    <Wrapper>
      <BlockchainLoader width='200px' height='200px' />
    </Wrapper>
  )
}
