import {
  BlockchainLoader,
  SkeletonCircle,
  SkeletonRectangle
} from 'blockchain-info-components'
import { Container } from './template.success'
import { MenuItem, Wrapper } from 'components/MenuLeft'
import React from 'react'
import styled from 'styled-components'

const SkeletonMenuItem = styled(MenuItem)`
  margin-top: 12px;
  > div:last-child {
    flex: 1;
    margin-left: 20px;
  }
`

const Loading = () => {
  return (
    <Container>
      <Wrapper>
        <MenuItem>
          <BlockchainLoader height='30px' width='30px' />
        </MenuItem>
        <SkeletonMenuItem>
          <SkeletonCircle height='30px' width='30px' />
          <SkeletonRectangle height='25px' width='auto' />
        </SkeletonMenuItem>
        <SkeletonMenuItem>
          <SkeletonCircle height='30px' width='30px' />
          <SkeletonRectangle height='25px' width='auto' />
        </SkeletonMenuItem>
        <SkeletonMenuItem>
          <SkeletonCircle height='30px' width='30px' />
          <SkeletonRectangle height='25px' width='auto' />
        </SkeletonMenuItem>
      </Wrapper>
    </Container>
  )
}

export default Loading
