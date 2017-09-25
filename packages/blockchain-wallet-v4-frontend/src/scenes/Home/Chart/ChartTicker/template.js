import React from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const TickerText = styled(Text)`
  cursor: pointer;
`

const ChartTicker = (props) => {
  const { coin, rate, selectedCoin } = props

  return (
    <TickerText size='24px' weight={300} color={coin === selectedCoin ? 'brand-primary' : 'gray-1'}>
      {`${coin} = ${rate}`}
    </TickerText>
  )
}

export default ChartTicker
