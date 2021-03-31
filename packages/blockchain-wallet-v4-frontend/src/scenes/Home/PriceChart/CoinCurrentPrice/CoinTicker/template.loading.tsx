import React from 'react'
import styled from 'styled-components'

import { SkeletonRectangle } from 'blockchain-info-components'
import { media } from 'services/styles'

const Wrapper = styled.div`
  margin-top: 8px;
  margin-left: 0;

  ${media.atLeastTabletL`
    margin-left: 24px;
  `}
`
const Loading = () => (
  <Wrapper>
    <SkeletonRectangle width='100px' height='29px' />
  </Wrapper>
)

export default Loading
