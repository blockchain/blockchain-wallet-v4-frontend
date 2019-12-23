import { SkeletonRectangle } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin-top: 12px;
`

const Loading = () => {
  return (
    <Wrapper>
      <SkeletonRectangle width='100px' height='16px' />
    </Wrapper>
  )
}

export default Loading
