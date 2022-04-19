import React from 'react'

import { Text } from 'blockchain-info-components'
import { Tooltip } from 'components/Chart'
import { Padding } from 'components/Padding'

import { CoinChartTooltipComponent } from './types'

export const CoinChartTooltip: CoinChartTooltipComponent = ({
  left,
  offsetLeft,
  offsetTop,
  subtitle,
  title,
  top
}) => {
  return (
    <Tooltip top={top} left={left} offsetLeft={offsetLeft} offsetTop={offsetTop}>
      <Padding all={12}>
        <Text size='12px' lineHeight='16px' color='white' weight={600}>
          {title}
        </Text>

        <Text size='12px' lineHeight='16px' color='white' weight={600}>
          {subtitle}
        </Text>
      </Padding>
    </Tooltip>
  )
}
