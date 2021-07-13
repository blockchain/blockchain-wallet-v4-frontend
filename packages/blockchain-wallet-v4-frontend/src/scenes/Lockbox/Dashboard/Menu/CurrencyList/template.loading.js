import React from 'react'
import styled from 'styled-components'

import { SkeletonRectangle } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 10px 40px;
  border-bottom: 1px solid ${props => props.theme.grey000};
  > div {
    margin-right: 15px;
  }
`

const Loading = () => {
  return (
    <Wrapper>
      <SkeletonRectangle height='65px' width='165px' bgColorgrey000 />
      <SkeletonRectangle height='65px' width='165px' bgColorgrey000 />
      <SkeletonRectangle height='65px' width='165px' bgColorgrey000 />
      <SkeletonRectangle height='65px' width='165px' bgColorgrey000 />
    </Wrapper>
  )
}

export default Loading
