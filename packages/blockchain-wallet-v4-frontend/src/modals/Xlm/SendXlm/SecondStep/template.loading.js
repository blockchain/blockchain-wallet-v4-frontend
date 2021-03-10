import React from 'react'
import styled from 'styled-components'

import { SkeletonRectangle } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  height: 460px;
  box-sizing: border-box;
`

export default props => {
  return (
    <Wrapper>
      <SkeletonRectangle height='20px' width='30%' />
      <SkeletonRectangle
        height='40px'
        width='100%'
        style={{ marginTop: '15px' }}
      />
      <SkeletonRectangle
        height='20px'
        width='30%'
        style={{ marginTop: '30px' }}
      />
      <SkeletonRectangle
        height='40px'
        width='100%'
        style={{ marginTop: '15px' }}
      />
      <SkeletonRectangle
        height='20px'
        width='30%'
        style={{ marginTop: '15px' }}
      />
      <SkeletonRectangle
        height='40px'
        width='100%'
        style={{ marginTop: '15px' }}
      />
      <SkeletonRectangle
        height='80px'
        width='100%'
        style={{ marginTop: '40px' }}
      />
    </Wrapper>
  )
}
