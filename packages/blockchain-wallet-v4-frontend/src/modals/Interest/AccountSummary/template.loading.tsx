import React from 'react'
import { SpinningLoader, Text } from 'blockchain-info-components'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const Loading: React.FC<{}> = () => {
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
