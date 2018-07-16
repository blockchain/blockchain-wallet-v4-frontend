import React from 'react'
import styled from 'styled-components'

import { FlatLoader } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px;
  box-sizing: border-box;
`

export default props => {
  return (
    <Wrapper>
      <FlatLoader width='50px' height='14px' />
    </Wrapper>
  )
}
