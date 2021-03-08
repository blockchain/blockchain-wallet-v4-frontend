import React from 'react'
import { SkeletonRectangle } from 'blockchain-info-components'
import styled from 'styled-components'

const ActivityListSkeleton = styled(SkeletonRectangle)`
  display: flex;
  flex-direction: column;
  align-items: start;
  box-sizing: border-box;
  padding-top: 10px;
`
const ActivitySkeleton = styled.div`
  flex: 1;
  width: 100%;
  padding: 0 10px;
  & > :first-child {
    margin-bottom: 5px;
  }
`

export default () => (
  <ActivityListSkeleton height='450px' width='100%;' bgColor='white'>
    <ActivitySkeleton>
      <SkeletonRectangle width='50%' height='30px' bgColorgrey000 />
      <SkeletonRectangle
        width='calc(100% - 30px)'
        height='80px'
        bgColorgrey000
      />
    </ActivitySkeleton>
    <ActivitySkeleton>
      <SkeletonRectangle width='50%' height='30px' bgColorgrey000 />
      <SkeletonRectangle
        width='calc(100% - 30px)'
        height='80px'
        bgColorgrey000
      />
    </ActivitySkeleton>
    <ActivitySkeleton>
      <SkeletonRectangle width='50%' height='30px' bgColorgrey000 />
      <SkeletonRectangle
        width='calc(100% - 30px)'
        height='80px'
        bgColorgrey000
      />
    </ActivitySkeleton>
  </ActivityListSkeleton>
)
