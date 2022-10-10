import React from 'react'
import styled from 'styled-components'

import { SpinningLoader } from 'blockchain-info-components'
import { SceneWrapper } from 'components/Layout'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Loading = () => (
  <SceneWrapper centerContent>
    <Wrapper>
      <SpinningLoader width='36px' height='36px' />
    </Wrapper>
  </SceneWrapper>
)

export default Loading
