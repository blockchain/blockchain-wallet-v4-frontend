import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { Exchange } from '@core'
import { formatFiat } from '@core/exchange/utils'
import { FiatType, PriceChangeType, PriceDiffType } from '@core/types'
import { Text } from 'blockchain-info-components'

const PriceChangeText = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  color: ${(props) => props.theme.grey600};
`

const PriceChangeColoredText = styled.span<{
  change: PriceDiffType
}>`
  font-weight: 600;
  color: ${(props) =>
    props.change.movement === 'down'
      ? props.theme.red600
      : props.change.movement === 'up'
      ? props.theme.green600
      : props.theme.grey600};
`

export const PriceChange = ({
  children,
  currency,
  isPortfolioPosition,
  priceChange
}: {
  children: ReactNode
  currency: FiatType
  isPortfolioPosition?: boolean
  priceChange: PriceChangeType
}) => {
  const change = isPortfolioPosition ? priceChange.positionChange : priceChange.overallChange
  const price = formatFiat(change.diff)
  const priceChangePercentFormatted = formatFiat(change.percentChange)
  let priceFormatted

  if (change.movement === 'down') {
    priceFormatted = `-${Exchange.getSymbol(currency)}${price.substring(1)}`
  } else {
    priceFormatted = `${Exchange.getSymbol(currency)}${price}`
  }

  const hasNanValues = Number.isNaN(Number(price)) || Number.isNaN(Number(change.percentChange))

  if (hasNanValues) return null

  return (
    <PriceChangeText>
      <PriceChangeColoredText change={change}>
        {priceFormatted} ({priceChangePercentFormatted})%
      </PriceChangeColoredText>
      {children}
    </PriceChangeText>
  )
}
