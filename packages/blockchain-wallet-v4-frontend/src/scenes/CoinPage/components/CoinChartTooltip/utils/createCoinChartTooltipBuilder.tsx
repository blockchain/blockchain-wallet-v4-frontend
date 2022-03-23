import React from 'react'
import moment from 'moment'

import { CoinData, TooltipBuilder } from '../../CoinChart'
import { CoinChartTooltip } from '../CoinChartTooltip'

export const createCoinChartTooltipBuilder =
  <DATA extends CoinData = CoinData>(): TooltipBuilder<DATA> =>
  ({ cursorTop, getX, getY, tooltipData, tooltipLeft }) =>
    (
      <CoinChartTooltip
        top={cursorTop}
        left={tooltipLeft}
        offsetLeft={22}
        offsetTop={-28}
        title={moment(getX(tooltipData)).format('MMM D, hh:mm a')}
        subtitle={getY(tooltipData).toString()}
      />
    )
