import React from 'react'
import styled from 'styled-components'

import { FlyoutWrapper } from 'components/Flyout'
import { SpinningLoader } from 'blockchain-info-components'

const Wrapper = styled(FlyoutWrapper)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  text-align: center;
`

const Loading: React.FC<Props> = () => {
  return (
    <Wrapper>
      <SpinningLoader height='50px' width='50px' />
    </Wrapper>
  )
}

type Props = { order?: boolean; polling?: boolean }

export default Loading
