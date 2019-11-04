import { SkeletonRectangle } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 10px 40px;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
  > div {
    margin-right: 15px;
  }
`

const Loading = () => {
  return (
    <Wrapper>
      <SkeletonRectangle height='65px' width='165px' bgColor='gray-1' />
      <SkeletonRectangle height='65px' width='165px' bgColor='gray-1' />
      <SkeletonRectangle height='65px' width='165px' bgColor='gray-1' />
      <SkeletonRectangle height='65px' width='165px' bgColor='gray-1' />
    </Wrapper>
  )
}

export default Loading
