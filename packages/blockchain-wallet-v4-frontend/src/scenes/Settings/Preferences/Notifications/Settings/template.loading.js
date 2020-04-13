import React from 'react'
import styled from 'styled-components'

import { SkeletonRectangle } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 5px;
  box-sizing: border-box;
  & > :first-child {
    margin-bottom: 5px;
  }
`

export default props => (
  <Wrapper>
    <SkeletonRectangle width='100%' height='30px' bgColorgrey000 />
    <SkeletonRectangle width='100%' height='30px' bgColorgrey000 />
  </Wrapper>
)
