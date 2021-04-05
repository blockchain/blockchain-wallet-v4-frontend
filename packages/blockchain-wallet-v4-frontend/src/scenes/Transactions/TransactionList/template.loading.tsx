import React from 'react'
import styled from 'styled-components'

import { SkeletonRectangle } from 'blockchain-info-components'

const LoadingSkeleton = styled(SkeletonRectangle)`
  display: flex;
  flex-direction: column;
  align-items: start;
  box-sizing: border-box;
  padding-top: 25px;
`
const LoadingTxSkeleton = styled.div`
  flex: 1;
  width: 100%;
  padding: 0 15px;
  & > :first-child {
    margin-bottom: 5px;
  }
`
const Loading = () => (
  <LoadingSkeleton height='450px' width='100%' bgColor='white'>
    <LoadingTxSkeleton>
      <SkeletonRectangle width='50%' height='30px' bgColor='grey000' />
      <SkeletonRectangle
        width='calc(100% - 30px)'
        height='80px'
        bgColor='grey100'
      />
    </LoadingTxSkeleton>
    <LoadingTxSkeleton>
      <SkeletonRectangle width='50%' height='30px' bgColor='grey000' />
      <SkeletonRectangle
        width='calc(100% - 30px)'
        height='80px'
        bgColor='grey100'
      />
    </LoadingTxSkeleton>
    <LoadingTxSkeleton>
      <SkeletonRectangle width='50%' height='30px' bgColor='grey000' />
      <SkeletonRectangle
        width='calc(100% - 30px)'
        height='80px'
        bgColor='grey100'
      />
    </LoadingTxSkeleton>
  </LoadingSkeleton>
)

export default Loading
