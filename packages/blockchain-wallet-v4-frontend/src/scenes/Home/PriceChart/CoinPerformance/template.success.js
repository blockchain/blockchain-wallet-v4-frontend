import React from 'react'
import styled from 'styled-components'
import { Exchange } from 'blockchain-wallet-v4/src'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { Text } from 'blockchain-info-components'
import { getPriceChartTime } from './services'

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
    priceFormatted = `-${Exchange.getSymbol(currency)}${Currency.formatFiat(
      priceChange
    ).substring(1)}`
  } else {
    priceFormatted =
      Exchange.getSymbol(currency) + Currency.formatFiat(priceChange)
  }
  return `${priceFormatted} (${Currency.formatFiat(pricePercentageChange)}%)`
}

const Success = ({
  currency,
  priceChartTime,
  priceChange,
  pricePercentageChange
}) => {
  return (
    <Wrapper>
      <Text size='12px' color={priceChange >= 0 ? 'success' : 'sent'}>
        {buildPriceDisplay(currency, priceChange, pricePercentageChange)}
      </Text>
      <Text size='12px' color='lightblue-gray'>
        {getPriceChartTime(priceChartTime)}
      </Text>
    </Wrapper>
  )
}

export default Success
