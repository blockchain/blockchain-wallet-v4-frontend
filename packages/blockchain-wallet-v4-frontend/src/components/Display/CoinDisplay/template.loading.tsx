import React from 'react'
import styled from 'styled-components'

import { SkeletonRectangle } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`

export default (props) => {
  return (
    <Wrapper>
      <SkeletonRectangle width='50px' height={props.loadingHeight || '14px'} />
    </Wrapper>
  )
}
