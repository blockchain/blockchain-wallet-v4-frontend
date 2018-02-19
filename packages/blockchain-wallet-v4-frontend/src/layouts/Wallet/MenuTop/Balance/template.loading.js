import React from 'react'
import styled from 'styled-components'

import { SkeletonRectangle } from 'blockchain-info-components'

const BalanceSkeleton = styled.div`
  > div:first-child { margin-bottom: 5px; }
`

export default (props) => {
  return (
    <BalanceSkeleton>
      <SkeletonRectangle width='170px' height='30px' bgColor='white-blue' />
      <SkeletonRectangle width='170px' height='30px' bgColor='white-blue' />
    </BalanceSkeleton>
  )
}
