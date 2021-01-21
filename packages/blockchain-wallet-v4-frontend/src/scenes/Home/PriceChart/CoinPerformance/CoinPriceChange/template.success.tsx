import React from 'react'
import styled from 'styled-components'

import { getPriceChartTime } from './services'
import { Props as OwnProps, SuccessStateType } from '.'
import { PriceChange } from 'blockchain-wallet-v4-frontend/src/scenes/Transactions/model'
import { PriceChangeType } from 'core/redux/data/misc/types'

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
