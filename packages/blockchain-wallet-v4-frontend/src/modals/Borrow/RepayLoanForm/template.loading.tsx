import React from 'react'
import styled from 'styled-components'

import { SpinningLoader, Text } from 'blockchain-info-components'

interface Props {}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const Loading: React.FC<Props> = () => {
  return (
    <Wrapper>
      <SpinningLoader />
      <Text weight={600} color='grey600' style={{ marginTop: '24px' }}>
        Doing Work...
      </Text>
    </Wrapper>
  )
}

export default Loading
