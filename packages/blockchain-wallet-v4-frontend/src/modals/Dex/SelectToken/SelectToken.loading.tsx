import React from 'react'
import styled from 'styled-components'

import { SpinningLoader } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 28px 0;
`
const Loading = () => (
  <Wrapper>
    <SpinningLoader width='36px' height='36px' borderWidth='4px' />
  </Wrapper>
)

export default Loading
