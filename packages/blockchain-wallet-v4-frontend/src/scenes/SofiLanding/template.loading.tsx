import React from 'react'
import styled from 'styled-components'

import { SpinningLoader, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'

const LoadingWrapper = styled(Wrapper)`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Loading = () => {
  return (
    <LoadingWrapper>
      <SpinningLoader width='40px' height='40px' />
    </LoadingWrapper>
  )
}

export default Loading
