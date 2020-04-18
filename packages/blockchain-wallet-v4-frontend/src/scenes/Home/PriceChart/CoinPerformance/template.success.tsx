import { Exchange } from 'blockchain-wallet-v4/src'
import { formatFiat } from 'core/exchange/currency'
import { getPriceChartTime } from './services'
import { Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  z-index: 1;
  margin-top: 8px;
  display: flex;
  > div:last-child {
    margin-left: 4px;
  }
`

const buildPriceDisplay = (currency, priceChange, pricePercentageChange) => {
  let priceFormatted
  if (priceChange < 0) {
    priceFormatted = `-${Exchange.getSymbol(currency)}${formatFiat(
      priceChange
    ).substring(1)}`
  } else {
    priceFormatted = Exchange.getSymbol(currency) + formatFiat(priceChange)
  }
  return `${priceFormatted} (${formatFiat(pricePercentageChange)}%)`
}

const Success = ({
  currency,
  priceChartTime,
  priceChange,
  pricePercentageChange
}) => {
  return (
    <Wrapper>
      <Text
        size='12px'
        color={priceChange >= 0 ? 'green600' : 'red600'}
        weight={500}
      >
        {buildPriceDisplay(currency, priceChange, pricePercentageChange)}
      </Text>
      <Text size='12px' color='grey300' weight={500}>
        {getPriceChartTime(priceChartTime)}
      </Text>
    </Wrapper>
  )
}

export default Success
