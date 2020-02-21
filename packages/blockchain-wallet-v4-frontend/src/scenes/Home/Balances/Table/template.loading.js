import { SkeletonRectangle } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const BalanceSkeleton = styled.div`
  flex: 1;
  display: flex;
`
const SkeletonTable = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`
const CustomSkeletonRectangle = styled(SkeletonRectangle)`
  margin: 21px 0;
`

export default () => (
  <BalanceSkeleton>
    <SkeletonTable>
      <CustomSkeletonRectangle width='100%' height='37px' bgColor='gray-1' />
      <CustomSkeletonRectangle width='100%' height='37px' bgColor='gray-1' />
      <CustomSkeletonRectangle width='100%' height='37px' bgColor='gray-1' />
      <CustomSkeletonRectangle width='100%' height='37px' bgColor='gray-1' />
      <CustomSkeletonRectangle width='100%' height='37px' bgColor='gray-1' />
    </SkeletonTable>
  </BalanceSkeleton>
)
