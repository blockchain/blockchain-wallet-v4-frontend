import { Exchange } from 'blockchain-wallet-v4/src'
import { FiatType, PriceChangeType } from 'core/types'
import { formatFiat } from 'blockchain-wallet-v4/src/exchange/currency'
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

const PriceChangeColoredText = styled.span<{
  priceChange: PriceChangeType
}>`
  font-weight: 600;
  color: ${props =>
    props.priceChange.movement === 'down'
      ? props.theme.red500
      : props.priceChange.movement === 'up'
      ? props.theme.green400
      : props.theme.grey600};
`

export const PriceChange = ({
  currency,
  priceChange,
  children
}: {
  children: any
  currency: FiatType
  priceChange: PriceChangeType
}) => {
  let priceFormatted
  let price = formatFiat(priceChange.diff)
  if (priceChange.movement === 'down') {
    priceFormatted = `-${Exchange.getSymbol(currency)}${price.substring(1)}`
  } else {
    priceFormatted = `${Exchange.getSymbol(currency)}${price}`
  }

  return (
    <PriceChangeText>
      <PriceChangeColoredText priceChange={priceChange}>
        {priceFormatted} ({formatFiat(priceChange.percentChange)})%
      </PriceChangeColoredText>
      {children}
    </PriceChangeText>
  )
}
