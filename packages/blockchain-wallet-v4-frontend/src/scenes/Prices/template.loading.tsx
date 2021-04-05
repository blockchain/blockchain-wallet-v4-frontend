import React from 'react'
import styled from 'styled-components'

import { SpinningLoader } from 'blockchain-info-components'

const StatusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 120px;
  align-items: center;
  justify-content: center;
`

export default () => (
  <StatusWrapper>
    <SpinningLoader width='40px' height='40px' />
  </StatusWrapper>
)
