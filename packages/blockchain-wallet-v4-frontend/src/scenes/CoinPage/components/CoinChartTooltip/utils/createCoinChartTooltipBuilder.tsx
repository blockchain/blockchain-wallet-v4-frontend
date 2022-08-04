import React from 'react'
import { format } from 'date-fns'

import { CoinData, TooltipBuilder } from '../../CoinChart'
import { CoinChartTooltip } from '../CoinChartTooltip'

type CreateCoinChartTooltipBuilderProps = {
  yFormatter?: (value: number) => string
}

type CreateCoinChartTooltipBuilder = <DATA extends CoinData = CoinData>(
  props?: CreateCoinChartTooltipBuilderProps
) => TooltipBuilder<DATA>

export const createCoinChartTooltipBuilder: CreateCoinChartTooltipBuilder =
  ({ yFormatter } = {}) =>
  ({ cursorTop, getX, getY, tooltipData, tooltipLeft }) =>
    (
      <CoinChartTooltip
        top={cursorTop}
        left={tooltipLeft}
        offsetLeft={22}
        offsetTop={-28}
        title={format(new Date(getX(tooltipData)), 'MMM d, hh:mm aaa')}
        subtitle={
          yFormatter
            ? yFormatter(getY(tooltipData).valueOf())
            : getY(tooltipData).valueOf().toString()
        }
      />
    )
