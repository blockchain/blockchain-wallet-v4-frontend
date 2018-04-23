import React from 'react'
import styled from 'styled-components'

import { SkeletonCircle, SkeletonRectangle } from 'blockchain-info-components'

const ActivityListSkeleton = styled(SkeletonRectangle)`
  display: flex;
  padding: 15px;
  margin-top: 15px;
  flex-direction: column;
  box-sizing: border-box;
  @media (min-width: 993px) {
    margin-bottom: 30px;
  }
`
const ActivitySkeleton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 15px;
  > div:first-child { margin-right: 20px; }
`

export default (props) => {
  return (
    <ActivityListSkeleton width='100%' height='300px' bgColor='white-blue'>
      <SkeletonRectangle width='100%' height='30px' bgColor='white' />
      <ActivitySkeleton>
        <SkeletonCircle width='30px' height='30px' bgColor='white' />
        <SkeletonRectangle width='calc(100% - 50px)' height='30px' bgColor='white' />
      </ActivitySkeleton>
      <ActivitySkeleton>
        <SkeletonCircle width='30px' height='30px' bgColor='white' />
        <SkeletonRectangle width='calc(100% - 50px)' height='30px' bgColor='white' />
      </ActivitySkeleton>
      <ActivitySkeleton>
        <SkeletonCircle width='30px' height='30px' bgColor='white' />
        <SkeletonRectangle width='calc(100% - 50px)' height='30px' bgColor='white' />
      </ActivitySkeleton>
    </ActivityListSkeleton>
  )
}
