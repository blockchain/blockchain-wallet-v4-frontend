import React from 'react'
import styled from 'styled-components'

import { SkeletonRectangle } from 'blockchain-info-components'

const BalancesChartSkeleton = styled(SkeletonRectangle)`
  display: flex;
  padding: 15px;
  flex-direction: column;
  box-sizing: border-box;
  justify-content: space-between;
`
const ChartSkeleton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const SummarySkeleton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`

export default (props) => {
  return (
    <BalancesChartSkeleton width='100%' height='370px' bgColor='white-blue'>
      <SkeletonRectangle width='230px' height='30px' bgColor='white' />
      <ChartSkeleton>
        <SkeletonRectangle width='100%' height='200px' bgColor='white' />
      </ChartSkeleton>
      <SummarySkeleton>
        <SkeletonRectangle width='25%' height='30px' bgColor='white' />
        <SkeletonRectangle width='25%' height='30px' bgColor='white' />
        <SkeletonRectangle width='25%' height='30px' bgColor='white' />
      </SummarySkeleton>
    </BalancesChartSkeleton>
  )
}
