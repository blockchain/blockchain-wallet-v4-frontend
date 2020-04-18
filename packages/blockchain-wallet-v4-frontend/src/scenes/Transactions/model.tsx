import { Exchange } from 'blockchain-wallet-v4/src'
import { FiatType } from 'core/types'
import { formatFiat } from 'core/exchange/currency'
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
  currency,
  priceChangeFiat,
  priceChangePercentage,
  children
}: {
  children: any
  currency: FiatType
  priceChangeFiat: number
  priceChangePercentage: number
}) => {
  let priceFormatted
  let price = formatFiat(priceChangeFiat)
  if (priceChangeFiat < 0) {
    priceFormatted = `-${Exchange.getSymbol(currency)}${price.substring(1)}`
  } else {
    priceFormatted = `${Exchange.getSymbol(currency)}${price}`
  }

  return (
    <PriceChangeText>
      <PriceChangeColoredText priceChange={priceChangePercentage}>
        {priceFormatted} ({formatFiat(priceChangePercentage)})%
      </PriceChangeColoredText>
      {children}
    </PriceChangeText>
  )
}
