import React from 'react'
import styled from 'styled-components'

import { SkeletonCircle, SkeletonRectangle } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding: 8px 16px;
  margin-bottom: 8px;
  height: 48px;
  box-sizing: border-box;
  border-radius: 8px;
`

const Circle = styled(SkeletonCircle)`
  margin-right: 10px;
`

const LoadingTextDark = styled(SkeletonRectangle)`
  border-radius: 10px;
`

const Loading: React.FC<Props> = () => {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <Wrapper key={i}>
          <Circle height='24px' width='24px' bgColor='grey200' />
          <LoadingTextDark width='75px' height='16px' />
        </Wrapper>
      ))}
    </>
  )
}

type Props = {}

export default Loading
