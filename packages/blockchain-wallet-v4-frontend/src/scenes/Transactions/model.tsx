import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { Text } from 'blockchain-info-components'
import Currencies from 'core/exchange/currencies'
import React from 'react'
import styled from 'styled-components'

const PriceChangeText = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
  color: ${props => props.theme.grey600};
`

const PriceChangeColoredText = styled.span<{ priceChange: number }>`
  font-weight: 600;
  color: ${props =>
    props.priceChange === 0
      ? props.theme.grey600
      : props.priceChange > 0
      ? props.theme.green400
      : props.theme.red500};
`

export const PriceChange = ({
  currency,
  priceChangeFiat,
  priceChangePercentage,
  children
}) => {
  let priceFormatted
  let price = Currency.fiatToString({
    value: priceChangeFiat,
    unit: Currencies[currency][currency]
  })
  if (priceChangeFiat < 0) {
    priceFormatted = `-${price}`
  } else {
    priceFormatted = price
  }

  return (
    <PriceChangeText>
      <PriceChangeColoredText priceChange={priceChangePercentage}>
        {priceFormatted} ({Currency.formatFiat(priceChangePercentage)})%
      </PriceChangeColoredText>
      {children}
    </PriceChangeText>
  )
}
