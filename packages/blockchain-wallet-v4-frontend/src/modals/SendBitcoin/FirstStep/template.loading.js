import React from 'react'
import styled from 'styled-components'

import { SkeletonRectangle } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'
const Wrapper = styled.div`
  width: 100%;
  height: 470px;
  box-sizing: border-box;
`

export default (props) => (
  <Wrapper>
    <SkeletonRectangle height='20px' width='30%' />
    <SkeletonRectangle height='40px' width='100%' style={spacing('mt-15')} />
    <SkeletonRectangle height='20px' width='30%' style={spacing('mt-30')} />
    <SkeletonRectangle height='40px' width='100%' style={spacing('mt-15')} />
    <SkeletonRectangle height='20px' width='30%' style={spacing('mt-15')} />
    <SkeletonRectangle height='40px' width='100%' style={spacing('mt-15')} />
    <SkeletonRectangle height='80px' width='100%' style={spacing('mt-40')} />
  </Wrapper>
)
