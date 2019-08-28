import React from 'react'
import styled from 'styled-components'
import { Container } from './template.success'
import { Wrapper, MenuItem } from 'components/MenuLeft'
import {
  BlockchainLoader,
  SkeletonRectangle,
  SkeletonCircle
} from 'blockchain-info-components'

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
