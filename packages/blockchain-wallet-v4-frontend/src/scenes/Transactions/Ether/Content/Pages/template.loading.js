import React from 'react'
import styled from 'styled-components'

import { SkeletonRectangle } from 'blockchain-info-components'

const ActivityListSkeleton = styled(SkeletonRectangle)`
  display: flex;
  flex-direction: column;
  align-items: start;
  box-sizing: border-box;
  padding-top: 25px;
`
const ActivitySkeleton = styled.div`
  flex: 1;
  width: 100%;
  padding: 0 15px;
  & > :first-child { margin-bottom: 5px; }
`

export default () => (
  <ActivityListSkeleton height='450px' width='100%;' bgColor='white'>
    <ActivitySkeleton>
      <SkeletonRectangle width='50%' height='30px' bgColor='white-blue' />
      <SkeletonRectangle width='calc(100% - 30px)' height='80px' bgColor='white-blue' />
    </ActivitySkeleton>
    <ActivitySkeleton>
      <SkeletonRectangle width='50%' height='30px' bgColor='white-blue' />
      <SkeletonRectangle width='calc(100% - 30px)' height='80px' bgColor='white-blue' />
    </ActivitySkeleton>
    <ActivitySkeleton>
      <SkeletonRectangle width='50%' height='30px' bgColor='white-blue' />
      <SkeletonRectangle width='calc(100% - 30px)' height='80px' bgColor='white-blue' />
    </ActivitySkeleton>
  </ActivityListSkeleton>
)
