import React from 'react'
import styled from 'styled-components'

import { SkeletonRectangle } from 'blockchain-info-components'

type Props = {}

const Wrapper = styled.div`
  height: 120px;
  width: 320px;
  border-radius: 8px;
  padding: 16px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme.grey100};
  display: flex;
  flex-direction: column;
`
const LoadingWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const Skeletons = () => {
  return (
    <LoadingWrapper>
      <SkeletonRectangle height='24px' width='100px' />
      <SkeletonRectangle height='16px' width='100px' />
      <SkeletonRectangle height='16px' width='100px' />
    </LoadingWrapper>
  )
}

const Loading: React.FC<Props> = () => {
  return (
    <Wrapper>
      <Skeletons />
    </Wrapper>
  )
}

export default Loading
