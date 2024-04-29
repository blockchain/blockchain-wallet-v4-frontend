import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { Exchange } from '@core'
import { formatFiat } from '@core/exchange/utils'
import { FiatType, PriceChangeType, PriceMovementDirType } from '@core/types'
import { Text } from 'blockchain-info-components'

const PriceChangeText = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  color: ${(props) => props.theme.grey600};
`

const PriceChangeColoredText = styled.span<{ movement: PriceMovementDirType }>`
  font-weight: 600;
  color: ${(props) =>
    props.movement === 'down'
      ? props.theme.red600
      : props.movement === 'up'
      ? props.theme.green600
      : props.theme.grey600};
`

export const PriceChange = ({
  children = null,
  currency,
  isPortfolioPosition = false,
  priceChange
}: {
  children?: ReactNode
  currency: FiatType
  isPortfolioPosition?: boolean
  priceChange: PriceChangeType
}) => {
  const { diff, movement, percentChange } = isPortfolioPosition
    ? priceChange.positionChange
    : priceChange.overallChange
  const price = formatFiat(diff)
  const priceChangePercentFormatted = formatFiat(percentChange)
  let priceFormatted

  if (movement === 'down') {
    priceFormatted = `-${Exchange.getSymbol(currency)}${price.substring(1)}`
  } else {
    priceFormatted = `${Exchange.getSymbol(currency)}${price}`
  }

  const hasNanValues = Number.isNaN(Number(diff)) || Number.isNaN(Number(percentChange))
  if (hasNanValues) return null

  return (
    <PriceChangeText>
      <PriceChangeColoredText movement={movement}>
        {priceFormatted} ({priceChangePercentFormatted})%
      </PriceChangeColoredText>
      {children}
    </PriceChangeText>
  )
}
