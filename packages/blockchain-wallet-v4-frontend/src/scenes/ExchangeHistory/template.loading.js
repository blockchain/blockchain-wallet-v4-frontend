import { SpinningLoader } from 'blockchain-info-components'
import { Text } from 'blockchain-info-components/src'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 600px;
`

export default () => (
  <Wrapper>
    <SpinningLoader width='80px' height='80px' />
    <Text
      size='18px'
      weight={600}
      color='grey600'
      style={{ marginTop: '24px' }}
    >
      Getting History...
    </Text>
  </Wrapper>
)
