import React from 'react'
import styled from 'styled-components'

import { SkeletonRectangle } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  box-sizing: border-box;
`

export default (props) => (
  <Wrapper>
    <SkeletonRectangle width='200px' height='15px' />
  </Wrapper>
)
