import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { SkeletonRectangle } from 'blockchain-info-components'
import { getPriceChart } from 'data/preferences/selectors'
import { RootState } from 'data/rootReducer'
import { media } from 'services/styles'

import { getData } from './selectors'
import Success from './template.success'

const Wrapper = styled.div`
  margin-top: 8px;
  margin-left: 0;

  ${media.atLeastTabletL`
    margin-left: 24px;
  `}
`

const CoinPerformance = () => {
  const priceChart = useSelector(getPriceChart)

  const data = useSelector((state: RootState) => getData(state, priceChart))
  return (
    <Wrapper>
      {data.cata({
        Failure: () => null,
        Loading: () => <SkeletonRectangle width='100px' height='16px' />,
        NotAsked: () => <SkeletonRectangle width='100px' height='16px' />,
        Success: ({ priceChange }) => <Success priceChange={priceChange} />
      })}
    </Wrapper>
  )
}

export default CoinPerformance
