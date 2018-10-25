import React from 'react'
import styled from 'styled-components'
import { SkeletonRectangle } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 20px 40px;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
  > div {
    margin-right: 25px;
  }
`

const Loading = () => {
  return (
    <Wrapper>
      <SkeletonRectangle height='72px' width='180px' bgColor='white-blue' />
      <SkeletonRectangle height='72px' width='180px' bgColor='white-blue' />
      <SkeletonRectangle height='72px' width='180px' bgColor='white-blue' />
    </Wrapper>
  )
}

export default Loading
