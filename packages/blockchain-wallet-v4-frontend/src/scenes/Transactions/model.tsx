import { Exchange } from 'blockchain-wallet-v4/src'
import { FiatType, PriceChangeType, PriceDiffType } from 'core/types'
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
  change: PriceDiffType
}>`
  font-weight: 600;
  color: ${props =>
    props.change.movement === 'down'
      ? props.theme.red500
      : props.change.movement === 'up'
      ? props.theme.green400
      : props.theme.grey600};
`

export const PriceChange = ({
  currency,
  priceChange,
  isPortfolioPosition,
  children
}: {
  children: any
  currency: FiatType
  isPortfolioPosition?: boolean
  priceChange: PriceChangeType
}) => {
  const change = isPortfolioPosition
    ? priceChange.positionChange
    : priceChange.overallChange
  let priceFormatted
  let price = formatFiat(change.diff)
  if (change.movement === 'down') {
    priceFormatted = `-${Exchange.getSymbol(currency)}${price.substring(1)}`
  } else {
    priceFormatted = `${Exchange.getSymbol(currency)}${price}`
  }

  return (
    <PriceChangeText>
      <PriceChangeColoredText change={change}>
        {priceFormatted} ({formatFiat(change.percentChange)})%
      </PriceChangeColoredText>
      {children}
    </PriceChangeText>
  )
}
