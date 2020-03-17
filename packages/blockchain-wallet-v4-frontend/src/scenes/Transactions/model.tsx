import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { Text } from 'blockchain-info-components'
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
  currencySymbol,
  priceChangeFiat,
  priceChangePercentage,
  children
}) => {
  let priceFormatted
  if (priceChangeFiat < 0) {
    priceFormatted = `-${currencySymbol}${Currency.formatFiat(
      priceChangeFiat
    ).substring(1)}`
  } else {
    priceFormatted = currencySymbol + Currency.formatFiat(priceChangeFiat)
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
