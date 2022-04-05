import React, { ReactNode, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { colors } from '@blockchain-com/constellation'

import { selectors } from 'data'

import { createCoinChartTooltipBuilder } from '../../../CoinChartTooltip'
import { ResponsiveCoinChart } from '../../../ResponsiveCoinChart'
import { createDateFormatterFromSelectedTimeRange } from '../../utils/createChartDateFormatterFromSelectedTimeRange'
import { findNumTicksFromTimeRange } from '../../utils/findNumTicksFromTimeRange'
import { usePriceIndexSeries } from '../usePriceIndexSeries'
import { UseChartArgs } from './types'

export const useChart = ({ timeRange }: UseChartArgs): [ReactNode] => {
  const seriesData = useSelector(selectors.core.data.misc.getPriceIndexSeries)

  const data = usePriceIndexSeries(seriesData.data)

  const xFormatter = useMemo(() => {
    return createDateFormatterFromSelectedTimeRange(timeRange)
  }, [timeRange])

  const chartNode = useMemo(() => {
    return seriesData.cata({
      Failure: () => <span>Failure</span>,
      Loading: () => <span>Loading</span>,
      NotAsked: () => <span>NotAsked</span>,
      Success: () => (
        <ResponsiveCoinChart
          data={data}
          backgroundColor={colors.white60}
          primaryColor={colors.blue600}
          textColor={colors.grey400}
          x='date'
          y='price'
          xFormatter={xFormatter}
          numTicks={findNumTicksFromTimeRange(timeRange)}
          tooltip={createCoinChartTooltipBuilder()}
        />
      )
    })
  }, [seriesData, data, xFormatter])

  return [chartNode]
}
