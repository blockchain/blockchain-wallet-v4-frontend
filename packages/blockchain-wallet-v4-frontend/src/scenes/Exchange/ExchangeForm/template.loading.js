import { SpinningLoader, Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

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
    <SpinningLoader width='36px' height='36px' />
    <Text
      size='18px'
      weight={600}
      color='grey600'
      style={{ marginTop: '16px' }}
    >
      Doing Work...
    </Text>
  </Wrapper>
)
