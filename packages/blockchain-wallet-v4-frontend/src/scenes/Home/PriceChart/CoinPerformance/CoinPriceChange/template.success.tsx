import React from 'react'
import { PriceChangeType } from 'blockchain-wallet-v4/src/redux/data/misc/types'
import { PriceChange } from 'blockchain-wallet-v4-frontend/src/scenes/Transactions/model'
import styled from 'styled-components'

import { Props as OwnProps, SuccessStateType } from '.'
import { getPriceChartTime } from './services'

const Wrapper = styled.div`
  z-index: 1;
  margin-top: 8px;
`

const Success: React.FC<Props> = props => {
  return (
    <Wrapper>
      <PriceChange {...props}>
        {' '}
        {getPriceChartTime(props.priceChart.time)}
      </PriceChange>
    </Wrapper>
  )
}

type Props = OwnProps & SuccessStateType & { priceChange: PriceChangeType }

export default Success
