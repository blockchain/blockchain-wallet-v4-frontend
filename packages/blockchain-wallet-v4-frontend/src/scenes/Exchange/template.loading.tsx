import { SceneWrapper } from 'components/Layout'
import { SpinningLoader, Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

type Props = {}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Loading: React.FC<Props> = () => {
  return (
    <SceneWrapper centerContent>
      <Wrapper>
        <SpinningLoader width='80px' height='80px' />
        <Text
          size='18px'
          weight={600}
          color='grey600'
          style={{ marginTop: '24px' }}
        >
          Doing Work...
        </Text>
      </Wrapper>
    </SceneWrapper>
  )
}

export default Loading
